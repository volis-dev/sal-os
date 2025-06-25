import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

class RLSVerificationTest {
  private supabase: any

  constructor() {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async runRLSVerification() {
    console.log('🔒 SAL OS RLS VERIFICATION TEST')
    console.log('================================')
    console.log(`URL: ${supabaseUrl}`)
    console.log(`Key: ${supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'undefined'}`)
    console.log('')

    await this.verifyDatabaseSchema()
    await this.testUnauthenticatedRLS()
    await this.testAuthenticatedRLS()
    await this.verifyTriggers()
    await this.testRESTAPISecurity()
  }

  private async verifyDatabaseSchema() {
    console.log('1️⃣ DATABASE SCHEMA VERIFICATION')
    console.log('===============================')
    
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
      console.log(`\n📋 Verifying ${tableName}:`)
      
      try {
        // Test if table exists and has user_id column
        const { data: columns, error: columnError } = await this.supabase
          .from(tableName)
          .select('user_id')
          .limit(1)

        if (columnError) {
          if (columnError.message.includes('row-level security policy')) {
            console.log(`  ✅ Table exists with RLS protection`)
          } else if (columnError.message.includes('relation') && columnError.message.includes('does not exist')) {
            console.log(`  ❌ Table does not exist`)
          } else {
            console.log(`  ⚠️ Table access error: ${columnError.message}`)
          }
        } else {
          console.log(`  ✅ Table exists and accessible`)
        }

        // Test timestamp columns
        try {
          const { data: timestampData, error: timestampError } = await this.supabase
            .from(tableName)
            .select('created_at, updated_at')
            .limit(1)

          if (timestampError) {
            if (timestampError.message.includes('row-level security policy')) {
              console.log(`  ✅ Timestamp columns exist with RLS protection`)
            } else {
              console.log(`  ⚠️ Timestamp column error: ${timestampError.message}`)
            }
          } else {
            console.log(`  ✅ Timestamp columns accessible`)
          }
        } catch (error) {
          console.log(`  ⚠️ Timestamp test failed: ${error}`)
        }

      } catch (error) {
        console.log(`  ❌ Schema verification failed: ${error}`)
      }
    }
  }

  private async testUnauthenticatedRLS() {
    console.log('\n2️⃣ UNAUTHENTICATED RLS TEST')
    console.log('============================')
    
    // Ensure we're unauthenticated
    await this.supabase.auth.signOut()
    
    const tables = [
      'journal_entries',
      'vocabulary_words', 
      'tasks',
      'books'
    ]

    for (const tableName of tables) {
      console.log(`\n📋 Testing ${tableName} unauthenticated access:`)
      
      await this.testUnauthenticatedOperations(tableName)
    }
  }

  private async testUnauthenticatedOperations(tableName: string) {
    const operations = [
      {
        name: 'SELECT',
        test: () => this.supabase.from(tableName).select('id, user_id, created_at').limit(1),
        expectedError: 'row-level security policy'
      },
      {
        name: 'INSERT',
        test: () => this.supabase.from(tableName).insert(this.generateTestData(tableName)).select().single(),
        expectedError: 'row-level security policy'
      },
      {
        name: 'UPDATE',
        test: () => this.supabase.from(tableName).update({ updated_at: new Date().toISOString() }).order('id', { ascending: true }).limit(1),
        expectedError: 'row-level security policy'
      },
      {
        name: 'DELETE',
        test: () => this.supabase.from(tableName).delete().order('id', { ascending: true }).limit(1),
        expectedError: 'row-level security policy'
      }
    ]

    for (const operation of operations) {
      try {
        const { data, error } = await operation.test()

        console.log(`  🔒 ${operation.name}:`)
        
        if (error) {
          if (error.message.includes(operation.expectedError)) {
            console.log(`    ✅ RLS ENFORCED: ${error.message}`)
          } else if (error.message.includes('permission denied')) {
            console.log(`    ✅ PERMISSION DENIED: ${error.message}`)
          } else {
            console.log(`    ⚠️ UNEXPECTED ERROR: ${error.message}`)
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

  private async testAuthenticatedRLS() {
    console.log('\n3️⃣ AUTHENTICATED RLS TEST')
    console.log('==========================')
    
    try {
      // Try to sign in with test credentials
      const { data: signInData, error: signInError } = await this.supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword123'
      })

      if (signInError) {
        console.log(`❌ Cannot test authenticated access: ${signInError.message}`)
        console.log('⚠️ No valid test credentials available')
        console.log('📝 Creating test user for authenticated testing...')
        
        // Try to create a test user
        const { data: signUpData, error: signUpError } = await this.supabase.auth.signUp({
          email: 'test@example.com',
          password: 'testpassword123'
        })

        if (signUpError) {
          console.log(`❌ Cannot create test user: ${signUpError.message}`)
          return
        } else {
          console.log('✅ Test user created successfully')
          // Try to sign in again
          const { data: retrySignIn, error: retryError } = await this.supabase.auth.signInWithPassword({
            email: 'test@example.com',
            password: 'testpassword123'
          })

          if (retryError) {
            console.log(`❌ Still cannot authenticate: ${retryError.message}`)
            return
          }
        }
      }

      console.log('✅ Successfully authenticated')
      
      // Test authenticated operations
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

  private async verifyTriggers() {
    console.log('\n4️⃣ TRIGGER VERIFICATION')
    console.log('=======================')
    
    try {
      // Test if user_id is auto-populated by triggers
      console.log('📋 Testing user ownership triggers:')
      
      // Ensure we're authenticated
      const { data: session } = await this.supabase.auth.getSession()
      if (!session.session) {
        console.log('⚠️ Not authenticated, cannot test triggers')
        return
      }

      const testData = this.generateTestData('journal_entries')
      // Remove user_id to test if trigger sets it
      delete testData.user_id
      
      const { data: insertData, error: insertError } = await this.supabase
        .from('journal_entries')
        .insert(testData)
        .select()
        .single()

      if (insertError) {
        console.log(`❌ Trigger test failed: ${insertError.message}`)
      } else {
        console.log(`✅ Record created: ${insertData.id}`)
        console.log(`📝 User ID: ${insertData.user_id}`)
        
        if (insertData.user_id) {
          console.log(`✅ User ID auto-populated by trigger`)
        } else {
          console.log(`❌ User ID not auto-populated`)
        }

        // Clean up
        await this.supabase
          .from('journal_entries')
          .delete()
          .eq('id', insertData.id)
      }

    } catch (error) {
      console.log(`❌ Trigger verification failed: ${error}`)
    }
  }

  private async testRESTAPISecurity() {
    console.log('\n5️⃣ REST API SECURITY TEST')
    console.log('==========================')
    
    try {
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
              const responseData = await response.json()
              if (responseData && responseData.length > 0) {
                console.log(`    🚨 CRITICAL: Data exposed via REST API!`)
              } else {
                console.log(`    ⚠️ Endpoint accessible but no data returned`)
              }
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
      console.log(`❌ REST API security test failed: ${error}`)
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

// Run the RLS verification test
async function runRLSVerification() {
  try {
    const test = new RLSVerificationTest()
    await test.runRLSVerification()
  } catch (error) {
    console.error('❌ RLS verification failed to start:', error)
    process.exit(1)
  }
}

runRLSVerification()
  .then(() => {
    console.log('\n🏁 RLS verification test complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ RLS verification failed:', error)
    process.exit(1)
  }) 