import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

interface SecurityTestResult {
  table: string
  operation: string
  passed: boolean
  error: string | null
  statusCode?: number
  dataExposed?: boolean
}

interface PolicyCoverageResult {
  table: string
  select: boolean
  insert: boolean
  update: boolean
  delete: boolean
  total: number
}

class ComprehensiveRLSSecurityAudit {
  private supabase: any
  private results: SecurityTestResult[] = []
  private policyCoverage: PolicyCoverageResult[] = []

  constructor() {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async runComprehensiveAudit() {
    console.log('🔒 SAL OS COMPREHENSIVE RLS SECURITY AUDIT')
    console.log('==========================================')
    console.log(`URL: ${supabaseUrl}`)
    console.log(`Key: ${supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'undefined'}`)
    console.log('')

    // Ensure we're unauthenticated
    await this.supabase.auth.signOut()
    
    await this.verifyAuthCheckFunction()
    await this.testUnauthenticatedDatabaseOperations()
    await this.testRESTAPISecurity()
    await this.verifyPolicyCoverage()
    await this.generateSecurityReport()
  }

  private async verifyAuthCheckFunction() {
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

      // Test direct SQL call to auth_check()
      try {
        const { data: sqlTest, error: sqlError } = await this.supabase
          .from('journal_entries')
          .select('*')
          .limit(1)

        if (sqlError) {
          if (sqlError.message.includes('Authentication required')) {
            console.log('✅ RLS policies using auth_check() properly')
          } else {
            console.log(`⚠️ RLS error: ${sqlError.message}`)
          }
        } else {
          console.log('❌ RLS not enforcing auth_check()')
        }
      } catch (error) {
        console.log(`⚠️ SQL test error: ${error}`)
      }

    } catch (error) {
      console.log(`❌ Function verification failed: ${error}`)
    }
  }

  private async testUnauthenticatedDatabaseOperations() {
    console.log('\n2️⃣ UNAUTHENTICATED DATABASE OPERATIONS TEST')
    console.log('============================================')
    
    const tables = [
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

    for (const tableName of tables) {
      console.log(`\n📋 Testing ${tableName}:`)
      await this.testTableOperations(tableName)
    }
  }

  private async testTableOperations(tableName: string) {
    const operations = [
      {
        name: 'SELECT',
        test: () => this.supabase.from(tableName).select('*').limit(5),
        expectedError: 'Authentication required'
      },
      {
        name: 'INSERT',
        test: () => this.supabase.from(tableName).insert(this.generateTestData(tableName)).select().single(),
        expectedError: 'Authentication required'
      },
      {
        name: 'UPDATE',
        test: () => this.supabase.from(tableName).update({ updated_at: new Date().toISOString() }).order('id', { ascending: true }).limit(1),
        expectedError: 'Authentication required'
      },
      {
        name: 'DELETE',
        test: () => this.supabase.from(tableName).delete().order('id', { ascending: true }).limit(1),
        expectedError: 'Authentication required'
      }
    ]

    for (const operation of operations) {
      try {
        const { data, error } = await operation.test()

        const result: SecurityTestResult = {
          table: tableName,
          operation: operation.name,
          passed: false,
          error: null,
          dataExposed: false
        }

        console.log(`  🔒 ${operation.name}:`)
        
        if (error) {
          if (error.message.includes(operation.expectedError)) {
            console.log(`    ✅ PASS: ${error.message}`)
            result.passed = true
            result.error = error.message
          } else if (error.message.includes('row-level security policy')) {
            console.log(`    ✅ PASS: RLS enforced - ${error.message}`)
            result.passed = true
            result.error = error.message
          } else if (error.message.includes('permission denied')) {
            console.log(`    ✅ PASS: Permission denied - ${error.message}`)
            result.passed = true
            result.error = error.message
          } else {
            console.log(`    ⚠️ UNEXPECTED ERROR: ${error.message}`)
            result.error = error.message
          }
        } else {
          console.log(`    ❌ FAIL: RLS NOT ENFORCED - Returned ${data?.length || 0} rows`)
          result.dataExposed = true
          if (data && data.length > 0) {
            console.log(`    🚨 CRITICAL: Data exposed without authentication!`)
          }
        }

        this.results.push(result)

      } catch (error) {
        console.log(`    ❌ Test failed: ${error}`)
        this.results.push({
          table: tableName,
          operation: operation.name,
          passed: false,
          error: error instanceof Error ? error.message : String(error)
        })
      }
    }
  }

  private async testRESTAPISecurity() {
    console.log('\n3️⃣ REST API SECURITY TEST')
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

    const methods = [
      { name: 'GET', method: 'GET' },
      { name: 'POST', method: 'POST', body: JSON.stringify(this.generateTestData('journal_entries')) },
      { name: 'PATCH', method: 'PATCH', body: JSON.stringify({ title: 'Updated' }) },
      { name: 'DELETE', method: 'DELETE' }
    ]

    for (const endpoint of endpoints) {
      console.log(`\n📋 Testing ${endpoint}:`)
      
      for (const method of methods) {
        try {
          if (supabaseUrl && supabaseKey) {
            const response = await fetch(`${supabaseUrl}${endpoint}`, {
              method: method.method,
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json'
              },
              body: method.body
            })

            const result: SecurityTestResult = {
              table: endpoint.split('/').pop() || 'unknown',
              operation: `REST_${method.name}`,
              passed: false,
              error: null,
              statusCode: response.status,
              dataExposed: false
            }

            console.log(`  🔒 ${method.name}: ${response.status}`)
            
            if (response.status === 403 || response.status === 401) {
              console.log(`    ✅ PASS: Properly secured`)
              result.passed = true
            } else if (response.status === 200) {
              const responseData = await response.json()
              if (responseData && responseData.length > 0) {
                console.log(`    ❌ FAIL: Data exposed via REST API!`)
                result.dataExposed = true
              } else {
                console.log(`    ⚠️ Endpoint accessible but no data returned`)
              }
            } else {
              console.log(`    ⚠️ Unexpected status: ${response.status}`)
            }

            this.results.push(result)
          } else {
            console.error('Missing supabaseUrl or supabaseKey for endpoint test')
          }
        } catch (error) {
          console.log(`    ❌ ${method.name} test failed: ${error}`)
          this.results.push({
            table: endpoint.split('/').pop() || 'unknown',
            operation: `REST_${method.name}`,
            passed: false,
            error: error instanceof Error ? error.message : String(error)
          })
        }
      }
    }
  }

  private async verifyPolicyCoverage() {
    console.log('\n4️⃣ POLICY COVERAGE VERIFICATION')
    console.log('===============================')
    
    const tables = [
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

    for (const tableName of tables) {
      const coverage: PolicyCoverageResult = {
        table: tableName,
        select: false,
        insert: false,
        update: false,
        delete: false,
        total: 0
      }

      console.log(`\n📋 Verifying ${tableName} policies:`)

      // Test each operation to see if policies exist
      const operations = ['select', 'insert', 'update', 'delete']
      
      for (const operation of operations) {
        try {
          let testQuery: any
          
          switch (operation) {
            case 'select':
              testQuery = this.supabase.from(tableName).select('id').limit(1)
              break
            case 'insert':
              testQuery = this.supabase.from(tableName).insert(this.generateTestData(tableName)).select().single()
              break
            case 'update':
              testQuery = this.supabase.from(tableName).update({ updated_at: new Date().toISOString() }).order('id', { ascending: true }).limit(1)
              break
            case 'delete':
              testQuery = this.supabase.from(tableName).delete().order('id', { ascending: true }).limit(1)
              break
          }

          const { data, error } = await testQuery

          if (error) {
            if (error.message.includes('Authentication required') || 
                error.message.includes('row-level security policy') ||
                error.message.includes('permission denied')) {
              coverage[operation as 'select' | 'insert' | 'update' | 'delete'] = true
              coverage.total++
              console.log(`  ✅ ${operation.toUpperCase()} policy exists`)
            } else {
              console.log(`  ⚠️ ${operation.toUpperCase()} policy issue: ${error.message}`)
            }
          } else {
            console.log(`  ❌ ${operation.toUpperCase()} policy missing or not enforced`)
          }

        } catch (error) {
          console.log(`  ❌ ${operation.toUpperCase()} test failed: ${error}`)
        }
      }

      this.policyCoverage.push(coverage)
    }
  }

  private async generateSecurityReport() {
    console.log('\n5️⃣ SECURITY AUDIT SUMMARY REPORT')
    console.log('=================================')
    
    const totalTests = this.results.length
    const passedTests = this.results.filter(r => r.passed).length
    const failedTests = this.results.filter(r => !r.passed).length
    const dataExposedTests = this.results.filter(r => r.dataExposed).length
    
    const securityScore = Math.round((passedTests / totalTests) * 100)
    
    console.log(`\n📊 OVERALL SECURITY SCORE: ${securityScore}%`)
    console.log(`✅ Passed Tests: ${passedTests}/${totalTests}`)
    console.log(`❌ Failed Tests: ${failedTests}/${totalTests}`)
    console.log(`🚨 Data Exposure Incidents: ${dataExposedTests}`)
    
    // Policy coverage summary
    const totalPolicies = this.policyCoverage.reduce((sum, p) => sum + p.total, 0)
    const expectedPolicies = this.policyCoverage.length * 4 // 4 operations per table
    const policyCoverageScore = Math.round((totalPolicies / expectedPolicies) * 100)
    
    console.log(`\n📋 POLICY COVERAGE: ${policyCoverageScore}%`)
    console.log(`✅ Active Policies: ${totalPolicies}/${expectedPolicies}`)
    
    // Failed tests breakdown
    if (failedTests > 0) {
      console.log('\n❌ FAILED TESTS BREAKDOWN:')
      const failedByTable = this.results
        .filter(r => !r.passed)
        .reduce((acc, r) => {
          if (!acc[r.table]) acc[r.table] = []
          acc[r.table].push(r.operation)
          return acc
        }, {} as Record<string, string[]>)
      
      Object.entries(failedByTable).forEach(([table, operations]) => {
        console.log(`  📋 ${table}: ${operations.join(', ')}`)
      })
    }
    
    // Data exposure incidents
    if (dataExposedTests > 0) {
      console.log('\n🚨 CRITICAL: DATA EXPOSURE INCIDENTS:')
      this.results
        .filter(r => r.dataExposed)
        .forEach(r => {
          console.log(`  📋 ${r.table} - ${r.operation}: Data exposed without authentication!`)
        })
    }
    
    // Production readiness assessment
    console.log('\n🏭 PRODUCTION READINESS ASSESSMENT:')
    
    if (securityScore >= 95 && dataExposedTests === 0) {
      console.log('✅ PRODUCTION READY: All security measures properly enforced')
    } else if (securityScore >= 80 && dataExposedTests === 0) {
      console.log('⚠️ NEARLY READY: Minor security gaps detected, review recommended')
    } else if (dataExposedTests > 0) {
      console.log('❌ CRITICAL SECURITY VULNERABILITIES: Data exposure detected - DO NOT DEPLOY')
    } else {
      console.log('❌ SECURITY GAPS: Multiple authentication failures - Review required')
    }
    
    // Recommendations
    console.log('\n📝 RECOMMENDATIONS:')
    
    if (dataExposedTests > 0) {
      console.log('🚨 IMMEDIATE ACTION REQUIRED:')
      console.log('  - Fix RLS policies for tables with data exposure')
      console.log('  - Verify auth_check() function is properly deployed')
      console.log('  - Re-run security audit after fixes')
    }
    
    if (policyCoverageScore < 100) {
      console.log('🔧 POLICY GAPS:')
      console.log('  - Deploy missing RLS policies')
      console.log('  - Ensure all tables have SELECT, INSERT, UPDATE, DELETE policies')
    }
    
    if (securityScore < 95) {
      console.log('🔍 SECURITY REVIEW:')
      console.log('  - Investigate failed authentication tests')
      console.log('  - Verify error messages are consistent')
      console.log('  - Test with authenticated users')
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
      case 'vocabulary_reviews':
        return {
          ...baseData,
          word_id: 1,
          review_date: new Date().toISOString().split('T')[0],
          success: true,
          notes: 'Test review'
        }
      case 'task_time_logs':
        return {
          ...baseData,
          task_id: 1,
          start_time: new Date().toISOString(),
          end_time: new Date().toISOString(),
          duration_minutes: 30,
          notes: 'Test time log'
        }
      case 'book_notes':
        return {
          ...baseData,
          book_id: 1,
          chapter: 1,
          page: 10,
          note: 'Test note',
          type: 'highlight'
        }
      case 'goal_progress':
        return {
          ...baseData,
          goal_id: 1,
          progress_date: new Date().toISOString().split('T')[0],
          progress_value: 50,
          notes: 'Test progress'
        }
      case 'arena_metrics':
        return {
          ...baseData,
          arena_id: 1,
          metric_date: new Date().toISOString().split('T')[0],
          metric_value: 75,
          metric_type: 'satisfaction'
        }
      case 'journey_waypoints':
        return {
          ...baseData,
          map_id: 1,
          title: 'Test Waypoint',
          description: 'Test waypoint description',
          order_index: 1,
          completed: false
        }
      case 'vocabulary_sources':
        return {
          ...baseData,
          name: 'Test Source',
          description: 'Test source description',
          url: 'https://example.com'
        }
      case 'task_categories':
        return {
          ...baseData,
          name: 'Test Category',
          description: 'Test category description',
          color: '#3B82F6'
        }
      case 'book_categories':
        return {
          ...baseData,
          name: 'Test Category',
          description: 'Test category description',
          color: '#3B82F6'
        }
      default:
        return baseData
    }
  }
}

// Run the comprehensive security audit
async function runComprehensiveSecurityAudit() {
  try {
    const audit = new ComprehensiveRLSSecurityAudit()
    await audit.runComprehensiveAudit()
  } catch (error) {
    console.error('❌ Security audit failed to start:', error)
    process.exit(1)
  }
}

runComprehensiveSecurityAudit()
  .then(() => {
    console.log('\n🏁 Comprehensive security audit complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Security audit failed:', error)
    process.exit(1)
  }) 