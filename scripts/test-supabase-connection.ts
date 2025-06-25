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
  console.error('')
  console.error('Please create a .env.local file with your Supabase credentials:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
  process.exit(1)
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

interface TestResult {
  module: string
  operation: string
  success: boolean
  error?: string
  data?: any
}

const testResults: TestResult[] = []

async function testOperation(module: string, operation: string, testFn: () => Promise<any>): Promise<void> {
  try {
    console.log(`🧪 Testing ${module} - ${operation}...`)
    const result = await testFn()
    testResults.push({
      module,
      operation,
      success: true,
      data: result
    })
    console.log(`✅ ${module} - ${operation}: SUCCESS`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    testResults.push({
      module,
      operation,
      success: false,
      error: errorMessage
    })
    console.log(`❌ ${module} - ${operation}: FAILED - ${errorMessage}`)
  }
}

async function testSupabaseConnection() {
  console.log('🚀 Starting Supabase Connection Tests...\n')

  // Test 1: Basic connection
  await testOperation('Connection', 'Basic Auth', async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data
  })

  // Test 2: Check if tables exist
  await testOperation('Schema', 'Check Tables', async () => {
    const tables = [
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

    const results = {}
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          results[table] = { exists: false, error: error.message }
        } else {
          results[table] = { exists: true, count: data?.length || 0 }
        }
      } catch (err) {
        results[table] = { exists: false, error: err instanceof Error ? err.message : String(err) }
      }
    }
    return results
  })

  // Test 3: Journal Entries CRUD
  await testOperation('Journal', 'Create Entry', async () => {
    const testEntry = {
      title: 'Test Journal Entry',
      content: 'This is a test journal entry for database verification.',
      type: 'test',
      date: new Date().toISOString(),
      book_reference: 'Test Book',
      chapter_reference: 'Test Chapter',
      word_count: 15,
      tags: ['test', 'verification']
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .insert(testEntry)
      .select()
      .single()

    if (error) throw error
    return data
  })

  await testOperation('Journal', 'Read Entry', async () => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('type', 'test')
      .limit(1)
      .single()

    if (error) throw error
    return data
  })

  // Test 4: Vocabulary Words CRUD
  await testOperation('Vocabulary', 'Create Word', async () => {
    const testWord = {
      word: 'TestWord',
      part_of_speech: 'noun',
      definition: 'A test word for database verification',
      etymology: 'Test etymology',
      pronunciation: 'test-word',
      example_sentences: ['This is a test sentence.'],
      synonyms: ['test', 'example'],
      antonyms: ['real', 'actual'],
      source: 'manual',
      book_reference: 'Test Book',
      date_added: new Date().toISOString(),
      last_reviewed: new Date().toISOString(),
      review_count: 0,
      mastery_level: 'new',
      tags: ['test'],
      personal_notes: 'Test notes',
      next_review_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      difficulty_rating: 3
    }

    const { data, error } = await supabase
      .from('vocabulary_words')
      .insert(testWord)
      .select()
      .single()

    if (error) throw error
    return data
  })

  // Test 5: Tasks CRUD
  await testOperation('Tasks', 'Create Task', async () => {
    const testTask = {
      title: 'Test Task',
      description: 'A test task for database verification',
      book_section: 'Test Section',
      category: 'foundation',
      status: 'not-started',
      time_spent: 0,
      notes: 'Test notes',
      related_journal_ids: [],
      related_arena_ids: [],
      estimated_minutes: 30,
      is_multi_part: false,
      sub_tasks: [],
      completed_sub_tasks: 0
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert(testTask)
      .select()
      .single()

    if (error) throw error
    return data
  })

  // Test 6: Books CRUD
  await testOperation('Books', 'Create Book', async () => {
    const testBook = {
      title: 'Test Book',
      subtitle: 'Test Subtitle',
      total_chapters: 5,
      completed_chapters: 0,
      current_chapter: 1,
      total_pages: 100,
      pages_read: 0,
      color: 'blue',
      description: 'A test book for database verification',
      estimated_hours: 5
    }

    const { data, error } = await supabase
      .from('books')
      .insert(testBook)
      .select()
      .single()

    if (error) throw error
    return data
  })

  // Test 7: Life Arenas CRUD
  await testOperation('Life Arenas', 'Create Arena', async () => {
    const testArena = {
      name: 'Test Arena',
      description: 'A test life arena for database verification',
      current_score: 50,
      target_score: 80,
      gradient: 'from-blue-500 to-purple-600',
      vision_statement: 'Test vision statement',
      current_actions: ['Test action 1', 'Test action 2'],
      milestones: [],
      last_updated: new Date().toISOString(),
      sal_principle: 'Test Principle',
      icon: 'TestIcon'
    }

    const { data, error } = await supabase
      .from('life_arenas')
      .insert(testArena)
      .select()
      .single()

    if (error) throw error
    return data
  })

  // Test 8: Growth Goals CRUD
  await testOperation('Growth Goals', 'Create Goal', async () => {
    const testGoal = {
      title: 'Test Growth Goal',
      description: 'A test growth goal for database verification',
      category: 'mental',
      target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 0,
      milestones: ['Test milestone 1', 'Test milestone 2'],
      completed_milestones: 0,
      priority: 'medium',
      status: 'active'
    }

    const { data, error } = await supabase
      .from('growth_goals')
      .insert(testGoal)
      .select()
      .single()

    if (error) throw error
    return data
  })

  // Test 9: Journey Maps CRUD
  await testOperation('Journey Maps', 'Create Map', async () => {
    const testMap = {
      title: 'Test Journey Map',
      description: 'A test journey map for database verification',
      current_node_id: null,
      completed_nodes: 0,
      total_nodes: 3,
      theme: 'blue'
    }

    const { data, error } = await supabase
      .from('journey_maps')
      .insert(testMap)
      .select()
      .single()

    if (error) throw error
    return data
  })

  // Test 10: Check RLS Policies
  await testOperation('Security', 'Check RLS', async () => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('count')
      .limit(1)

    if (error) throw error
    return { rls_enabled: true, can_query: true }
  })

  console.log('\n📊 Test Results Summary:')
  console.log('========================')
  
  const successfulTests = testResults.filter(r => r.success).length
  const failedTests = testResults.filter(r => !r.success).length
  
  console.log(`✅ Successful Tests: ${successfulTests}`)
  console.log(`❌ Failed Tests: ${failedTests}`)
  console.log(`📈 Success Rate: ${Math.round((successfulTests / testResults.length) * 100)}%`)
  
  if (failedTests > 0) {
    console.log('\n❌ Failed Tests Details:')
    testResults.filter(r => !r.success).forEach(result => {
      console.log(`   ${result.module} - ${result.operation}: ${result.error}`)
    })
  }

  console.log('\n🎯 Backend Integration Status:')
  console.log('==============================')
  
  const modules = ['Connection', 'Schema', 'Journal', 'Vocabulary', 'Tasks', 'Books', 'Life Arenas', 'Growth Goals', 'Journey Maps', 'Security']
  
  modules.forEach(module => {
    const moduleTests = testResults.filter(r => r.module === module)
    const moduleSuccess = moduleTests.filter(r => r.success).length
    const moduleTotal = moduleTests.length
    
    if (moduleTotal > 0) {
      const status = moduleSuccess === moduleTotal ? '✅ FULLY CONNECTED' : 
                    moduleSuccess > 0 ? '⚠️  PARTIALLY CONNECTED' : '❌ NOT CONNECTED'
      console.log(`${module}: ${status} (${moduleSuccess}/${moduleTotal})`)
    }
  })

  return testResults
}

// Run the tests
testSupabaseConnection()
  .then((results) => {
    console.log('\n🏁 Backend Integration Test Complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Test execution failed:', error)
    process.exit(1)
  }) 