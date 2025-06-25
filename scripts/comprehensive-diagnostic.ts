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

async function comprehensiveDiagnostic() {
  console.log('🔍 COMPREHENSIVE BACKEND DIAGNOSTIC')
  console.log('====================================')
  console.log(`URL: ${supabaseUrl}`)
  console.log(`Key: ${supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'undefined'}`)
  
  try {
    // Test 1: Basic connection
    console.log('\n1️⃣ Testing basic connection...')
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Session error:', JSON.stringify(sessionError, null, 2))
    } else {
      console.log('✅ Session successful:', sessionData)
    }

    // Test 2: Direct HTTP request to Supabase
    console.log('\n2️⃣ Testing direct HTTP connectivity...')
    
    if (supabaseUrl && supabaseKey) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'GET',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        })
        
        console.log(`✅ HTTP Status: ${response.status}`)
        console.log(`✅ Response Headers:`, Object.fromEntries(response.headers.entries()))
        
        if (response.ok) {
          const text = await response.text()
          console.log(`✅ Response Body: ${text.substring(0, 200)}...`)
        } else {
          console.log(`❌ HTTP Error: ${response.statusText}`)
        }
      } catch (httpError) {
        console.error('❌ HTTP request failed:', httpError)
      }
    } else {
      console.error('Missing supabaseUrl or supabaseKey for REST API test')
    }

    // Test 3: Test each table individually
    console.log('\n3️⃣ Testing individual tables...')
    
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
    
    for (const table of tables) {
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

    // Test 4: Test RLS policies
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

    // Test 5: Test authentication
    console.log('\n5️⃣ Testing authentication...')
    
    try {
      const { data, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('❌ Auth error:', JSON.stringify(error, null, 2))
      } else {
        console.log('✅ Auth successful:', data)
      }
    } catch (err) {
      console.error('❌ Auth exception:', err)
    }

    // Test 6: Test project status
    console.log('\n6️⃣ Testing project status...')
    
    if (supabaseUrl && supabaseKey) {
      const response = await fetch(`${supabaseUrl}/auth/v1/`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey
        }
      })
      
      console.log(`✅ Auth endpoint status: ${response.status}`)
    } else {
      console.error('Missing supabaseUrl or supabaseKey for Auth API test')
    }

  } catch (error) {
    console.error('❌ Diagnostic failed:', error)
  }
}

comprehensiveDiagnostic()
  .then(() => {
    console.log('\n🏁 Comprehensive diagnostic complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Comprehensive diagnostic failed:', error)
    process.exit(1)
  }) 