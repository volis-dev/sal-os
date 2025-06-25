import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

class RLSBehaviorInventory {
  private supabase: any

  constructor() {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async runBehaviorInventory() {
    console.log('🔒 SAL OS RLS BEHAVIOR INVENTORY')
    console.log('=================================')
    console.log(`URL: ${supabaseUrl}`)
    console.log(`Key: ${supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'undefined'}`)
    console.log('')

    await this.listAllTables()
    await this.inventoryRLSBehavior()
  }

  private async listAllTables() {
    console.log('1️⃣ ALL TABLES IN SAL OS DATABASE')
    console.log('=================================')
    
    // Test each known table to see if it exists
    const knownTables = [
      'journal_entries',
      'vocabulary_words', 
      'study_sessions',
      'tasks',
      'books',
      'chapters',
      'reading_progress',
      'life_arenas',
      'existential_levels',
      'gravity_categories',
      'gravity_items',
      'growth_goals',
      'weekly_reviews',
      'journey_maps',
      'journey_nodes',
      'journey_connections'
    ]

    const existingTables = []
    
    for (const tableName of knownTables) {
      try {
        const { data, error } = await this.supabase
          .from(tableName)
          .select('*')
          .limit(1)

        if (error) {
          if (error.message.includes('relation') && error.message.includes('does not exist')) {
            console.log(`❌ ${tableName}: Table does not exist`)
          } else {
            console.log(`✅ ${tableName}: Table exists (${error.message.includes('row-level security policy') ? 'RLS active' : 'other error'})`)
            existingTables.push(tableName)
          }
        } else {
          console.log(`✅ ${tableName}: Table exists (accessible)`)
          existingTables.push(tableName)
        }
      } catch (error) {
        console.log(`❌ ${tableName}: Error testing - ${error}`)
      }
    }

    console.log(`\nFound ${existingTables.length} existing tables out of ${knownTables.length} expected tables`)
    console.log('')
    
    return existingTables
  }

  private async inventoryRLSBehavior() {
    console.log('2️⃣ RLS BEHAVIOR INVENTORY')
    console.log('=========================')
    
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
      console.log(`\n📋 TABLE: ${tableName}`)
      console.log('='.repeat(50))
      
      await this.testTableRLSBehavior(tableName)
    }
  }

  private async testTableRLSBehavior(tableName: string) {
    const operations = [
      { name: 'SELECT', test: () => this.supabase.from(tableName).select('*').limit(1) },
      { name: 'INSERT', test: () => this.supabase.from(tableName).insert(this.generateTestData(tableName)).select().single() },
      { name: 'UPDATE', test: () => this.supabase.from(tableName).update({ updated_at: new Date().toISOString() }).order('id', { ascending: true }).limit(1) },
      { name: 'DELETE', test: () => this.supabase.from(tableName).delete().order('id', { ascending: true }).limit(1) }
    ]
    
    for (const operation of operations) {
      console.log(`\n  🔒 ${operation.name} Operation:`)
      console.log('  ' + '-'.repeat(30))
      
      try {
        const { data, error } = await operation.test()

        if (error) {
          console.log(`    ❌ Error: ${error.message}`)
          
          if (error.message.includes('row-level security policy')) {
            console.log(`    ✅ RLS POLICY ENFORCED`)
            console.log(`    📝 Policy Type: ${this.analyzeRLSPolicy(error.message)}`)
          } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
            console.log(`    ❌ TABLE DOES NOT EXIST`)
          } else if (error.message.includes('A \'limit\' was applied without an explicit \'order\'')) {
            console.log(`    ⚠️ SQL SYNTAX ERROR (needs ORDER BY)`)
          } else {
            console.log(`    ⚠️ OTHER ERROR TYPE`)
          }
        } else {
          console.log(`    ❌ RLS NOT ENFORCED`)
          console.log(`    🚨 Data returned: ${data?.length || 0} rows`)
          if (data && data.length > 0) {
            console.log(`    🚨 CRITICAL: Data exposed without authentication!`)
          }
        }

      } catch (error) {
        console.log(`    ❌ Test failed: ${error}`)
      }
    }
  }

  private analyzeRLSPolicy(errorMessage: string): string {
    if (errorMessage.includes('new row violates row-level security policy')) {
      return 'INSERT Policy (auth.uid() IS NOT NULL)'
    } else if (errorMessage.includes('row-level security policy')) {
      return 'Generic RLS Policy'
    } else {
      return 'Unknown Policy Type'
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
          color: '#3B82F6',
          priority: 1
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

// Run the behavior inventory
async function runBehaviorInventory() {
  try {
    const inventory = new RLSBehaviorInventory()
    await inventory.runBehaviorInventory()
  } catch (error) {
    console.error('❌ Behavior inventory failed to start:', error)
    process.exit(1)
  }
}

runBehaviorInventory()
  .then(() => {
    console.log('\n🏁 RLS behavior inventory complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Behavior inventory failed:', error)
    process.exit(1)
  }) 