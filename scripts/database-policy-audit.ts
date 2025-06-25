import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

interface TableInfo {
  tableName: string
  exists: boolean
  policies: PolicyInfo[]
  hasSelect: boolean
  hasInsert: boolean
  hasUpdate: boolean
  hasDelete: boolean
  complete: boolean
}

interface PolicyInfo {
  tablename: string
  policyname: string
  permissive: string
  roles: string[]
  cmd: string
  qual: string
  with_check: string
}

interface AuthCheckInfo {
  exists: boolean
  definition: string | null
}

class DatabasePolicyAudit {
  private supabase: any

  constructor() {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async runDatabaseAudit() {
    console.log('🔍 SAL OS DATABASE POLICY AUDIT')
    console.log('===============================')
    console.log(`URL: ${supabaseUrl}`)
    console.log(`Key: ${supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'undefined'}`)
    console.log('')

    await this.checkAuthCheckFunction()
    await this.listExistingTables()
    await this.auditRLSPolicies()
    await this.testUnauthenticatedAccess()
    await this.generatePolicySummary()
  }

  private async checkAuthCheckFunction() {
    console.log('1️⃣ AUTH_CHECK() FUNCTION VERIFICATION')
    console.log('=====================================')
    
    try {
      // Check if auth_check function exists
      const { data: functionData, error: functionError } = await this.supabase
        .rpc('exec_sql', {
          sql: `
            SELECT 
              proname, 
              prosrc,
              pg_get_functiondef(oid) as definition
            FROM pg_proc 
            WHERE proname = 'auth_check'
          `
        })

      if (functionError) {
        console.log(`❌ Error checking auth_check function: ${functionError.message}`)
        return
      }

      if (functionData && functionData.length > 0) {
        const func = functionData[0]
        console.log('✅ auth_check() function exists')
        console.log(`📝 Function name: ${func.proname}`)
        console.log(`📝 Function source: ${func.prosrc}`)
        console.log(`📝 Full definition:`)
        console.log(func.definition)
      } else {
        console.log('❌ auth_check() function does not exist')
      }

      // Test the function directly
      console.log('\n🧪 Testing auth_check() function:')
      try {
        const { data: testData, error: testError } = await this.supabase
          .rpc('auth_check')

        if (testError) {
          console.log(`✅ Function throws error as expected: ${testError.message}`)
        } else {
          console.log('❌ Function should throw error but returned data')
        }
      } catch (error) {
        console.log(`⚠️ Function test error: ${error}`)
      }

    } catch (error) {
      console.log(`❌ Function verification failed: ${error}`)
    }
  }

  private async listExistingTables() {
    console.log('\n2️⃣ EXISTING TABLES IN PUBLIC SCHEMA')
    console.log('====================================')
    
    try {
      const { data: tables, error } = await this.supabase
        .rpc('exec_sql', {
          sql: `
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            ORDER BY tablename
          `
        })

      if (error) {
        console.log(`❌ Error listing tables: ${error.message}`)
        return
      }

      console.log(`📋 Found ${tables.length} tables in public schema:`)
      tables.forEach((table: any, index: number) => {
        console.log(`  ${index + 1}. ${table.tablename}`)
      })

      // Expected tables for comparison
      const expectedTables = [
        'journal_entries',
        'vocabulary_words', 
        'tasks',
        'books',
        'life_arenas',
        'growth_goals',
        'journey_maps',
        'vocabulary_reviews',
        'task_time_logs',
        'book_notes',
        'goal_progress',
        'arena_metrics',
        'journey_waypoints',
        'vocabulary_sources',
        'task_categories',
        'book_categories'
      ]

      console.log('\n📊 TABLE COMPARISON:')
      console.log(`Expected: ${expectedTables.length} tables`)
      console.log(`Found: ${tables.length} tables`)

      const existingTableNames = tables.map((t: any) => t.tablename)
      const missingTables = expectedTables.filter(t => !existingTableNames.includes(t))
      const extraTables = existingTableNames.filter((t: string) => !expectedTables.includes(t))

      if (missingTables.length > 0) {
        console.log(`\n❌ Missing tables (${missingTables.length}):`)
        missingTables.forEach(table => console.log(`  - ${table}`))
      }

      if (extraTables.length > 0) {
        console.log(`\n➕ Extra tables (${extraTables.length}):`)
        extraTables.forEach((table: string) => console.log(`  - ${table}`))
      }

    } catch (error) {
      console.log(`❌ Table listing failed: ${error}`)
    }
  }

  private async auditRLSPolicies() {
    console.log('\n3️⃣ RLS POLICY AUDIT')
    console.log('====================')
    
    try {
      const { data: policies, error } = await this.supabase
        .rpc('exec_sql', {
          sql: `
            SELECT 
              tablename,
              policyname,
              permissive,
              roles,
              cmd,
              qual,
              with_check
            FROM pg_policies 
            WHERE schemaname = 'public'
            ORDER BY tablename, cmd
          `
        })

      if (error) {
        console.log(`❌ Error fetching policies: ${error.message}`)
        return
      }

      console.log(`📋 Found ${policies.length} RLS policies:`)
      
      if (policies.length === 0) {
        console.log('❌ No RLS policies found!')
        return
      }

      // Group policies by table
      const policiesByTable = policies.reduce((acc: any, policy: any) => {
        if (!acc[policy.tablename]) {
          acc[policy.tablename] = []
        }
        acc[policy.tablename].push(policy)
        return acc
      }, {})

      Object.entries(policiesByTable).forEach(([tableName, tablePolicies]: [string, any]) => {
        console.log(`\n📋 ${tableName} (${tablePolicies.length} policies):`)
        tablePolicies.forEach((policy: any) => {
          console.log(`  🔒 ${policy.cmd.toUpperCase()}: ${policy.policyname}`)
          console.log(`     Roles: ${policy.roles.join(', ')}`)
          console.log(`     Qual: ${policy.qual || 'N/A'}`)
          console.log(`     With Check: ${policy.with_check || 'N/A'}`)
        })
      })

    } catch (error) {
      console.log(`❌ Policy audit failed: ${error}`)
    }
  }

  private async testUnauthenticatedAccess() {
    console.log('\n4️⃣ UNAUTHENTICATED ACCESS TEST')
    console.log('===============================')
    
    // Ensure we're unauthenticated
    await this.supabase.auth.signOut()
    
    try {
      // Get list of existing tables
      const { data: tables, error: tableError } = await this.supabase
        .rpc('exec_sql', {
          sql: `
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            ORDER BY tablename
          `
        })

      if (tableError) {
        console.log(`❌ Error getting tables: ${tableError.message}`)
        return
      }

      console.log('🧪 Testing unauthenticated SELECT access:')
      
      for (const table of tables) {
        const tableName = table.tablename
        console.log(`\n📋 Testing ${tableName}:`)
        
        try {
          const { data, error } = await this.supabase
            .from(tableName)
            .select('id')
            .limit(1)

          if (error) {
            console.log(`  ❌ Error: ${error.message}`)
            if (error.message.includes('row-level security policy')) {
              console.log(`    ✅ RLS policy is blocking access`)
            } else if (error.message.includes('Authentication required')) {
              console.log(`    ✅ auth_check() function is blocking access`)
            } else {
              console.log(`    ⚠️ Unexpected error type`)
            }
          } else {
            console.log(`  ⚠️ No error returned - returned ${data?.length || 0} rows`)
            if (data && data.length > 0) {
              console.log(`    🚨 CRITICAL: Data exposed without authentication!`)
            }
          }
        } catch (error) {
          console.log(`  ❌ Test failed: ${error}`)
        }
      }

    } catch (error) {
      console.log(`❌ Unauthenticated access test failed: ${error}`)
    }
  }

  private async generatePolicySummary() {
    console.log('\n5️⃣ POLICY SUMMARY REPORT')
    console.log('=========================')
    
    try {
      // Get all tables
      const { data: tables, error: tableError } = await this.supabase
        .rpc('exec_sql', {
          sql: `
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            ORDER BY tablename
          `
        })

      if (tableError) {
        console.log(`❌ Error getting tables: ${tableError.message}`)
        return
      }

      // Get all policies
      const { data: policies, error: policyError } = await this.supabase
        .rpc('exec_sql', {
          sql: `
            SELECT 
              tablename,
              cmd
            FROM pg_policies 
            WHERE schemaname = 'public'
          `
        })

      if (policyError) {
        console.log(`❌ Error getting policies: ${policyError.message}`)
        return
      }

      // Analyze each table
      const tableAnalysis: TableInfo[] = []
      
      for (const table of tables) {
        const tableName = table.tablename
        const tablePolicies = policies.filter((p: any) => p.tablename === tableName)
        
        const analysis: TableInfo = {
          tableName,
          exists: true,
          policies: [],
          hasSelect: tablePolicies.some((p: any) => p.cmd === 'SELECT'),
          hasInsert: tablePolicies.some((p: any) => p.cmd === 'INSERT'),
          hasUpdate: tablePolicies.some((p: any) => p.cmd === 'UPDATE'),
          hasDelete: tablePolicies.some((p: any) => p.cmd === 'DELETE'),
          complete: false
        }
        
        analysis.complete = analysis.hasSelect && analysis.hasInsert && analysis.hasUpdate && analysis.hasDelete
        tableAnalysis.push(analysis)
      }

      // Summary statistics
      const totalTables = tableAnalysis.length
      const tablesWithPolicies = tableAnalysis.filter(t => t.policies.length > 0).length
      const completeTables = tableAnalysis.filter(t => t.complete).length
      const incompleteTables = tableAnalysis.filter(t => !t.complete && (t.hasSelect || t.hasInsert || t.hasUpdate || t.hasDelete)).length
      const noPoliciesTables = tableAnalysis.filter(t => !t.hasSelect && !t.hasInsert && !t.hasUpdate && !t.hasDelete).length

      console.log(`\n📊 POLICY COVERAGE SUMMARY:`)
      console.log(`Total tables: ${totalTables}`)
      console.log(`Tables with any policies: ${tablesWithPolicies}`)
      console.log(`Tables with complete policies: ${completeTables}`)
      console.log(`Tables with incomplete policies: ${incompleteTables}`)
      console.log(`Tables with no policies: ${noPoliciesTables}`)

      // Detailed breakdown
      console.log(`\n📋 DETAILED BREAKDOWN:`)
      
      if (completeTables > 0) {
        console.log(`\n✅ COMPLETE TABLES (${completeTables}):`)
        tableAnalysis.filter(t => t.complete).forEach(t => {
          console.log(`  - ${t.tableName}: SELECT ✅ INSERT ✅ UPDATE ✅ DELETE ✅`)
        })
      }

      if (incompleteTables > 0) {
        console.log(`\n⚠️ INCOMPLETE TABLES (${incompleteTables}):`)
        tableAnalysis.filter(t => !t.complete && (t.hasSelect || t.hasInsert || t.hasUpdate || t.hasDelete)).forEach(t => {
          const policies: string[] = []
          if (t.hasSelect) policies.push('SELECT')
          if (t.hasInsert) policies.push('INSERT')
          if (t.hasUpdate) policies.push('UPDATE')
          if (t.hasDelete) policies.push('DELETE')
          console.log(`  - ${t.tableName}: ${policies.join(' ✅ ')} ❌ Missing: ${['SELECT', 'INSERT', 'UPDATE', 'DELETE'].filter(p => !policies.includes(p)).join(', ')}`)
        })
      }

      if (noPoliciesTables > 0) {
        console.log(`\n❌ NO POLICIES (${noPoliciesTables}):`)
        tableAnalysis.filter(t => !t.hasSelect && !t.hasInsert && !t.hasUpdate && !t.hasDelete).forEach(t => {
          console.log(`  - ${t.tableName}: No RLS policies at all`)
        })
      }

      // Recommendations
      console.log(`\n📝 RECOMMENDATIONS:`)
      
      if (noPoliciesTables > 0) {
        console.log(`🚨 CRITICAL: ${noPoliciesTables} tables have no RLS policies`)
        console.log(`   - These tables are completely unprotected`)
        console.log(`   - Immediate action required`)
      }
      
      if (incompleteTables > 0) {
        console.log(`🔧 INCOMPLETE: ${incompleteTables} tables have partial policies`)
        console.log(`   - Add missing policies for complete protection`)
      }
      
      if (completeTables === totalTables) {
        console.log(`✅ EXCELLENT: All tables have complete RLS policies`)
      }

    } catch (error) {
      console.log(`❌ Policy summary generation failed: ${error}`)
    }
  }
}

// Run the database policy audit
async function runDatabasePolicyAudit() {
  try {
    const audit = new DatabasePolicyAudit()
    await audit.runDatabaseAudit()
  } catch (error) {
    console.error('❌ Database policy audit failed to start:', error)
    process.exit(1)
  }
}

runDatabasePolicyAudit()
  .then(() => {
    console.log('\n🏁 Database policy audit complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Database policy audit failed:', error)
    process.exit(1)
  }) 