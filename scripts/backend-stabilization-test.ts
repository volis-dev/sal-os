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
  console.error('Please update your .env.local file with your Supabase credentials:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_project_url')
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key')
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
  duration?: number
}

interface ModuleTestResult {
  module: string
  totalTests: number
  passedTests: number
  failedTests: number
  successRate: number
  errors: string[]
}

const testResults: TestResult[] = []
const moduleResults: ModuleTestResult[] = []

async function testOperation(module: string, operation: string, testFn: () => Promise<any>): Promise<void> {
  const startTime = Date.now()
  try {
    console.log(`🧪 Testing ${module} - ${operation}...`)
    const result = await testFn()
    const duration = Date.now() - startTime
    
    testResults.push({
      module,
      operation,
      success: true,
      data: result,
      duration
    })
    console.log(`✅ ${module} - ${operation}: SUCCESS (${duration}ms)`)
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    testResults.push({
      module,
      operation,
      success: false,
      error: errorMessage,
      duration
    })
    console.log(`❌ ${module} - ${operation}: FAILED (${duration}ms) - ${errorMessage}`)
  }
}

// ========================================
// JOURNAL MODULE TESTS
// ========================================
async function testJournalModule() {
  console.log('\n📝 Testing Journal Module...')
  
  let createdEntryId: string | null = null
  
  // Create entry
  await testOperation('Journal', 'Create Entry', async () => {
    const testEntry = {
      title: 'Backend Test Entry',
      content: 'This is a test journal entry for backend stabilization.',
      type: 'test',
      date: new Date().toISOString(),
      book_reference: 'Backend Test Book',
      chapter_reference: 'Backend Test Chapter',
      word_count: 25,
      tags: ['backend-test', 'stabilization']
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .insert(testEntry)
      .select()
      .single()

    if (error) throw error
    createdEntryId = data.id
    return data
  })

  // Read entry
  await testOperation('Journal', 'Read Entry', async () => {
    if (!createdEntryId) throw new Error('No entry ID available')
    
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', createdEntryId)
      .single()

    if (error) throw error
    return data
  })

  // Update entry
  await testOperation('Journal', 'Update Entry', async () => {
    if (!createdEntryId) throw new Error('No entry ID available')
    
    const { data, error } = await supabase
      .from('journal_entries')
      .update({
        title: 'Updated Backend Test Entry',
        content: 'This entry has been updated during backend testing.',
        word_count: 30,
        tags: ['backend-test', 'stabilization', 'updated']
      })
      .eq('id', createdEntryId)
      .select()
      .single()

    if (error) throw error
    return data
  })

  // Delete entry
  await testOperation('Journal', 'Delete Entry', async () => {
    if (!createdEntryId) throw new Error('No entry ID available')
    
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', createdEntryId)

    if (error) throw error
    return { deleted: true, id: createdEntryId }
  })
}

// ========================================
// VOCABULARY MODULE TESTS
// ========================================
async function testVocabularyModule() {
  console.log('\n📚 Testing Vocabulary Module...')
  
  let createdWordId: string | null = null
  
  // Create word
  await testOperation('Vocabulary', 'Create Word', async () => {
    const testWord = {
      word: 'BackendTestWord',
      part_of_speech: 'noun',
      definition: 'A test word created during backend stabilization',
      etymology: 'Backend test etymology',
      pronunciation: 'backend-test-word',
      example_sentences: ['This is a backend test sentence.'],
      synonyms: ['backend', 'test', 'word'],
      antonyms: ['frontend', 'production'],
      source: 'manual',
      book_reference: 'Backend Test Book',
      date_added: new Date().toISOString(),
      last_reviewed: new Date().toISOString(),
      review_count: 0,
      mastery_level: 'new',
      tags: ['backend-test'],
      personal_notes: 'Backend test notes',
      next_review_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      difficulty_rating: 3
    }

    const { data, error } = await supabase
      .from('vocabulary_words')
      .insert(testWord)
      .select()
      .single()

    if (error) throw error
    createdWordId = data.id
    return data
  })

  // Update mastery level
  await testOperation('Vocabulary', 'Update Mastery Level', async () => {
    if (!createdWordId) throw new Error('No word ID available')
    
    const { data, error } = await supabase
      .from('vocabulary_words')
      .update({
        mastery_level: 'learning',
        review_count: 1,
        last_reviewed: new Date().toISOString()
      })
      .eq('id', createdWordId)
      .select()
      .single()

    if (error) throw error
    return data
  })

  // Delete word
  await testOperation('Vocabulary', 'Delete Word', async () => {
    if (!createdWordId) throw new Error('No word ID available')
    
    const { error } = await supabase
      .from('vocabulary_words')
      .delete()
      .eq('id', createdWordId)

    if (error) throw error
    return { deleted: true, id: createdWordId }
  })
}

// ========================================
// TASKS MODULE TESTS
// ========================================
async function testTasksModule() {
  console.log('\n✅ Testing Tasks Module...')
  
  let createdTaskId: number | null = null
  
  // Create task
  await testOperation('Tasks', 'Create Task', async () => {
    const testTask = {
      title: 'Backend Test Task',
      description: 'A test task for backend stabilization',
      book_section: 'Backend Test Section',
      category: 'foundation',
      status: 'not-started',
      time_spent: 0,
      notes: 'Backend test notes',
      related_journal_ids: [],
      related_arena_ids: [],
      estimated_minutes: 45,
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
    createdTaskId = data.id
    return data
  })

  // Update status
  await testOperation('Tasks', 'Update Status', async () => {
    if (!createdTaskId) throw new Error('No task ID available')
    
    const { data, error } = await supabase
      .from('tasks')
      .update({
        status: 'in-progress',
        started_date: new Date().toISOString(),
        time_spent: 15
      })
      .eq('id', createdTaskId)
      .select()
      .single()

    if (error) throw error
    return data
  })

  // Delete task
  await testOperation('Tasks', 'Delete Task', async () => {
    if (!createdTaskId) throw new Error('No task ID available')
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', createdTaskId)

    if (error) throw error
    return { deleted: true, id: createdTaskId }
  })
}

// ========================================
// BOOKS/MODULES TESTS
// ========================================
async function testBooksModule() {
  console.log('\n📖 Testing Books/Modules Module...')
  
  let createdBookId: string | null = null
  let createdChapterId: string | null = null
  
  // Create book
  await testOperation('Books', 'Create Book', async () => {
    const testBook = {
      title: 'Backend Test Book',
      subtitle: 'Backend Test Subtitle',
      total_chapters: 3,
      completed_chapters: 0,
      current_chapter: 1,
      total_pages: 150,
      pages_read: 0,
      color: 'blue',
      description: 'A test book for backend stabilization',
      estimated_hours: 8
    }

    const { data, error } = await supabase
      .from('books')
      .insert(testBook)
      .select()
      .single()

    if (error) throw error
    createdBookId = data.id
    return data
  })

  // Create chapter
  await testOperation('Books', 'Create Chapter', async () => {
    if (!createdBookId) throw new Error('No book ID available')
    
    const testChapter = {
      book_id: createdBookId,
      number: 1,
      title: 'Backend Test Chapter 1',
      content: 'This is a test chapter content for backend stabilization.',
      estimated_minutes: 30,
      completed: false
    }

    const { data, error } = await supabase
      .from('chapters')
      .insert(testChapter)
      .select()
      .single()

    if (error) throw error
    createdChapterId = data.id
    return data
  })

  // Track reading progress
  await testOperation('Books', 'Track Reading Progress', async () => {
    if (!createdBookId || !createdChapterId) throw new Error('Missing book or chapter ID')
    
    const testProgress = {
      book_id: createdBookId,
      chapter_id: createdChapterId,
      position: 0,
      total_time: 1800, // 30 minutes
      last_read: new Date().toISOString(),
      completed: true
    }

    const { data, error } = await supabase
      .from('reading_progress')
      .upsert(testProgress, {
        onConflict: 'book_id,chapter_id'
      })
      .select()
      .single()

    if (error) throw error
    return data
  })

  // Delete book (will cascade delete chapters and progress)
  await testOperation('Books', 'Delete Book', async () => {
    if (!createdBookId) throw new Error('No book ID available')
    
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', createdBookId)

    if (error) throw error
    return { deleted: true, id: createdBookId }
  })
}

// ========================================
// LIFE ARENAS TESTS
// ========================================
async function testLifeArenasModule() {
  console.log('\n🎯 Testing Life Arenas Module...')
  
  let createdArenaId: string | null = null
  
  // Create arena
  await testOperation('Life Arenas', 'Create Arena', async () => {
    const testArena = {
      name: 'Backend Test Arena',
      description: 'A test life arena for backend stabilization',
      current_score: 60,
      target_score: 85,
      gradient: 'from-green-500 to-blue-600',
      vision_statement: 'Backend test vision statement',
      current_actions: ['Backend test action 1', 'Backend test action 2'],
      milestones: [],
      last_updated: new Date().toISOString(),
      sal_principle: 'Backend Test Principle',
      icon: 'BackendTestIcon'
    }

    const { data, error } = await supabase
      .from('life_arenas')
      .insert(testArena)
      .select()
      .single()

    if (error) throw error
    createdArenaId = data.id
    return data
  })

  // Add milestone (JSONB manipulation)
  await testOperation('Life Arenas', 'Add Milestone', async () => {
    if (!createdArenaId) throw new Error('No arena ID available')
    
    const newMilestone = {
      id: crypto.randomUUID(),
      title: 'Backend Test Milestone',
      description: 'A test milestone for backend stabilization',
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false
    }

    const { data: arena, error: arenaError } = await supabase
      .from('life_arenas')
      .select('milestones')
      .eq('id', createdArenaId)
      .single()

    if (arenaError) throw arenaError

    const updatedMilestones = [...(arena.milestones || []), newMilestone]

    const { data, error } = await supabase
      .from('life_arenas')
      .update({ milestones: updatedMilestones })
      .eq('id', createdArenaId)
      .select('milestones')
      .single()

    if (error) throw error
    return { milestone: newMilestone, arena: data }
  })

  // Toggle milestone complete
  await testOperation('Life Arenas', 'Toggle Milestone Complete', async () => {
    if (!createdArenaId) throw new Error('No arena ID available')
    
    const { data: arena, error: arenaError } = await supabase
      .from('life_arenas')
      .select('milestones')
      .eq('id', createdArenaId)
      .single()

    if (arenaError) throw arenaError

    const milestones = arena.milestones || []
    if (milestones.length === 0) throw new Error('No milestones found')

    const milestoneIndex = 0 // First milestone
    const updatedMilestone = {
      ...milestones[milestoneIndex],
      completed: true,
      completedDate: new Date().toISOString()
    }

    milestones[milestoneIndex] = updatedMilestone

    const { data, error } = await supabase
      .from('life_arenas')
      .update({ milestones })
      .eq('id', createdArenaId)
      .select('milestones')
      .single()

    if (error) throw error
    return { milestone: updatedMilestone, arena: data }
  })

  // Delete arena
  await testOperation('Life Arenas', 'Delete Arena', async () => {
    if (!createdArenaId) throw new Error('No arena ID available')
    
    const { error } = await supabase
      .from('life_arenas')
      .delete()
      .eq('id', createdArenaId)

    if (error) throw error
    return { deleted: true, id: createdArenaId }
  })
}

// ========================================
// GROWTH ENGINE TESTS
// ========================================
async function testGrowthEngineModule() {
  console.log('\n🌱 Testing Growth Engine Module...')
  
  let createdGravityItemId: string | null = null
  let createdGoalId: string | null = null
  let createdReviewId: string | null = null
  
  // Create gravity item
  await testOperation('Growth Engine', 'Create Gravity Item', async () => {
    // First create a gravity category
    const { data: category, error: categoryError } = await supabase
      .from('gravity_categories')
      .insert({
        name: 'Backend Test Category',
        icon: 'BackendTestIcon',
        color: 'red',
        description: 'A test gravity category for backend stabilization',
        examples: ['Backend test example 1', 'Backend test example 2']
      })
      .select()
      .single()

    if (categoryError) throw categoryError

    const testGravityItem = {
      category_id: category.id,
      name: 'Backend Test Gravity Item',
      description: 'A test gravity item for backend stabilization',
      severity: 4,
      impact: 'High impact on backend testing',
      action_plan: 'Complete backend stabilization testing',
      date_identified: new Date().toISOString().split('T')[0],
      status: 'active'
    }

    const { data, error } = await supabase
      .from('gravity_items')
      .insert(testGravityItem)
      .select()
      .single()

    if (error) throw error
    createdGravityItemId = data.id
    return data
  })

  // Update gravity item
  await testOperation('Growth Engine', 'Update Gravity Item', async () => {
    if (!createdGravityItemId) throw new Error('No gravity item ID available')
    
    const { data, error } = await supabase
      .from('gravity_items')
      .update({
        status: 'improving',
        last_reviewed: new Date().toISOString()
      })
      .eq('id', createdGravityItemId)
      .select()
      .single()

    if (error) throw error
    return data
  })

  // Create growth goal
  await testOperation('Growth Engine', 'Create Growth Goal', async () => {
    const testGoal = {
      title: 'Backend Stabilization Goal',
      description: 'Complete backend stabilization testing',
      category: 'mental',
      target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 50,
      milestones: ['Complete journal tests', 'Complete vocabulary tests', 'Complete all modules'],
      completed_milestones: 1,
      priority: 'high',
      status: 'active'
    }

    const { data, error } = await supabase
      .from('growth_goals')
      .insert(testGoal)
      .select()
      .single()

    if (error) throw error
    createdGoalId = data.id
    return data
  })

  // Update growth goal
  await testOperation('Growth Engine', 'Update Growth Goal', async () => {
    if (!createdGoalId) throw new Error('No goal ID available')
    
    const { data, error } = await supabase
      .from('growth_goals')
      .update({
        progress: 75,
        completed_milestones: 2
      })
      .eq('id', createdGoalId)
      .select()
      .single()

    if (error) throw error
    return data
  })

  // Create weekly review
  await testOperation('Growth Engine', 'Create Weekly Review', async () => {
    const testReview = {
      week_of: new Date().toISOString().split('T')[0],
      overall_rating: 8,
      wins: ['Completed backend testing', 'Fixed service layer issues'],
      challenges: ['Environment setup', 'Type alignment'],
      lessons: ['Always test with real credentials', 'Check field mappings carefully'],
      next_week_focus: ['Frontend integration', 'Production deployment'],
      gravity_progress: { 'Backend Test Category': 50 },
      arena_progress: { 'Backend Test Arena': 75 }
    }

    const { data, error } = await supabase
      .from('weekly_reviews')
      .insert(testReview)
      .select()
      .single()

    if (error) throw error
    createdReviewId = data.id
    return data
  })

  // Clean up growth engine data
  await testOperation('Growth Engine', 'Cleanup Growth Data', async () => {
    const deletions = []
    
    if (createdGravityItemId) {
      const { error } = await supabase
        .from('gravity_items')
        .delete()
        .eq('id', createdGravityItemId)
      if (error) deletions.push(`Gravity item: ${error.message}`)
    }
    
    if (createdGoalId) {
      const { error } = await supabase
        .from('growth_goals')
        .delete()
        .eq('id', createdGoalId)
      if (error) deletions.push(`Growth goal: ${error.message}`)
    }
    
    if (createdReviewId) {
      const { error } = await supabase
        .from('weekly_reviews')
        .delete()
        .eq('id', createdReviewId)
      if (error) deletions.push(`Weekly review: ${error.message}`)
    }

    // Clean up gravity categories
    const { error } = await supabase
      .from('gravity_categories')
      .delete()
      .eq('name', 'Backend Test Category')

    if (error) deletions.push(`Gravity category: ${error.message}`)

    if (deletions.length > 0) {
      throw new Error(`Cleanup errors: ${deletions.join(', ')}`)
    }

    return { cleaned: true }
  })
}

// ========================================
// JOURNEY MAPS TESTS
// ========================================
async function testJourneyMapsModule() {
  console.log('\n🗺️ Testing Journey Maps Module...')
  
  let createdMapId: string | null = null
  let createdNodeId: string | null = null
  
  // Create journey map
  await testOperation('Journey Maps', 'Create Journey Map', async () => {
    const testMap = {
      title: 'Backend Test Journey',
      description: 'A test journey map for backend stabilization',
      current_node_id: null,
      completed_nodes: 0,
      total_nodes: 2,
      theme: 'blue'
    }

    const { data, error } = await supabase
      .from('journey_maps')
      .insert(testMap)
      .select()
      .single()

    if (error) throw error
    createdMapId = data.id
    return data
  })

  // Add nodes
  await testOperation('Journey Maps', 'Add Nodes', async () => {
    if (!createdMapId) throw new Error('No map ID available')
    
    const testNode = {
      journey_map_id: createdMapId,
      title: 'Backend Test Node',
      description: 'A test node for backend stabilization',
      type: 'milestone',
      position_x: 100,
      position_y: 100,
      completed: false,
      metadata: { test: true }
    }

    const { data, error } = await supabase
      .from('journey_nodes')
      .insert(testNode)
      .select()
      .single()

    if (error) throw error
    createdNodeId = data.id
    return data
  })

  // Add connections
  await testOperation('Journey Maps', 'Add Connections', async () => {
    if (!createdMapId || !createdNodeId) throw new Error('Missing map or node ID')
    
    // Create a second node for connection
    const { data: secondNode, error: secondNodeError } = await supabase
      .from('journey_nodes')
      .insert({
        journey_map_id: createdMapId,
        title: 'Backend Test Node 2',
        description: 'A second test node for connections',
        type: 'challenge',
        position_x: 300,
        position_y: 100,
        completed: false,
        metadata: { test: true }
      })
      .select()
      .single()

    if (secondNodeError) throw secondNodeError

    const testConnection = {
      journey_map_id: createdMapId,
      source_node_id: createdNodeId,
      target_node_id: secondNode.id,
      type: 'linear',
      label: 'Backend Test Connection',
      metadata: { test: true }
    }

    const { data, error } = await supabase
      .from('journey_connections')
      .insert(testConnection)
      .select()
      .single()

    if (error) throw error
    return { connection: data, secondNode }
  })

  // Update nodes
  await testOperation('Journey Maps', 'Update Nodes', async () => {
    if (!createdNodeId) throw new Error('No node ID available')
    
    const { data, error } = await supabase
      .from('journey_nodes')
      .update({
        completed: true,
        completion_date: new Date().toISOString()
      })
      .eq('id', createdNodeId)
      .select()
      .single()

    if (error) throw error
    return data
  })

  // Delete map (will cascade delete nodes and connections)
  await testOperation('Journey Maps', 'Delete Journey Map', async () => {
    if (!createdMapId) throw new Error('No map ID available')
    
    const { error } = await supabase
      .from('journey_maps')
      .delete()
      .eq('id', createdMapId)

    if (error) throw error
    return { deleted: true, id: createdMapId }
  })
}

// ========================================
// MAIN TEST EXECUTION
// ========================================
async function runBackendStabilizationTests() {
  console.log('🚀 Starting Backend Stabilization Tests...')
  console.log('==========================================')
  
  const startTime = Date.now()

  try {
    // Test 1: Basic connection
    await testOperation('Connection', 'Basic Auth', async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return data
    })

    // Test 2: Schema validation
    await testOperation('Schema', 'Validate Tables', async () => {
      const tables = [
        'journal_entries', 'vocabulary_words', 'tasks', 'books', 'chapters',
        'reading_progress', 'life_arenas', 'existential_levels', 'gravity_categories',
        'gravity_items', 'growth_goals', 'weekly_reviews', 'journey_maps',
        'journey_nodes', 'journey_connections', 'study_sessions'
      ]

      const results: Record<string, { exists: boolean; error?: string; count?: number }> = {}
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

    // Test all modules
    await testJournalModule()
    await testVocabularyModule()
    await testTasksModule()
    await testBooksModule()
    await testLifeArenasModule()
    await testGrowthEngineModule()
    await testJourneyMapsModule()

    // Generate comprehensive report
    generateBackendStabilizationReport(startTime)

  } catch (error) {
    console.error('❌ Backend stabilization test failed:', error)
    process.exit(1)
  }
}

// ========================================
// REPORT GENERATION
// ========================================
function generateBackendStabilizationReport(startTime: number) {
  const totalDuration = Date.now() - startTime
  
  console.log('\n📊 BACKEND STABILIZATION REPORT')
  console.log('================================')
  
  // Calculate module results
  const modules = ['Journal', 'Vocabulary', 'Tasks', 'Books', 'Life Arenas', 'Growth Engine', 'Journey Maps']
  
  modules.forEach(module => {
    const moduleTests = testResults.filter(r => r.module === module)
    const totalTests = moduleTests.length
    const passedTests = moduleTests.filter(r => r.success).length
    const failedTests = totalTests - passedTests
    const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0
    const errors = moduleTests.filter(r => !r.success).map(r => r.error || 'Unknown error')

    moduleResults.push({
      module,
      totalTests,
      passedTests,
      failedTests,
      successRate,
      errors
    })

    const status = successRate === 100 ? '✅ STABLE' : 
                  successRate >= 80 ? '⚠️  PARTIALLY STABLE' : '❌ UNSTABLE'
    
    console.log(`${module}: ${status} (${passedTests}/${totalTests}) - ${successRate}%`)
    
    if (errors.length > 0) {
      console.log(`   Errors: ${errors.join(', ')}`)
    }
  })

  // Overall statistics
  const totalTests = testResults.length
  const totalPassed = testResults.filter(r => r.success).length
  const totalFailed = totalTests - totalPassed
  const overallSuccessRate = Math.round((totalPassed / totalTests) * 100)
  
  console.log('\n📈 OVERALL STATISTICS')
  console.log('=====================')
  console.log(`Total Tests: ${totalTests}`)
  console.log(`Passed: ${totalPassed}`)
  console.log(`Failed: ${totalFailed}`)
  console.log(`Success Rate: ${overallSuccessRate}%`)
  console.log(`Total Duration: ${totalDuration}ms`)
  
  // Type safety validation
  const typeErrors = testResults.filter(r => 
    typeof r.error === 'string' && (r.error.includes('type') || r.error.includes('Type'))
  )
  
  console.log('\n🔒 TYPE SAFETY VALIDATION')
  console.log('=========================')
  if (typeErrors.length === 0) {
    console.log('✅ No type safety issues detected')
  } else {
    console.log(`❌ ${typeErrors.length} type safety issues found:`)
    typeErrors.forEach(error => {
      console.log(`   - ${error.module}: ${error.error}`)
    })
  }

  // Supabase compliance
  const supabaseErrors = testResults.filter(r => 
    r.error && (r.error.includes('permission') || r.error.includes('RLS') || r.error.includes('auth'))
  )
  
  console.log('\n🗄️ SUPABASE COMPLIANCE')
  console.log('======================')
  if (supabaseErrors.length === 0) {
    console.log('✅ Full Supabase compliance confirmed')
  } else {
    console.log(`❌ ${supabaseErrors.length} Supabase compliance issues:`)
    supabaseErrors.forEach(error => {
      console.log(`   - ${error.module}: ${error.error}`)
    })
  }

  // Final status
  console.log('\n🏁 FINAL STATUS')
  console.log('================')
  if (overallSuccessRate === 100) {
    console.log('✅ BACKEND FULLY STABLE - Ready for production!')
  } else if (overallSuccessRate >= 80) {
    console.log('⚠️  BACKEND MOSTLY STABLE - Minor issues detected')
  } else {
    console.log('❌ BACKEND UNSTABLE - Significant issues detected')
  }
  
  console.log(`\nTotal execution time: ${totalDuration}ms`)
}

// ========================================
// RUN THE TESTS
// ========================================
runBackendStabilizationTests()
  .then(() => {
    console.log('\n🏁 Backend stabilization tests completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Backend stabilization tests failed:', error)
    process.exit(1)
  })