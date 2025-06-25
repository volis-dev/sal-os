import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

interface SecurityTestResult {
  table: string
  operation: string
  before: 'blocked' | 'allowed' | 'unknown'
  after: 'blocked' | 'allowed' | 'unknown'
  improved: boolean
  errorMessage?: string
}

class QuickSecurityVerification {
  private supabase: any
  private results: SecurityTestResult[] = []

  constructor() {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async runQuickVerification() {
    console.log('🔍 SAL OS QUICK SECURITY VERIFICATION')
    console.log('=====================================')
    console.log(`URL: ${supabaseUrl}`)
    console.log(`Key: ${supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'undefined'}`)
    console.log('')

    // Ensure we're unauthenticated
    await this.supabase.auth.signOut()
    
    await this.testDatabaseOperations()
    await this.testRESTAPI()
    await this.generateVerificationReport()
  }

  private async testDatabaseOperations() {
    console.log('1️⃣ DATABASE OPERATIONS TEST')
    console.log('==========================')
    
    const existingTables = [
      'journal_entries',
      'vocabulary_words', 
      'tasks',
      'books',
      'life_arenas',
      'growth_goals',
      'journey_maps'
    ]

    const operations = [
      { name: 'SELECT', test: (table: string) => this.supabase.from(table).select('*').limit(1) },
      { name: 'INSERT', test: (table: string) => this.supabase.from(table).insert(this.generateTestData(table)).select().single() },
      { name: 'UPDATE', test: (table: string) => this.supabase.from(table).update({ updated_at: new Date().toISOString() }).order('id', { ascending: true }).limit(1) },
      { name: 'DELETE', test: (table: string) => this.supabase.from(table).delete().order('id', { ascending: true }).limit(1) }
    ]

    for (const tableName of existingTables) {
      console.log(`\n📋 Testing ${tableName}:`)
      
      for (const operation of operations) {
        try {
          const { data, error } = await operation.test(tableName)

          const result: SecurityTestResult = {
            table: tableName,
            operation: operation.name,
            before: 'unknown',
            after: 'unknown',
            improved: false
          }

          console.log(`  🔒 ${operation.name}:`)
          
          if (error) {
            if (error.message.includes('Authentication required')) {
              console.log(`    ✅ BLOCKED: ${error.message}`)
              result.after = 'blocked'
              result.errorMessage = error.message
            } else if (error.message.includes('row-level security policy')) {
              console.log(`    ✅ BLOCKED: RLS policy - ${error.message}`)
              result.after = 'blocked'
              result.errorMessage = error.message
            } else if (error.message.includes('permission denied')) {
              console.log(`    ✅ BLOCKED: Permission denied - ${error.message}`)
              result.after = 'blocked'
              result.errorMessage = error.message
            } else {
              console.log(`    ⚠️ UNEXPECTED ERROR: ${error.message}`)
              result.after = 'unknown'
              result.errorMessage = error.message
            }
          } else {
            console.log(`    ❌ ALLOWED: Returned ${data?.length || 0} rows`)
            result.after = 'allowed'
            if (data && data.length > 0) {
              console.log(`    🚨 CRITICAL: Data exposed without authentication!`)
            }
          }

          // Determine if this is an improvement (assuming before was 'allowed')
          result.before = 'allowed' // Based on previous audit results
          result.improved = result.after === 'blocked' && result.before === 'allowed'

          this.results.push(result)

        } catch (error) {
          console.log(`    ❌ Test failed: ${error}`)
          this.results.push({
            table: tableName,
            operation: operation.name,
            before: 'unknown',
            after: 'unknown',
            improved: false,
            errorMessage: error instanceof Error ? error.message : String(error)
          })
        }
      }
    }
  }

  private async testRESTAPI() {
    console.log('\n2️⃣ REST API SECURITY TEST')
    console.log('==========================')
    
    const endpoints = [
      '/rest/v1/journal_entries',
      '/rest/v1/vocabulary_words',
      '/rest/v1/tasks',
      '/rest/v1/books',
      '/rest/v1/life_arenas',
      '/rest/v1/growth_goals',
      '/rest/v1/journey_maps'
    ]

    for (const endpoint of endpoints) {
      console.log(`\n📋 Testing ${endpoint}:`)
      
      if (supabaseUrl && supabaseKey) {
        try {
          const response = await fetch(`${supabaseUrl}${endpoint}`, {
            method: 'GET',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            }
          })

          const result: SecurityTestResult = {
            table: endpoint.split('/').pop() || 'unknown',
            operation: 'REST_GET',
            before: 'allowed', // Based on previous audit results
            after: 'unknown',
            improved: false
          }

          console.log(`  🔒 GET: ${response.status}`)
          
          if (response.status === 403 || response.status === 401) {
            console.log(`    ✅ BLOCKED: Properly secured (${response.status})`)
            result.after = 'blocked'
            result.improved = true
          } else if (response.status === 200) {
            const responseData = await response.json()
            if (responseData && responseData.length > 0) {
              console.log(`    ❌ ALLOWED: Data exposed via REST API!`)
              result.after = 'allowed'
            } else {
              console.log(`    ⚠️ ALLOWED: Endpoint accessible but no data returned`)
              result.after = 'allowed'
            }
          } else {
            console.log(`    ⚠️ UNEXPECTED: Status ${response.status}`)
            result.after = 'unknown'
          }

          this.results.push(result)

        } catch (error) {
          console.log(`    ❌ Test failed: ${error}`)
          this.results.push({
            table: endpoint.split('/').pop() || 'unknown',
            operation: 'REST_GET',
            before: 'allowed',
            after: 'unknown',
            improved: false,
            errorMessage: error instanceof Error ? error.message : String(error)
          })
        }
      } else {
        console.error('Missing supabaseUrl or supabaseKey for REST API test')
      }
    }
  }

  private async generateVerificationReport() {
    console.log('\n3️⃣ VERIFICATION SUMMARY REPORT')
    console.log('===============================')
    
    const totalTests = this.results.length
    const blockedTests = this.results.filter(r => r.after === 'blocked').length
    const allowedTests = this.results.filter(r => r.after === 'allowed').length
    const improvedTests = this.results.filter(r => r.improved).length
    
    const securityScore = Math.round((blockedTests / totalTests) * 100)
    const improvementPercentage = Math.round((improvedTests / totalTests) * 100)
    
    console.log(`\n📊 SECURITY STATUS:`)
    console.log(`Total tests: ${totalTests}`)
    console.log(`Blocked operations: ${blockedTests}`)
    console.log(`Allowed operations: ${allowedTests}`)
    console.log(`Improved operations: ${improvedTests}`)
    console.log(`Security score: ${securityScore}%`)
    console.log(`Improvement: ${improvementPercentage}%`)
    
    // Before/After comparison
    console.log(`\n📋 BEFORE/AFTER COMPARISON:`)
    console.log(`Before: Most operations returned empty results (insecure)`)
    console.log(`After: ${blockedTests}/${totalTests} operations properly blocked`)
    
    // Detailed results by table
    const resultsByTable = this.results.reduce((acc, r) => {
      if (!acc[r.table]) acc[r.table] = []
      acc[r.table].push(r)
      return acc
    }, {} as Record<string, SecurityTestResult[]>)
    
    console.log(`\n📋 DETAILED RESULTS BY TABLE:`)
    Object.entries(resultsByTable).forEach(([table, tests]) => {
      const blocked = tests.filter(t => t.after === 'blocked').length
      const total = tests.length
      const status = blocked === total ? '✅ SECURE' : blocked > 0 ? '⚠️ PARTIAL' : '❌ INSECURE'
      
      console.log(`\n📋 ${table}: ${status} (${blocked}/${total} blocked)`)
      
      tests.forEach(test => {
        const status = test.after === 'blocked' ? '✅' : test.after === 'allowed' ? '❌' : '⚠️'
        console.log(`  ${status} ${test.operation}: ${test.after.toUpperCase()}`)
        if (test.errorMessage && test.after === 'blocked') {
          console.log(`    📝 ${test.errorMessage}`)
        }
      })
    })
    
    // Security assessment
    console.log(`\n🏭 SECURITY ASSESSMENT:`)
    
    if (securityScore >= 95) {
      console.log(`✅ EXCELLENT: ${securityScore}% of operations properly secured`)
    } else if (securityScore >= 80) {
      console.log(`⚠️ GOOD: ${securityScore}% of operations secured, minor gaps remain`)
    } else if (securityScore >= 50) {
      console.log(`⚠️ PARTIAL: ${securityScore}% of operations secured, significant gaps`)
    } else {
      console.log(`❌ POOR: Only ${securityScore}% of operations secured`)
    }
    
    if (improvementPercentage > 0) {
      console.log(`📈 IMPROVEMENT: ${improvementPercentage}% of operations improved`)
    }
    
    // Final recommendation
    console.log(`\n📝 FINAL RECOMMENDATION:`)
    
    if (securityScore >= 95) {
      console.log(`✅ PRODUCTION READY: All critical operations are properly secured`)
    } else if (securityScore >= 80) {
      console.log(`⚠️ NEARLY READY: Minor security gaps need attention`)
    } else {
      console.log(`❌ NOT READY: Significant security vulnerabilities remain`)
      console.log(`   - ${allowedTests} operations still allow unauthorized access`)
      console.log(`   - Immediate action required before production deployment`)
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

// Run the quick security verification
async function runQuickSecurityVerification() {
  try {
    const verification = new QuickSecurityVerification()
    await verification.runQuickVerification()
  } catch (error) {
    console.error('❌ Quick security verification failed to start:', error)
    process.exit(1)
  }
}

runQuickSecurityVerification()
  .then(() => {
    console.log('\n🏁 Quick security verification complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Quick security verification failed:', error)
    process.exit(1)
  }) 