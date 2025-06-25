import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

class DiagnosticQueries {
  private supabase: any

  constructor() {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async runDiagnostics() {
    console.log('🔍 SAL OS DATABASE DIAGNOSTICS')
    console.log('==============================')
    console.log(`URL: ${supabaseUrl}`)
    console.log(`Key: ${supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'undefined'}`)
    console.log('')

    await this.checkSupabaseVersion()
    await this.checkAuthCheckFunction()
    await this.checkJournalEntriesPolicies()
    await this.checkAllPolicies()
    await this.testAuthCheckDirectly()
    await this.testJournalEntriesAccess()
    await this.checkRLSStatus()
  }

  private async checkSupabaseVersion() {
    console.log('1️⃣ SUPABASE VERSION & PLAN CHECK')
    console.log('=================================')
    
    try {
      // Try to get version info
      const { data: versionData, error: versionError } = await this.supabase
        .rpc('version')

      if (versionError) {
        console.log(`❌ Version check error: ${versionError.message}`)
      } else {
        console.log(`📋 Supabase version: ${versionData}`)
      }

      // Check if we can access system catalogs
      console.log('\n📋 Checking system access...')
      
      // This will help determine plan level based on available functions
      const { data: functionData, error: functionError } = await this.supabase
        .rpc('auth_check')

      if (functionError) {
        console.log(`✅ auth_check function exists (error expected): ${functionError.message}`)
      } else {
        console.log(`❌ auth_check function should throw error but returned data`)
      }

    } catch (error) {
      console.log(`❌ Version check failed: ${error}`)
    }
  }

  private async checkAuthCheckFunction() {
    console.log('\n2️⃣ AUTH_CHECK FUNCTION DIAGNOSTIC')
    console.log('==================================')
    
    try {
      // Test direct function call
      console.log('📋 Testing auth_check() function directly:')
      const { data: functionTest, error: functionError } = await this.supabase
        .rpc('auth_check')

      if (functionError) {
        console.log(`✅ Function exists and throws error: ${functionError.message}`)
      } else {
        console.log('❌ Function should throw error but returned data')
      }

      // Test function in a SELECT context
      console.log('\n📋 Testing auth_check() in SELECT context:')
      try {
        const { data: selectTest, error: selectError } = await this.supabase
          .from('journal_entries')
          .select('*')
          .limit(1)

        if (selectError) {
          console.log(`📝 SELECT error: ${selectError.message}`)
          if (selectError.message.includes('Authentication required')) {
            console.log(`✅ auth_check() is being called in SELECT`)
          } else if (selectError.message.includes('row-level security policy')) {
            console.log(`✅ RLS policy is blocking SELECT`)
          } else {
            console.log(`⚠️ Unexpected SELECT error type`)
          }
        } else {
          console.log(`❌ SELECT allowed - returned ${selectTest?.length || 0} rows`)
        }
      } catch (error) {
        console.log(`❌ SELECT test failed: ${error}`)
      }

    } catch (error) {
      console.log(`❌ Auth check diagnostic failed: ${error}`)
    }
  }

  private async checkJournalEntriesPolicies() {
    console.log('\n3️⃣ JOURNAL_ENTRIES POLICIES CHECK')
    console.log('==================================')
    
    try {
      // Try to get policies using a different approach
      console.log('📋 Attempting to check policies via direct query...')
      
      // Test if we can access the table at all
      const { data: tableTest, error: tableError } = await this.supabase
        .from('journal_entries')
        .select('id')
        .limit(1)

      if (tableError) {
        console.log(`📝 Table access error: ${tableError.message}`)
      } else {
        console.log(`📝 Table accessible - returned ${tableTest?.length || 0} rows`)
      }

      // Test different operations to see what's blocked
      console.log('\n📋 Testing all operations on journal_entries:')
      
      const operations = [
        { name: 'SELECT', test: () => this.supabase.from('journal_entries').select('*').limit(1) },
        { name: 'INSERT', test: () => this.supabase.from('journal_entries').insert({ title: 'test', content: 'test', user_id: '00000000-0000-0000-0000-000000000000' }).select().single() },
        { name: 'UPDATE', test: () => this.supabase.from('journal_entries').update({ title: 'updated' }).order('id', { ascending: true }).limit(1) },
        { name: 'DELETE', test: () => this.supabase.from('journal_entries').delete().order('id', { ascending: true }).limit(1) }
      ]

      for (const operation of operations) {
        try {
          const { data, error } = await operation.test()
          
          if (error) {
            console.log(`  ❌ ${operation.name}: ${error.message}`)
          } else {
            console.log(`  ✅ ${operation.name}: Allowed (${data?.length || 0} rows)`)
          }
        } catch (error) {
          console.log(`  ❌ ${operation.name}: Test failed - ${error}`)
        }
      }

    } catch (error) {
      console.log(`❌ Journal entries policy check failed: ${error}`)
    }
  }

  private async checkAllPolicies() {
    console.log('\n4️⃣ ALL POLICIES CHECK')
    console.log('=====================')
    
    try {
      // Test each table to see what operations are blocked
      const tables = [
        'journal_entries',
        'vocabulary_words', 
        'tasks',
        'books',
        'life_arenas',
        'growth_goals',
        'journey_maps'
      ]

      console.log('📋 Testing SELECT operations on all tables:')
      
      for (const tableName of tables) {
        try {
          const { data, error } = await this.supabase
            .from(tableName)
            .select('id')
            .limit(1)

          if (error) {
            console.log(`  ❌ ${tableName}: ${error.message}`)
          } else {
            console.log(`  ✅ ${tableName}: Allowed (${data?.length || 0} rows)`)
          }
        } catch (error) {
          console.log(`  ❌ ${tableName}: Test failed - ${error}`)
        }
      }

    } catch (error) {
      console.log(`❌ All policies check failed: ${error}`)
    }
  }

  private async testAuthCheckDirectly() {
    console.log('\n5️⃣ DIRECT AUTH_CHECK TEST')
    console.log('==========================')
    
    try {
      console.log('📋 Testing auth_check() function in isolation:')
      
      // Test the function directly
      const { data: directTest, error: directError } = await this.supabase
        .rpc('auth_check')

      if (directError) {
        console.log(`✅ Direct call error: ${directError.message}`)
      } else {
        console.log('❌ Direct call should throw error but returned data')
      }

      // Test with a simple query that should trigger auth_check
      console.log('\n📋 Testing auth_check() in simple query:')
      try {
        const { data: simpleTest, error: simpleError } = await this.supabase
          .from('journal_entries')
          .select('id')
          .limit(1)

        if (simpleError) {
          console.log(`📝 Simple query error: ${simpleError.message}`)
        } else {
          console.log(`📝 Simple query allowed - returned ${simpleTest?.length || 0} rows`)
        }
      } catch (error) {
        console.log(`❌ Simple query failed: ${error}`)
      }

    } catch (error) {
      console.log(`❌ Direct auth_check test failed: ${error}`)
    }
  }

  private async testJournalEntriesAccess() {
    console.log('\n6️⃣ JOURNAL_ENTRIES ACCESS TEST')
    console.log('==============================')
    
    try {
      console.log('📋 Testing journal_entries access with different approaches:')
      
      // Test 1: Simple SELECT
      console.log('\n📋 Test 1: Simple SELECT')
      try {
        const { data: select1, error: error1 } = await this.supabase
          .from('journal_entries')
          .select('*')
          .limit(1)
        
        if (error1) {
          console.log(`  ❌ Error: ${error1.message}`)
        } else {
          console.log(`  ✅ Success: ${select1?.length || 0} rows`)
        }
      } catch (error) {
        console.log(`  ❌ Exception: ${error}`)
      }

      // Test 2: SELECT with specific columns
      console.log('\n📋 Test 2: SELECT specific columns')
      try {
        const { data: select2, error: error2 } = await this.supabase
          .from('journal_entries')
          .select('id, title, created_at')
          .limit(1)
        
        if (error2) {
          console.log(`  ❌ Error: ${error2.message}`)
        } else {
          console.log(`  ✅ Success: ${select2?.length || 0} rows`)
        }
      } catch (error) {
        console.log(`  ❌ Exception: ${error}`)
      }

      // Test 3: COUNT query
      console.log('\n📋 Test 3: COUNT query')
      try {
        const { data: count, error: error3 } = await this.supabase
          .from('journal_entries')
          .select('*', { count: 'exact', head: true })
        
        if (error3) {
          console.log(`  ❌ Error: ${error3.message}`)
        } else {
          console.log(`  ✅ Success: Count = ${count}`)
        }
      } catch (error) {
        console.log(`  ❌ Exception: ${error}`)
      }

    } catch (error) {
      console.log(`❌ Journal entries access test failed: ${error}`)
    }
  }

  private async checkRLSStatus() {
    console.log('\n7️⃣ RLS STATUS SUMMARY')
    console.log('=====================')
    
    try {
      console.log('📋 Summary of current RLS behavior:')
      
      // Test all operations on journal_entries
      const operations = [
        { name: 'SELECT', test: () => this.supabase.from('journal_entries').select('*').limit(1) },
        { name: 'INSERT', test: () => this.supabase.from('journal_entries').insert({ title: 'test', content: 'test', user_id: '00000000-0000-0000-0000-000000000000' }).select().single() },
        { name: 'UPDATE', test: () => this.supabase.from('journal_entries').update({ title: 'updated' }).order('id', { ascending: true }).limit(1) },
        { name: 'DELETE', test: () => this.supabase.from('journal_entries').delete().order('id', { ascending: true }).limit(1) }
      ]

      console.log('\n📋 Final RLS Test Results:')
      
      for (const operation of operations) {
        try {
          const { data, error } = await operation.test()
          
          if (error) {
            if (error.message.includes('Authentication required')) {
              console.log(`  ✅ ${operation.name}: BLOCKED by auth_check()`)
            } else if (error.message.includes('row-level security policy')) {
              console.log(`  ✅ ${operation.name}: BLOCKED by RLS policy`)
            } else {
              console.log(`  ⚠️ ${operation.name}: BLOCKED by other error - ${error.message}`)
            }
          } else {
            console.log(`  ❌ ${operation.name}: ALLOWED (${data?.length || 0} rows)`)
          }
        } catch (error) {
          console.log(`  ❌ ${operation.name}: Test failed - ${error}`)
        }
      }

      console.log('\n📝 DIAGNOSTIC SUMMARY:')
      console.log('Based on these tests, we can determine:')
      console.log('1. Whether auth_check() function exists and works')
      console.log('2. Which operations are blocked vs allowed')
      console.log('3. Whether RLS policies are properly applied')
      console.log('4. The exact error messages for troubleshooting')

    } catch (error) {
      console.log(`❌ RLS status check failed: ${error}`)
    }
  }
}

// Run the diagnostic queries
async function runDiagnosticQueries() {
  try {
    const diagnostics = new DiagnosticQueries()
    await diagnostics.runDiagnostics()
  } catch (error) {
    console.error('❌ Diagnostic queries failed to start:', error)
    process.exit(1)
  }
}

runDiagnosticQueries()
  .then(() => {
    console.log('\n🏁 Diagnostic queries complete!')
    console.log('\n📋 NEXT STEPS:')
    console.log('1. Review the output above for exact error messages')
    console.log('2. Check if auth_check() function is working')
    console.log('3. Verify which operations are blocked vs allowed')
    console.log('4. Use this information to troubleshoot RLS policy deployment')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Diagnostic queries failed:', error)
    process.exit(1)
  }) 