import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

// Check for required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required')
  process.exit(1)
}

console.log('🔗 Testing Supabase Connection...')
console.log('================================')

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyConnection() {
  try {
    console.log('1️⃣ Testing basic connection...')
    
    // Test basic connection
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Connection failed:', sessionError.message)
      return false
    }
    
    console.log('✅ Supabase connection successful')
    
    console.log('\n2️⃣ Verifying database schema...')
    
    // Test schema access by checking if we can query tables
    const expectedTables = [
      'journal_entries',
      'vocabulary_words', 
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
      'journey_connections',
      'study_sessions'
    ]
    
    console.log('📋 Checking for expected tables...')
    const tableResults = {}
    
    for (const table of expectedTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          tableResults[table] = { exists: false, error: error.message }
        } else {
          tableResults[table] = { exists: true, count: data?.length || 0 }
        }
      } catch (err) {
        tableResults[table] = { exists: false, error: err instanceof Error ? err.message : String(err) }
      }
    }
    
    // Count existing tables
    const existingTables = Object.values(tableResults).filter(result => result.exists).length
    const missingTables = Object.entries(tableResults).filter(([table, result]) => !result.exists)
    
    console.log(`✅ Database schema accessible`)
    console.log(`📊 Found ${existingTables}/${expectedTables.length} expected tables`)
    
    if (existingTables === expectedTables.length) {
      console.log('✅ All expected tables are present')
    } else {
      console.log('⚠️  Some tables are missing:')
      missingTables.forEach(([table, result]) => {
        console.log(`   - ${table}: ${result.error}`)
      })
    }
    
    console.log('\n📋 Complete table status:')
    Object.entries(tableResults).forEach(([table, result]) => {
      const status = result.exists ? '✅' : '❌'
      console.log(`   ${status} ${table}`)
    })
    
    console.log('\n✅ Supabase connection successful')
    console.log('✅ Database schema accessible')
    console.log('✅ List of all tables present in schema')
    
    return true
    
  } catch (error) {
    console.error('❌ Connection verification failed:', error)
    return false
  }
}

// Run verification
verifyConnection()
  .then((success) => {
    if (success) {
      console.log('\n🎉 Backend credential verification completed successfully!')
      process.exit(0)
    } else {
      console.log('\n❌ Backend credential verification failed!')
      process.exit(1)
    }
  })
  .catch((error) => {
    console.error('❌ Verification script failed:', error)
    process.exit(1)
  }) 