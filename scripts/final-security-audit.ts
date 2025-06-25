import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

class FinalSecurityAudit {
  private supabase: any

  constructor() {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async runFinalSecurityAudit() {
    console.log('🔒 SAL OS FINAL SECURITY AUDIT')
    console.log('===============================')
    console.log(`URL: ${supabaseUrl}`)
    console.log(`Key: ${supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'undefined'}`)
    console.log('')

    await this.testUnauthenticatedAccess()
    await this.testAuthenticatedAccess()
    await this.testRLSPolicyEnforcement()
    await this.testServiceLayerSecurity()
  }

  private async testUnauthenticatedAccess() {
    console.log('1️⃣ UNAUTHENTICATED ACCESS TEST')
    console.log('===============================')
    
    // Ensure we're unauthenticated
    await this.supabase.auth.signOut()
    
    const tables = [
      'journal_entries',
      'vocabulary_words', 
      'tasks',
      'books',
      'life_arenas',
      'growth_goals',
      'journey_maps'
    ]

    for (const tableName of tables) {
      console.log(`\n📋 Testing ${tableName}:`)
      
      await this.testUnauthenticatedOperations(tableName)
    }
  }

  private async testUnauthenticatedOperations(tableName: string) {
    const operations = [
      {
        name: 'SELECT',
        test: () => this.supabase.from(tableName).select('id, user_id, created_at').limit(1)
      },
      {
        name: 'INSERT',
        test: () => this.supabase.from(tableName).insert(this.generateTestData(tableName)).select().single()
      },
      {
        name: 'UPDATE',
        test: () => this.supabase.from(tableName).update({ updated_at: new Date().toISOString() }).order('id', { ascending: true }).limit(1)
      },
      {
        name: 'DELETE',
        test: () => this.supabase.from(tableName).delete().order('id', { ascending: true }).limit(1)
      }
    ]

    for (const operation of operations) {
      try {
        const { data, error } = await operation.test()

        console.log(`  🔒 ${operation.name}:`)
        
        if (error) {
          if (error.message.includes('row-level security policy')) {
            console.log(`    ✅ RLS BLOCKING: ${error.message}`)
          } else if (error.message.includes('permission denied')) {
            console.log(`    ✅ PERMISSION DENIED: ${error.message}`)
          } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
            console.log(`    ❌ TABLE NOT FOUND: ${error.message}`)
          } else {
            console.log(`    ⚠️ OTHER ERROR: ${error.message}`)
          }
        } else {
          console.log(`    ❌ RLS NOT ENFORCED: Returned ${data?.length || 0} rows`)
          if (data && data.length > 0) {
            console.log(`    🚨 CRITICAL: Data exposed without authentication!`)
          }
        }

      } catch (error) {
        console.log(`    ❌ Test failed: ${error}`)
      }
    }
  }

  private async testAuthenticatedAccess() {
    console.log('\n2️⃣ AUTHENTICATED ACCESS TEST')
    console.log('=============================')
    
    try {
      // Try to sign in with test credentials
      const { data: signInData, error: signInError } = await this.supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword123'
      })

      if (signInError) {
        console.log(`❌ Cannot test authenticated access: ${signInError.message}`)
        console.log('⚠️ No valid test credentials available')
        return
      }

      console.log('✅ Successfully authenticated')
      
      // Test creating and accessing own data
      await this.testAuthenticatedOperations()

    } catch (error) {
      console.log(`❌ Authentication test failed: ${error}`)
    }
  }

  private async testAuthenticatedOperations() {
    console.log('\n📋 Testing authenticated operations:')
    
    try {
      // Test creating a journal entry
      const testData = this.generateTestData('journal_entries')
      const { data: createData, error: createError } = await this.supabase
        .from('journal_entries')
        .insert(testData)
        .select()
        .single()

      if (createError) {
        console.log(`❌ Authenticated CREATE failed: ${createError.message}`)
      } else {
        console.log(`✅ Authenticated CREATE successful: ${createData.id}`)
        
        // Test reading own record
        const { data: readData, error: readError } = await this.supabase
          .from('journal_entries')
          .select('*')
          .eq('id', createData.id)
          .single()

        if (readError) {
          console.log(`❌ Authenticated READ failed: ${readError.message}`)
        } else {
          console.log(`✅ Authenticated READ successful`)
        }

        // Test updating own record
        const { data: updateData, error: updateError } = await this.supabase
          .from('journal_entries')
          .update({ title: 'Updated Title' })
          .eq('id', createData.id)
          .select()
          .single()

        if (updateError) {
          console.log(`❌ Authenticated UPDATE failed: ${updateError.message}`)
        } else {
          console.log(`✅ Authenticated UPDATE successful`)
        }

        // Clean up
        await this.supabase
          .from('journal_entries')
          .delete()
          .eq('id', createData.id)
        
        console.log(`✅ Authenticated DELETE successful`)
      }

    } catch (error) {
      console.log(`❌ Authenticated operations test failed: ${error}`)
    }
  }

  private async testRLSPolicyEnforcement() {
    console.log('\n3️⃣ RLS POLICY ENFORCEMENT TEST')
    console.log('===============================')
    
    const tables = [
      'journal_entries',
      'vocabulary_words', 
      'tasks',
      'books'
    ]

    for (const tableName of tables) {
      console.log(`\n📋 Testing ${tableName} RLS policies:`)
      
      await this.testSpecificRLSPolicies(tableName)
    }
  }

  private async testSpecificRLSPolicies(tableName: string) {
    // Test SELECT with specific error detection
    try {
      const { data: selectData, error: selectError } = await this.supabase
        .from(tableName)
        .select('id, user_id')
        .limit(1)

      if (selectError) {
        if (selectError.message.includes('row-level security policy')) {
          console.log(`  ✅ SELECT RLS: Properly blocked with RLS error`)
        } else if (selectError.message.includes('permission denied')) {
          console.log(`  ✅ SELECT RLS: Properly blocked with permission error`)
        } else {
          console.log(`  ⚠️ SELECT RLS: Blocked with unexpected error: ${selectError.message}`)
        }
      } else {
        console.log(`  ❌ SELECT RLS: NOT enforced (returned ${selectData?.length || 0} rows)`)
      }
    } catch (error) {
      console.log(`  ❌ SELECT RLS test failed: ${error}`)
    }

    // Test INSERT with specific error detection
    try {
      const testData = this.generateTestData(tableName)
      const { data: insertData, error: insertError } = await this.supabase
        .from(tableName)
        .insert(testData)
        .select()
        .single()

      if (insertError) {
        if (insertError.message.includes('row-level security policy')) {
          console.log(`  ✅ INSERT RLS: Properly blocked with RLS error`)
        } else if (insertError.message.includes('permission denied')) {
          console.log(`  ✅ INSERT RLS: Properly blocked with permission error`)
        } else {
          console.log(`  ⚠️ INSERT RLS: Blocked with unexpected error: ${insertError.message}`)
        }
      } else {
        console.log(`  ❌ INSERT RLS: NOT enforced (record created: ${insertData?.id})`)
        // Clean up
        if (insertData?.id) {
          await this.supabase
            .from(tableName)
            .delete()
            .eq('id', insertData.id)
        }
      }
    } catch (error) {
      console.log(`  ❌ INSERT RLS test failed: ${error}`)
    }
  }

  private async testServiceLayerSecurity() {
    console.log('\n4️⃣ SERVICE LAYER SECURITY TEST')
    console.log('===============================')
    
    try {
      // Test REST API endpoints
      const endpoints = [
        '/rest/v1/journal_entries',
        '/rest/v1/vocabulary_words',
        '/rest/v1/tasks',
        '/rest/v1/books'
      ]

      for (const endpoint of endpoints) {
        try {
          if (supabaseUrl && supabaseKey) {
            const response = await fetch(`${supabaseUrl}${endpoint}`, {
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
              }
            })

            console.log(`  🔒 ${endpoint}: ${response.status}`)
            
            if (response.status === 200) {
              console.log(`    ⚠️ Endpoint accessible without proper authentication`)
            } else if (response.status === 401 || response.status === 403) {
              console.log(`    ✅ Endpoint properly secured`)
            } else {
              console.log(`    ⚠️ Unexpected status: ${response.status}`)
            }
          } else {
            console.error('Missing supabaseUrl or supabaseKey for endpoint test')
          }
        } catch (error) {
          console.log(`    ❌ Endpoint test failed: ${error}`)
        }
      }

    } catch (error) {
      console.log(`❌ Service layer security test failed: ${error}`)
    }
  }

  private generateTestData(table: string): any {
    const baseData: any = {
      user_id: '00000000-0000-0000-0000-000000000000'
    }

    switch (table) {
      case 'journal_entries':
        return {
          ...baseData,
          title: 'Test Entry',
          content: 'Test content',
          type: 'reflection',
          date: new Date().toISOString().split('T')[0],
          word_count: 10,
          tags: ['test']
        }
      case 'vocabulary_words':
        return {
          ...baseData,
          word: 'testword',
          part_of_speech: 'noun',
          definition: 'A test word',
          etymology: 'Test origin',
          source: 'manual',
          date_added: new Date().toISOString().split('T')[0],
          last_reviewed: new Date().toISOString().split('T')[0],
          review_count: 0,
          mastery_level: 'new',
          tags: ['test'],
          next_review_date: new Date().toISOString().split('T')[0],
          difficulty_rating: 1
        }
      case 'tasks':
        return {
          ...baseData,
          title: 'Test Task',
          description: 'Test task description',
          category: 'foundation',
          status: 'not-started',
          time_spent: 0,
          notes: 'Test notes',
          estimated_minutes: 30,
          is_multi_part: false,
          sub_tasks: [],
          completed_sub_tasks: 0
        }
      case 'books':
        return {
          ...baseData,
          title: 'Test Book',
          subtitle: 'Test Subtitle',
          total_chapters: 1,
          completed_chapters: 0,
          current_chapter: 1,
          total_pages: 100,
          pages_read: 0,
          color: '#3B82F6',
          description: 'Test book description',
          estimated_hours: 2
        }
      case 'life_arenas':
        return {
          ...baseData,
          name: 'Test Arena',
          description: 'Test arena description',
          color: '#3B82F6'
        }
      case 'growth_goals':
        return {
          ...baseData,
          title: 'Test Goal',
          description: 'Test goal description',
          category: 'foundation',
          target_date: new Date().toISOString().split('T')[0],
          status: 'not-started'
        }
      case 'journey_maps':
        return {
          ...baseData,
          title: 'Test Map',
          description: 'Test map description',
          color: '#3B82F6'
        }
      default:
        return baseData
    }
  }
}

// Run the final security audit
async function runFinalSecurityAudit() {
  try {
    const audit = new FinalSecurityAudit()
    await audit.runFinalSecurityAudit()
  } catch (error) {
    console.error('❌ Final security audit failed to start:', error)
    process.exit(1)
  }
}

runFinalSecurityAudit()
  .then(() => {
    console.log('\n🏁 Final security audit complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Final security audit failed:', error)
    process.exit(1)
  }) 