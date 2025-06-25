import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function detailedDiagnostic() {
  console.log('🔍 DETAILED BACKEND DIAGNOSTIC')
  console.log('==============================')
  
  try {
    // Test 1: Basic connection
    console.log('\n1️⃣ Testing basic connection...')
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Session error:', JSON.stringify(sessionError, null, 2))
    } else {
      console.log('✅ Session successful:', sessionData)
    }

    // Test 2: Check if we can list tables
    console.log('\n2️⃣ Testing table access...')
    
    const testTables = ['journal_entries', 'vocabulary_words', 'tasks']
    
    for (const table of testTables) {
      console.log(`\n📋 Testing table: ${table}`)
      
      try {
        // Test simple select
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.error(`❌ ${table} error:`, JSON.stringify(error, null, 2))
        } else {
          console.log(`✅ ${table} accessible, count: ${data?.length || 0}`)
        }
      } catch (err) {
        console.error(`❌ ${table} exception:`, err)
      }
    }

    // Test 3: Try to create a simple test record
    console.log('\n3️⃣ Testing record creation...')
    
    try {
      const testEntry = {
        title: 'Diagnostic Test Entry',
        content: 'This is a diagnostic test entry.',
        type: 'test',
        date: new Date().toISOString(),
        book_reference: 'Test Book',
        chapter_reference: 'Test Chapter',
        word_count: 10,
        tags: ['test', 'diagnostic']
      }

      const { data, error } = await supabase
        .from('journal_entries')
        .insert(testEntry)
        .select()
        .single()

      if (error) {
        console.error('❌ Create error:', JSON.stringify(error, null, 2))
      } else {
        console.log('✅ Create successful:', data)
        
        // Test read
        const { data: readData, error: readError } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('id', data.id)
          .single()
        
        if (readError) {
          console.error('❌ Read error:', JSON.stringify(readError, null, 2))
        } else {
          console.log('✅ Read successful:', readData)
        }
        
        // Test delete
        const { error: deleteError } = await supabase
          .from('journal_entries')
          .delete()
          .eq('id', data.id)
        
        if (deleteError) {
          console.error('❌ Delete error:', JSON.stringify(deleteError, null, 2))
        } else {
          console.log('✅ Delete successful')
        }
      }
    } catch (err) {
      console.error('❌ Create exception:', err)
    }

    // Test 4: Check RLS policies
    console.log('\n4️⃣ Testing RLS policies...')
    
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('count')
        .limit(1)
      
      if (error) {
        console.error('❌ RLS error:', JSON.stringify(error, null, 2))
      } else {
        console.log('✅ RLS allows query')
      }
    } catch (err) {
      console.error('❌ RLS exception:', err)
    }

    // Test 5: Check table structure
    console.log('\n5️⃣ Testing table structure...')
    
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .limit(0)
      
      if (error) {
        console.error('❌ Structure error:', JSON.stringify(error, null, 2))
      } else {
        console.log('✅ Table structure accessible')
      }
    } catch (err) {
      console.error('❌ Structure exception:', err)
    }

  } catch (error) {
    console.error('❌ Diagnostic failed:', error)
  }
}

detailedDiagnostic()
  .then(() => {
    console.log('\n🏁 Diagnostic complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Diagnostic failed:', error)
    process.exit(1)
  }) 