import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config()

// Check for required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required')
  console.error('')
  console.error('Please create a .env.local file with your Supabase credentials:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
  process.exit(1)
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

async function clearAllData() {
  console.log('🗑️ Clearing all SAL OS data from Supabase...')

  try {
    // Clear all tables in the correct order (respecting foreign key constraints)
    const tables = [
      'tasks',
      'journal_entries', 
      'vocabulary_words',
      'books',
      'life_arenas',
      'existential_levels',
      'growth_goals',
      'weekly_reviews',
      'gravity_items',
      'gravity_categories',
      'journey_nodes',
      'journey_connections',
      'journey_maps'
    ]

    for (const table of tables) {
      console.log(`🗑️ Clearing ${table}...`)
      const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
      
      if (error) {
        console.warn(`⚠️ Warning clearing ${table}:`, error.message)
      } else {
        console.log(`✅ Cleared ${table}`)
      }
    }

    console.log('✅ All data cleared successfully!')
    console.log('The application will start fresh on next load.')

  } catch (error) {
    console.error('❌ Error clearing data:', error)
    throw error
  }
}

// Run the clearing function
clearAllData()
  .then(() => {
    console.log('✅ Clear process completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Clear process failed:', error)
    process.exit(1)
  }) 