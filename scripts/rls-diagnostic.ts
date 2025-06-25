import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

class RLSDiagnostic {
  private supabase: any

  constructor() {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async runRLSDiagnostic() {
    console.log('🔒 SAL OS RLS DIAGNOSTIC')
    console.log('========================')
    console.log(`URL: ${supabaseUrl}`)
    console.log(`Key: ${supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'undefined'}`)
    console.log('')

    await this.testRLSEnforcement()
    await this.testAuthenticatedAccess()
    await this.testUnauthenticatedAccess()
    await this.checkRLSPolicies()
    await this.testUserOwnership()
  }

  private async testRLSEnforcement() {
    console.log('1️⃣ TESTING RLS ENFORCEMENT')
    console.log('==========================')
    
    const tables = ['journal_entries', 'tasks', 'books', 'vocabulary_words']
    
    for (const table of tables) {
      console.log(`\n📋 Testing ${table}:`)
      
      try {
        // Test unauthenticated SELECT
        const { data: selectData, error: selectError } = await this.supabase
          .from(table)
          .select('*')
          .limit(1)

        console.log(`  SELECT (unauthenticated):`)
        if (selectError) {
          console.log(`    ❌ Error: ${selectError.message}`)
          if (selectError.message.includes('row-level security policy')) {
            console.log(`    ✅ RLS blocking SELECT (expected)`)
          } else {
            console.log(`    ⚠️ Unexpected error type`)
          }
        } else {
          console.log(`    ❌ RLS NOT blocking SELECT (data returned: ${selectData?.length || 0} rows)`)
        }

        // Test unauthenticated INSERT
        const testData = this.generateTestData(table)
        const { data: insertData, error: insertError } = await this.supabase
          .from(table)
          .insert(testData)
          .select()
          .single()

        console.log(`  INSERT (unauthenticated):`)
        if (insertError) {
          console.log(`    ❌ Error: ${insertError.message}`)
          if (insertError.message.includes('row-level security policy')) {
            console.log(`    ✅ RLS blocking INSERT (expected)`)
          } else {
            console.log(`    ⚠️ Unexpected error type`)
          }
        } else {
          console.log(`    ❌ RLS NOT blocking INSERT (record created: ${insertData?.id})`)
          // Clean up if record was created
          if (insertData?.id) {
            await this.supabase
              .from(table)
              .delete()
              .eq('id', insertData.id)
          }
        }

        // Test unauthenticated UPDATE
        const { data: updateData, error: updateError } = await this.supabase
          .from(table)
          .update({ updated_at: new Date().toISOString() })
          .limit(1)

        console.log(`  UPDATE (unauthenticated):`)
        if (updateError) {
          console.log(`    ❌ Error: ${updateError.message}`)
          if (updateError.message.includes('row-level security policy')) {
            console.log(`    ✅ RLS blocking UPDATE (expected)`)
          } else {
            console.log(`    ⚠️ Unexpected error type`)
          }
        } else {
          console.log(`    ❌ RLS NOT blocking UPDATE (${updateData?.length || 0} rows affected)`)
        }

        // Test unauthenticated DELETE
        const { data: deleteData, error: deleteError } = await this.supabase
          .from(table)
          .delete()
          .limit(1)

        console.log(`  DELETE (unauthenticated):`)
        if (deleteError) {
          console.log(`    ❌ Error: ${deleteError.message}`)
          if (deleteError.message.includes('row-level security policy')) {
            console.log(`    ✅ RLS blocking DELETE (expected)`)
          } else {
            console.log(`    ⚠️ Unexpected error type`)
          }
        } else {
          console.log(`    ❌ RLS NOT blocking DELETE (${deleteData?.length || 0} rows affected)`)
        }

      } catch (error) {
        console.log(`  ❌ Test failed: ${error}`)
      }
    }
  }

  private async testAuthenticatedAccess() {
    console.log('\n2️⃣ TESTING AUTHENTICATED ACCESS')
    console.log('===============================')
    
    // First, try to sign in with a test user
    try {
      const { data: signInData, error: signInError } = await this.supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword123'
      })

      if (signInError) {
        console.log(`❌ Sign-in failed: ${signInError.message}`)
        console.log('⚠️ Cannot test authenticated access without valid credentials')
        return
      }

      console.log('✅ Successfully authenticated')
      
      // Test authenticated access
      const { data: sessionData } = await this.supabase.auth.getSession()
      console.log(`Session user: ${sessionData.session?.user?.id}`)

      // Test creating a record as authenticated user
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

        // Clean up
        await this.supabase
          .from('journal_entries')
          .delete()
          .eq('id', createData.id)
      }

    } catch (error) {
      console.log(`❌ Authentication test failed: ${error}`)
    }
  }

  private async testUnauthenticatedAccess() {
    console.log('\n3️⃣ TESTING UNAUTHENTICATED ACCESS')
    console.log('==================================')
    
    // Sign out to ensure we're unauthenticated
    await this.supabase.auth.signOut()
    
    const { data: sessionData } = await this.supabase.auth.getSession()
    if (sessionData.session) {
      console.log('⚠️ Still authenticated, cannot test unauthenticated access')
      return
    }

    console.log('✅ Confirmed unauthenticated state')

    // Test existential_levels (should be publicly readable)
    try {
      const { data: existentialData, error: existentialError } = await this.supabase
        .from('existential_levels')
        .select('*')
        .limit(1)

      if (existentialError) {
        console.log(`❌ existential_levels access failed: ${existentialError.message}`)
      } else {
        console.log(`✅ existential_levels publicly accessible (${existentialData?.length || 0} rows)`)
      }
    } catch (error) {
      console.log(`❌ existential_levels test failed: ${error}`)
    }

    // Test protected table (should be blocked)
    try {
      const { data: protectedData, error: protectedError } = await this.supabase
        .from('journal_entries')
        .select('*')
        .limit(1)

      if (protectedError) {
        console.log(`✅ journal_entries properly blocked: ${protectedError.message}`)
      } else {
        console.log(`❌ journal_entries accessible without authentication (${protectedData?.length || 0} rows)`)
      }
    } catch (error) {
      console.log(`❌ journal_entries test failed: ${error}`)
    }
  }

  private async checkRLSPolicies() {
    console.log('\n4️⃣ CHECKING RLS POLICIES')
    console.log('=========================')
    
    try {
      // Check if RLS is enabled on tables
      const tables = ['journal_entries', 'tasks', 'books', 'vocabulary_words']
      
      for (const table of tables) {
        console.log(`\n📋 Checking RLS for ${table}:`)
        
        // Try to query the table directly to see if RLS is working
        const { data, error } = await this.supabase
          .from(table)
          .select('*')
          .limit(1)

        if (error) {
          console.log(`  ❌ Error: ${error.message}`)
          if (error.message.includes('row-level security policy')) {
            console.log(`  ✅ RLS is working (blocking access)`)
          } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
            console.log(`  ❌ Table does not exist`)
          } else {
            console.log(`  ⚠️ Unexpected error: ${error.message}`)
          }
        } else {
          console.log(`  ❌ RLS NOT working (data returned: ${data?.length || 0} rows)`)
        }
      }

    } catch (error) {
      console.log(`❌ RLS policy check failed: ${error}`)
    }
  }

  private async testUserOwnership() {
    console.log('\n5️⃣ TESTING USER OWNERSHIP')
    console.log('==========================')
    
    try {
      // Test if user_id is being set correctly
      const testData = this.generateTestData('journal_entries')
      
      // Remove user_id to test if trigger sets it
      delete testData.user_id
      
      const { data: insertData, error: insertError } = await this.supabase
        .from('journal_entries')
        .insert(testData)
        .select()
        .single()

      if (insertError) {
        console.log(`❌ Insert failed: ${insertError.message}`)
        if (insertError.message.includes('row-level security policy')) {
          console.log(`✅ RLS blocking insert (expected for unauthenticated user)`)
        }
      } else {
        console.log(`✅ Insert successful: ${insertData.id}`)
        console.log(`User ID: ${insertData.user_id}`)
        
        if (insertData.user_id) {
          console.log(`✅ User ID auto-populated`)
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
      console.log(`❌ User ownership test failed: ${error}`)
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
      default:
        return baseData
    }
  }
}

// Run the diagnostic
async function runRLSDiagnostic() {
  try {
    const diagnostic = new RLSDiagnostic()
    await diagnostic.runRLSDiagnostic()
  } catch (error) {
    console.error('❌ RLS diagnostic failed to start:', error)
    process.exit(1)
  }
}

runRLSDiagnostic()
  .then(() => {
    console.log('\n🏁 RLS diagnostic complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ RLS diagnostic failed:', error)
    process.exit(1)
  }) 