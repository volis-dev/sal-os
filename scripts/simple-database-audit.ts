import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

interface TableInfo {
  tableName: string
  exists: boolean
  hasSelect: boolean
  hasInsert: boolean
  hasUpdate: boolean
  hasDelete: boolean
  complete: boolean
  errorMessage?: string
}

class SimpleDatabaseAudit {
  private supabase: any

  constructor() {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async runSimpleAudit() {
    console.log('🔍 SAL OS SIMPLE DATABASE AUDIT')
    console.log('===============================')
    console.log(`URL: ${supabaseUrl}`)
    console.log(`Key: ${supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'undefined'}`)
    console.log('')

    await this.checkAuthCheckFunction()
    await this.testExistingTables()
    await this.testUnauthenticatedAccess()
    await this.generateSummary()
  }

  private async checkAuthCheckFunction() {
    console.log('1️⃣ AUTH_CHECK() FUNCTION VERIFICATION')
    console.log('=====================================')
    
    try {
      // Test if auth_check() function exists and works
      const { data: functionTest, error: functionError } = await this.supabase
        .rpc('auth_check')

      if (functionError) {
        if (functionError.message.includes('Authentication required')) {
          console.log('✅ auth_check() function exists and throws proper error')
          console.log(`📝 Error message: "${functionError.message}"`)
        } else {
          console.log(`❌ auth_check() function error: ${functionError.message}`)
        }
      } else {
        console.log('❌ auth_check() function should throw error but returned data')
      }

    } catch (error) {
      console.log(`❌ Function verification failed: ${error}`)
    }
  }

  private async testExistingTables() {
    console.log('\n2️⃣ EXISTING TABLES TEST')
    console.log('========================')
    
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

    const tableResults: TableInfo[] = []

    for (const tableName of expectedTables) {
      console.log(`\n📋 Testing ${tableName}:`)
      
      const tableInfo: TableInfo = {
        tableName,
        exists: false,
        hasSelect: false,
        hasInsert: false,
        hasUpdate: false,
        hasDelete: false,
        complete: false
      }

      // Test if table exists by trying to select from it
      try {
        const { data: selectData, error: selectError } = await this.supabase
          .from(tableName)
          .select('id')
          .limit(1)

        if (selectError) {
          if (selectError.message.includes('relation') && selectError.message.includes('does not exist')) {
            console.log(`  ❌ Table does not exist`)
            tableInfo.errorMessage = 'Table does not exist'
          } else if (selectError.message.includes('row-level security policy')) {
            console.log(`  ✅ Table exists with RLS protection`)
            tableInfo.exists = true
            tableInfo.hasSelect = true
          } else if (selectError.message.includes('Authentication required')) {
            console.log(`  ✅ Table exists with auth_check() protection`)
            tableInfo.exists = true
            tableInfo.hasSelect = true
          } else {
            console.log(`  ⚠️ Table exists but unexpected error: ${selectError.message}`)
            tableInfo.exists = true
            tableInfo.errorMessage = selectError.message
          }
        } else {
          console.log(`  ⚠️ Table exists but no RLS protection (returned ${selectData?.length || 0} rows)`)
          tableInfo.exists = true
        }

        // Test INSERT if table exists
        if (tableInfo.exists) {
          try {
            const testData = this.generateTestData(tableName)
            const { data: insertData, error: insertError } = await this.supabase
              .from(tableName)
              .insert(testData)
              .select()
              .single()

            if (insertError) {
              if (insertError.message.includes('Authentication required')) {
                console.log(`  ✅ INSERT protected by auth_check()`)
                tableInfo.hasInsert = true
              } else if (insertError.message.includes('row-level security policy')) {
                console.log(`  ✅ INSERT protected by RLS`)
                tableInfo.hasInsert = true
              } else {
                console.log(`  ⚠️ INSERT error: ${insertError.message}`)
              }
            } else {
              console.log(`  ❌ INSERT not protected`)
            }
          } catch (error) {
            console.log(`  ❌ INSERT test failed: ${error}`)
          }
        }

        // Test UPDATE if table exists
        if (tableInfo.exists) {
          try {
            const { data: updateData, error: updateError } = await this.supabase
              .from(tableName)
              .update({ updated_at: new Date().toISOString() })
              .order('id', { ascending: true })
              .limit(1)

            if (updateError) {
              if (updateError.message.includes('Authentication required')) {
                console.log(`  ✅ UPDATE protected by auth_check()`)
                tableInfo.hasUpdate = true
              } else if (updateError.message.includes('row-level security policy')) {
                console.log(`  ✅ UPDATE protected by RLS`)
                tableInfo.hasUpdate = true
              } else {
                console.log(`  ⚠️ UPDATE error: ${updateError.message}`)
              }
            } else {
              console.log(`  ❌ UPDATE not protected`)
            }
          } catch (error) {
            console.log(`  ❌ UPDATE test failed: ${error}`)
          }
        }

        // Test DELETE if table exists
        if (tableInfo.exists) {
          try {
            const { data: deleteData, error: deleteError } = await this.supabase
              .from(tableName)
              .delete()
              .order('id', { ascending: true })
              .limit(1)

            if (deleteError) {
              if (deleteError.message.includes('Authentication required')) {
                console.log(`  ✅ DELETE protected by auth_check()`)
                tableInfo.hasDelete = true
              } else if (deleteError.message.includes('row-level security policy')) {
                console.log(`  ✅ DELETE protected by RLS`)
                tableInfo.hasDelete = true
              } else {
                console.log(`  ⚠️ DELETE error: ${deleteError.message}`)
              }
            } else {
              console.log(`  ❌ DELETE not protected`)
            }
          } catch (error) {
            console.log(`  ❌ DELETE test failed: ${error}`)
          }
        }

        // Check if table has complete protection
        tableInfo.complete = tableInfo.hasSelect && tableInfo.hasInsert && tableInfo.hasUpdate && tableInfo.hasDelete

      } catch (error) {
        console.log(`  ❌ Table test failed: ${error}`)
        tableInfo.errorMessage = error instanceof Error ? error.message : String(error)
      }

      tableResults.push(tableInfo)
    }

    return tableResults
  }

  private async testUnauthenticatedAccess() {
    console.log('\n3️⃣ UNAUTHENTICATED ACCESS TEST')
    console.log('===============================')
    
    // Ensure we're unauthenticated
    await this.supabase.auth.signOut()
    
    const existingTables = [
      'journal_entries',
      'vocabulary_words', 
      'tasks',
      'books',
      'life_arenas',
      'growth_goals',
      'journey_maps'
    ]

    console.log('🧪 Testing unauthenticated SELECT access:')
    
    for (const tableName of existingTables) {
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
  }

  private async generateSummary() {
    console.log('\n4️⃣ SUMMARY REPORT')
    console.log('==================')
    
    const tableResults = await this.testExistingTables()
    
    const totalTables = tableResults.length
    const existingTables = tableResults.filter(t => t.exists).length
    const completeTables = tableResults.filter(t => t.complete).length
    const incompleteTables = tableResults.filter(t => t.exists && !t.complete).length
    const missingTables = tableResults.filter(t => !t.exists).length

    console.log(`\n📊 TABLE SUMMARY:`)
    console.log(`Total expected tables: ${totalTables}`)
    console.log(`Tables that exist: ${existingTables}`)
    console.log(`Tables with complete protection: ${completeTables}`)
    console.log(`Tables with incomplete protection: ${incompleteTables}`)
    console.log(`Missing tables: ${missingTables}`)

    // Detailed breakdown
    console.log(`\n📋 DETAILED BREAKDOWN:`)
    
    if (completeTables > 0) {
      console.log(`\n✅ COMPLETE TABLES (${completeTables}):`)
      tableResults.filter(t => t.complete).forEach(t => {
        console.log(`  - ${t.tableName}: SELECT ✅ INSERT ✅ UPDATE ✅ DELETE ✅`)
      })
    }

    if (incompleteTables > 0) {
      console.log(`\n⚠️ INCOMPLETE TABLES (${incompleteTables}):`)
      tableResults.filter(t => t.exists && !t.complete).forEach(t => {
        const policies: string[] = []
        if (t.hasSelect) policies.push('SELECT')
        if (t.hasInsert) policies.push('INSERT')
        if (t.hasUpdate) policies.push('UPDATE')
        if (t.hasDelete) policies.push('DELETE')
        console.log(`  - ${t.tableName}: ${policies.join(' ✅ ')} ❌ Missing: ${['SELECT', 'INSERT', 'UPDATE', 'DELETE'].filter(p => !policies.includes(p)).join(', ')}`)
      })
    }

    if (missingTables > 0) {
      console.log(`\n❌ MISSING TABLES (${missingTables}):`)
      tableResults.filter(t => !t.exists).forEach(t => {
        console.log(`  - ${t.tableName}: ${t.errorMessage || 'Not found'}`)
      })
    }

    // Security assessment
    console.log(`\n🏭 SECURITY ASSESSMENT:`)
    
    if (completeTables === existingTables && existingTables > 0) {
      console.log(`✅ EXCELLENT: All existing tables have complete protection`)
    } else if (incompleteTables > 0) {
      console.log(`⚠️ INCOMPLETE: ${incompleteTables} tables need additional policies`)
    } else if (existingTables === 0) {
      console.log(`❌ CRITICAL: No tables exist in the database`)
    }

    // Recommendations
    console.log(`\n📝 RECOMMENDATIONS:`)
    
    if (missingTables > 0) {
      console.log(`🔧 DEPLOYMENT: ${missingTables} tables need to be created`)
    }
    
    if (incompleteTables > 0) {
      console.log(`🔒 SECURITY: ${incompleteTables} tables need complete RLS policies`)
      console.log(`   - Add missing SELECT, INSERT, UPDATE, DELETE policies`)
      console.log(`   - Use auth_check() function in all policies`)
    }
    
    if (completeTables === existingTables && existingTables > 0) {
      console.log(`✅ READY: All tables have proper security policies`)
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

// Run the simple database audit
async function runSimpleDatabaseAudit() {
  try {
    const audit = new SimpleDatabaseAudit()
    await audit.runSimpleAudit()
  } catch (error) {
    console.error('❌ Simple database audit failed to start:', error)
    process.exit(1)
  }
}

runSimpleDatabaseAudit()
  .then(() => {
    console.log('\n🏁 Simple database audit complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Simple database audit failed:', error)
    process.exit(1)
  }) 