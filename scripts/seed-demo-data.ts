import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import type { JournalEntry } from '../types/journal'
import type { VocabularyWord } from '../types/vocabulary'
import type { SALTask } from '../types/tasks'
import type { Book } from '../types/modules'
import type { LifeArena } from '../types/life-arenas'
import type { ExistentialLevel, GravityCategory, GrowthGoal } from '../types/growth'
import type { JourneyMap, JourneyNode, JourneyConnection } from '../types/journey-map'

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

// Sample vocabulary words from the book content
const sampleVocabularyWords: Omit<VocabularyWord, 'id'>[] = [
  {
    word: 'Self-Action Leadership',
    partOfSpeech: 'noun',
    definition: 'The ability to lead yourself effectively through conscious choice and disciplined action',
    etymology: 'Combination of "self", "action", and "leadership"',
    exampleSentences: ['Practicing self-action leadership means taking responsibility for your own success.'],
    synonyms: ['self-leadership', 'self-management', 'personal leadership'],
    antonyms: ['passivity', 'reactive behavior', 'lack of initiative'],
    source: 'reading',
    bookReference: 'SAL Book',
    dateAdded: new Date().toISOString(),
    lastReviewed: new Date().toISOString(),
    reviewCount: 0,
    masteryLevel: 'new',
    tags: ['core-concept', 'leadership'],
    personalNotes: 'Fundamental principle of the SAL framework',
    nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    difficultyRating: 3
  },
  {
    word: 'Discipline',
    partOfSpeech: 'noun',
    definition: 'The practice of training oneself to follow a code of behavior',
    etymology: 'From Latin "disciplina" meaning "instruction, knowledge"',
    exampleSentences: ['Daily exercise requires discipline to maintain consistency.'],
    synonyms: ['self-control', 'willpower', 'determination'],
    antonyms: ['indiscipline', 'laziness', 'procrastination'],
    source: 'reading',
    bookReference: 'SAL Book',
    dateAdded: new Date().toISOString(),
    lastReviewed: new Date().toISOString(),
    reviewCount: 0,
    masteryLevel: 'new',
    tags: ['habit', 'self-improvement'],
    personalNotes: 'Key component of self-leadership',
    nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    difficultyRating: 2
  },
  {
    word: 'Accountability',
    partOfSpeech: 'noun',
    definition: 'The fact or condition of being accountable; responsibility',
    etymology: 'From "accountable" + "-ity"',
    exampleSentences: ['Taking accountability for mistakes leads to faster learning.'],
    synonyms: ['responsibility', 'answerability', 'liability'],
    antonyms: ['irresponsibility', 'unaccountability', 'blame-shifting'],
    source: 'reading',
    bookReference: 'SAL Book',
    dateAdded: new Date().toISOString(),
    lastReviewed: new Date().toISOString(),
    reviewCount: 0,
    masteryLevel: 'new',
    tags: ['responsibility', 'growth'],
    personalNotes: 'Critical for personal growth',
    nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    difficultyRating: 3
  }
]

// Sample journal entries
const sampleJournalEntries: Omit<JournalEntry, 'id'>[] = [
  {
    title: 'Starting My SAL Journey',
    content: 'Today I started reading the SAL book and I\'m already feeling inspired. The concept of self-action leadership resonates with me deeply. I want to become more disciplined in my daily routines.',
    type: 'reflection',
    date: new Date().toISOString(),
    bookReference: 'SAL Book',
    chapterReference: 'Chapter 1',
    wordCount: 45,
    tags: ['motivation', 'discipline', 'reading']
  },
  {
    title: 'Reflecting on Goals',
    content: 'Reflecting on my goals for this year. I need to be more accountable for my actions and take ownership of my results. No more excuses.',
    type: 'reflection',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    bookReference: 'SAL Book',
    chapterReference: 'Chapter 2',
    wordCount: 38,
    tags: ['goals', 'accountability', 'reflection']
  },
  {
    title: 'Building Resilience',
    content: 'Had a challenging day at work, but I reminded myself to stay resilient. Setbacks are opportunities for growth, not reasons to give up.',
    type: 'reflection',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    bookReference: 'SAL Book',
    chapterReference: 'Chapter 3',
    wordCount: 42,
    tags: ['resilience', 'work', 'growth']
  }
]

// Sample tasks
const sampleTasks: Omit<SALTask, 'id'>[] = [
  {
    title: 'Read SAL Book Chapter 1',
    description: 'Complete reading and take notes on the first chapter about self-action leadership fundamentals',
    bookSection: 'Chapter 1',
    category: 'knowledge',
    status: 'completed',
    startedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    timeSpent: 45,
    notes: 'Great insights on self-leadership principles',
    relatedJournalIds: [],
    relatedArenaIds: [],
    estimatedMinutes: 45,
    isMultiPart: false
  },
  {
    title: 'Practice vocabulary review',
    description: 'Review the new vocabulary words learned from the SAL book',
    bookSection: 'Chapter 1',
    category: 'foundation',
    status: 'not-started',
    timeSpent: 0,
    notes: '',
    relatedJournalIds: [],
    relatedArenaIds: [],
    estimatedMinutes: 20,
    isMultiPart: false
  },
  {
    title: 'Write reflection on discipline',
    description: 'Reflect on how I can improve my discipline in daily life',
    bookSection: 'Chapter 2',
    category: 'reflection',
    status: 'not-started',
    timeSpent: 0,
    notes: '',
    relatedJournalIds: [],
    relatedArenaIds: [],
    estimatedMinutes: 30,
    isMultiPart: false
  }
]

// Sample books
const sampleBooks: Omit<Book, 'id'>[] = [
  {
    title: 'Self-Action Leadership',
    subtitle: 'The Key to Personal, Professional, and Global Freedom',
    totalChapters: 12,
    completedChapters: 1,
    currentChapter: 2,
    lastRead: new Date().toISOString(),
    totalPages: 400,
    pagesRead: 35,
    color: 'blue',
    description: 'A comprehensive guide to personal leadership and self-mastery',
    estimatedHours: 20
  }
]

// Sample life arenas
const sampleLifeArenas: Omit<LifeArena, 'id'>[] = [
  {
    name: 'Personal Development',
    description: 'Focus on self-improvement and learning',
    currentScore: 75,
    targetScore: 90,
    gradient: 'from-blue-500 to-purple-600',
    visionStatement: 'To become a lifelong learner and continuously grow as a person',
    currentActions: ['Read 12 books this year', 'Learn a new skill', 'Practice daily reflection'],
    milestones: [],
    lastUpdated: new Date().toISOString(),
    salPrinciple: 'Discipline',
    icon: 'BookOpen'
  },
  {
    name: 'Career',
    description: 'Professional growth and advancement',
    currentScore: 65,
    targetScore: 85,
    gradient: 'from-green-500 to-teal-600',
    visionStatement: 'To advance in my career and become a respected leader in my field',
    currentActions: ['Improve leadership skills', 'Take on new responsibilities', 'Network more effectively'],
    milestones: [],
    lastUpdated: new Date().toISOString(),
    salPrinciple: 'Accountability',
    icon: 'Briefcase'
  },
  {
    name: 'Health & Wellness',
    description: 'Physical and mental well-being',
    currentScore: 80,
    targetScore: 95,
    gradient: 'from-orange-500 to-red-600',
    visionStatement: 'To maintain optimal physical and mental health for peak performance',
    currentActions: ['Exercise 4 times per week', 'Maintain healthy diet', 'Get 8 hours of sleep'],
    milestones: [],
    lastUpdated: new Date().toISOString(),
    salPrinciple: 'Integrity',
    icon: 'Heart'
  }
]

// Sample existential levels
const sampleExistentialLevels: Omit<ExistentialLevel, 'id'>[] = [
  {
    level: 1,
    name: 'Foundation Builder',
    description: 'Establishing the basics of self-action leadership',
    color: 'blue',
    requirements: ['Complete 5 tasks', 'Master 10 vocabulary words', 'Complete 1 module', 'Write 5 journal entries'],
    focus: 'Building fundamental habits and understanding core concepts'
  },
  {
    level: 2,
    name: 'Discipline Developer',
    description: 'Building consistent habits and routines',
    color: 'green',
    requirements: ['Complete 15 tasks', 'Master 25 vocabulary words', 'Complete 3 modules', 'Write 15 journal entries'],
    focus: 'Developing consistent daily practices and routines'
  }
]

// Sample gravity categories
const sampleGravityCategories: Omit<GravityCategory, 'id'>[] = [
  {
    name: 'Time Management',
    icon: 'Clock',
    color: 'blue',
    description: 'Issues related to time allocation and productivity',
    examples: ['Procrastination', 'Poor scheduling', 'Time waste']
  },
  {
    name: 'Health & Wellness',
    icon: 'Heart',
    color: 'red',
    description: 'Physical and mental health challenges',
    examples: ['Poor diet', 'Lack of exercise', 'Stress management']
  }
]

// Sample growth goals
const sampleGrowthGoals: Omit<GrowthGoal, 'id'>[] = [
  {
    title: 'Master SAL Fundamentals',
    description: 'Complete the foundational concepts of Self-Action Leadership',
    category: 'mental',
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 25,
    milestones: ['Read Chapter 1', 'Complete vocabulary review', 'Write reflection'],
    completedMilestones: 1,
    priority: 'high',
    status: 'active',
    dateCreated: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  },
  {
    title: 'Build Daily Reading Habit',
    description: 'Read for at least 30 minutes every day',
    category: 'mental',
    targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 10,
    milestones: ['Establish reading time', 'Create reading list', 'Track progress'],
    completedMilestones: 0,
    priority: 'medium',
    status: 'active',
    dateCreated: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  }
]

// Sample journey maps
const sampleJourneyMaps: Omit<JourneyMap, 'id'>[] = [
  {
    title: 'My SAL Journey',
    description: 'Personal journey through Self-Action Leadership principles',
    currentNodeId: null,
    completedNodes: 0,
    totalNodes: 5,
    theme: 'blue'
  }
]

// Sample journey nodes
const sampleJourneyNodes: Omit<JourneyNode, 'id'>[] = [
  {
    journeyMapId: '', // Will be set after creating journey map
    title: 'Foundation',
    description: 'Establishing basic SAL principles',
    type: 'milestone',
    positionX: 100,
    positionY: 100,
    completed: false,
    completionDate: null,
    metadata: {}
  },
  {
    journeyMapId: '', // Will be set after creating journey map
    title: 'Discipline',
    description: 'Building consistent habits',
    type: 'challenge',
    positionX: 300,
    positionY: 100,
    completed: false,
    completionDate: null,
    metadata: {}
  }
]

async function seedDemoData() {
  console.log('🌱 Starting to seed demo data...')

  try {
    // Seed vocabulary words
    console.log('📚 Seeding vocabulary words...')
    for (const word of sampleVocabularyWords) {
      await supabase.from('vocabulary_words').insert(word)
    }
    console.log(`✅ Seeded ${sampleVocabularyWords.length} vocabulary words`)

    // Seed journal entries
    console.log('📝 Seeding journal entries...')
    for (const entry of sampleJournalEntries) {
      await supabase.from('journal_entries').insert(entry)
    }
    console.log(`✅ Seeded ${sampleJournalEntries.length} journal entries`)

    // Seed tasks
    console.log('✅ Seeding tasks...')
    for (const task of sampleTasks) {
      await supabase.from('tasks').insert(task)
    }
    console.log(`✅ Seeded ${sampleTasks.length} tasks`)

    // Seed books
    console.log('📖 Seeding books...')
    for (const book of sampleBooks) {
      await supabase.from('books').insert(book)
    }
    console.log(`✅ Seeded ${sampleBooks.length} books`)

    // Seed life arenas
    console.log('🎯 Seeding life arenas...')
    for (const arena of sampleLifeArenas) {
      await supabase.from('life_arenas').insert(arena)
    }
    console.log(`✅ Seeded ${sampleLifeArenas.length} life arenas`)

    // Seed existential levels
    console.log('🌟 Seeding existential levels...')
    for (const level of sampleExistentialLevels) {
      await supabase.from('existential_levels').insert(level)
    }
    console.log(`✅ Seeded ${sampleExistentialLevels.length} existential levels`)

    // Seed gravity categories
    console.log('⚖️ Seeding gravity categories...')
    for (const category of sampleGravityCategories) {
      await supabase.from('gravity_categories').insert(category)
    }
    console.log(`✅ Seeded ${sampleGravityCategories.length} gravity categories`)

    // Seed growth goals
    console.log('🎯 Seeding growth goals...')
    for (const goal of sampleGrowthGoals) {
      await supabase.from('growth_goals').insert(goal)
    }
    console.log(`✅ Seeded ${sampleGrowthGoals.length} growth goals`)

    // Seed journey maps
    console.log('🗺️ Seeding journey maps...')
    const journeyMapIds: string[] = []
    for (const map of sampleJourneyMaps) {
      const { data } = await supabase.from('journey_maps').insert(map).select().single()
      if (data) journeyMapIds.push(data.id)
    }
    console.log(`✅ Seeded ${sampleJourneyMaps.length} journey maps`)

    // Seed journey nodes (with proper journey map IDs)
    console.log('📍 Seeding journey nodes...')
    for (let i = 0; i < sampleJourneyNodes.length && i < journeyMapIds.length; i++) {
      const node = {
        ...sampleJourneyNodes[i],
        journeyMapId: journeyMapIds[0] // Use first journey map
      }
      await supabase.from('journey_nodes').insert(node)
    }
    console.log(`✅ Seeded ${Math.min(sampleJourneyNodes.length, journeyMapIds.length)} journey nodes`)

    console.log('🎉 Demo data seeding completed successfully!')
    console.log('Your SAL OS is now populated with sample data.')

  } catch (error) {
    console.error('❌ Error seeding demo data:', error)
    throw error
  }
}

// Run the seeding function
seedDemoData()
  .then(() => {
    console.log('✅ Seeding process completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Seeding process failed:', error)
    process.exit(1)
  }) 