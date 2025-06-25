import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

class RLSFinalTest {
  private supabase: any

  constructor() {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async runFinalTest() {
    console.log('🔒 SAL OS FINAL RLS PRODUCTION TEST')
    console.log('====================================')
    console.log(`URL: ${supabaseUrl}`)
    console.log(`Key: ${supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'undefined'}`)
    console.log('')

    await this.testRLSEnforcement()
    await this.testAuthEndpoint()
    await this.testServiceLayer()
  }

  private async testRLSEnforcement() {
    console.log('1️⃣ FINAL RLS ENFORCEMENT TEST')
    console.log('==============================')
    
    const tables = ['journal_entries', 'tasks', 'books', 'vocabulary_words']
    
    for (const table of tables) {
      console.log(`\n📋 Testing ${table}:`)
      
      try {
        // Test SELECT with specific column access
        const { data: selectData, error: selectError } = await this.supabase
          .from(table)
          .select('id, user_id, created_at')
          .limit(1)

        console.log(`  SELECT (unauthenticated):`)
        if (selectError) {
          console.log(`    ✅ RLS blocking SELECT: ${selectError.message}`)
          if (selectError.message.includes('row-level security policy')) {
            console.log(`    🎯 RLS POLICY WORKING CORRECTLY`)
          } else {
            console.log(`    ⚠️ Different error type: ${selectError.message}`)
          }
        } else {
          console.log(`    ❌ RLS NOT blocking SELECT (returned ${selectData?.length || 0} rows)`)
          if (selectData && selectData.length > 0) {
            console.log(`    🚨 CRITICAL: Data exposed without authentication!`)
          } else {
            console.log(`    ⚠️ Table empty, but RLS should still block access`)
          }
        }

        // Test INSERT with proper error handling
        const testData = this.generateTestData(table)
        const { data: insertData, error: insertError } = await this.supabase
          .from(table)
          .insert(testData)
          .select()
          .single()

        console.log(`  INSERT (unauthenticated):`)
        if (insertError) {
          console.log(`    ✅ RLS blocking INSERT: ${insertError.message}`)
          if (insertError.message.includes('row-level security policy')) {
            console.log(`    🎯 RLS POLICY WORKING CORRECTLY`)
          }
        } else {
          console.log(`    ❌ RLS NOT blocking INSERT (record created: ${insertData?.id})`)
          // Clean up
          if (insertData?.id) {
            await this.supabase
              .from(table)
              .delete()
              .eq('id', insertData.id)
          }
        }

        // Test UPDATE with proper ORDER BY
        const { data: updateData, error: updateError } = await this.supabase
          .from(table)
          .update({ updated_at: new Date().toISOString() })
          .order('id', { ascending: true })
          .limit(1)

        console.log(`  UPDATE (unauthenticated):`)
        if (updateError) {
          console.log(`    ✅ RLS blocking UPDATE: ${updateError.message}`)
          if (updateError.message.includes('row-level security policy')) {
            console.log(`    🎯 RLS POLICY WORKING CORRECTLY`)
          }
        } else {
          console.log(`    ❌ RLS NOT blocking UPDATE (${updateData?.length || 0} rows affected)`)
        }

        // Test DELETE with proper ORDER BY
        const { data: deleteData, error: deleteError } = await this.supabase
          .from(table)
          .delete()
          .order('id', { ascending: true })
          .limit(1)

        console.log(`  DELETE (unauthenticated):`)
        if (deleteError) {
          console.log(`    ✅ RLS blocking DELETE: ${deleteError.message}`)
          if (deleteError.message.includes('row-level security policy')) {
            console.log(`    🎯 RLS POLICY WORKING CORRECTLY`)
          }
        } else {
          console.log(`    ❌ RLS NOT blocking DELETE (${deleteData?.length || 0} rows affected)`)
        }

      } catch (error) {
        console.log(`  ❌ Test failed: ${error}`)
      }
    }
  }

  private async testAuthEndpoint() {
    console.log('\n2️⃣ AUTH ENDPOINT TEST')
    console.log('=====================')
    
    try {
      if (supabaseUrl && supabaseKey) {
        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        })

        console.log(`Auth endpoint status: ${response.status}`)
        if (response.status === 200) {
          console.log('✅ Auth endpoint working')
        } else if (response.status === 404) {
          console.log('❌ Auth endpoint returning 404')
        } else {
          console.log(`⚠️ Auth endpoint status: ${response.status}`)
        }

        // Test sign-in functionality
        const { data: signInData, error: signInError } = await this.supabase.auth.signInWithPassword({
          email: 'test@example.com',
          password: 'testpassword123'
        })

        if (signInError) {
          console.log(`Sign-in error (expected): ${signInError.message}`)
          if (signInError.message.includes('Invalid login credentials')) {
            console.log('✅ Auth service working (properly rejecting invalid credentials)')
          } else {
            console.log('⚠️ Unexpected auth error')
          }
        } else {
          console.log('❌ Auth service not working (accepted invalid credentials)')
        }
      } else {
        console.error('Missing supabaseUrl or supabaseKey for auth endpoint test')
      }

    } catch (error) {
      console.log(`❌ Auth test failed: ${error}`)
    }
  }

  private async testServiceLayer() {
    console.log('\n3️⃣ SERVICE LAYER TEST')
    console.log('======================')
    
    try {
      // Test service layer imports
      const services = [
        'journalService',
        'vocabularyService', 
        'tasksService',
        'booksService',
        'lifeArenasService',
        'growthEngineService',
        'journeyMapService'
      ]

      for (const serviceName of services) {
        try {
          const service = await import(`../services/${serviceName}`)
          console.log(`✅ ${serviceName}: Imported successfully`)
        } catch (error) {
          console.log(`❌ ${serviceName}: Import failed - ${error}`)
        }
      }

      // Test TypeScript types
      console.log('\n📋 TypeScript Types:')
      try {
        const types = await import('../types/database')
        console.log('✅ Database types: Available')
      } catch (error) {
        console.log('❌ Database types: Missing')
      }

    } catch (error) {
      console.log(`❌ Service layer test failed: ${error}`)
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

// Run the final test
async function runFinalTest() {
  try {
    const test = new RLSFinalTest()
    await test.runFinalTest()
  } catch (error) {
    console.error('❌ Final test failed to start:', error)
    process.exit(1)
  }
}

runFinalTest()
  .then(() => {
    console.log('\n🏁 Final RLS production test complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Final test failed:', error)
    process.exit(1)
  }) 