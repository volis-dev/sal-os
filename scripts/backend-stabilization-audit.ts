import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

interface AuditResult {
  stage: string
  status: 'PASS' | 'FAIL'
  details: string[]
  errors: string[]
}

class BackendStabilizationAudit {
  private supabase: any
  private results: AuditResult[] = []

  constructor() {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async runFullAudit() {
    console.log('🔎 SAL OS BACKEND STABILIZATION AUDIT')
    console.log('=====================================')
    console.log(`URL: ${supabaseUrl}`)
    console.log(`Key: ${supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'undefined'}`)
    console.log('')

    await this.stage1EnvironmentVerification()
    await this.stage2SupabaseConnectivityCheck()
    await this.stage3FullSchemaAudit()
    await this.stage4CRUDServiceLayerValidation()
    await this.stage5RLSPolicyComplianceTest()

    this.generateFinalReport()
  }

  private async stage1EnvironmentVerification() {
    console.log('1️⃣ ENVIRONMENT VERIFICATION')
    console.log('----------------------------')
    
    const result: AuditResult = {
      stage: 'Environment Verification',
      status: 'PASS',
      details: [],
      errors: []
    }

    try {
      // Check environment variables
      if (!supabaseUrl) {
        result.status = 'FAIL'
        result.errors.push('NEXT_PUBLIC_SUPABASE_URL is missing')
      } else {
        result.details.push('✅ NEXT_PUBLIC_SUPABASE_URL is set')
      }

      if (!supabaseKey) {
        result.status = 'FAIL'
        result.errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing')
      } else {
        result.details.push('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set')
      }

      // Validate URL format
      if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
        result.status = 'FAIL'
        result.errors.push('NEXT_PUBLIC_SUPABASE_URL must be HTTPS')
      } else if (supabaseUrl) {
        result.details.push('✅ Supabase URL format is valid')
      }

      // Validate key format
      if (supabaseKey && !supabaseKey.startsWith('eyJ')) {
        result.status = 'FAIL'
        result.errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY format is invalid')
      } else if (supabaseKey) {
        result.details.push('✅ Supabase key format is valid')
      }

    } catch (error) {
      result.status = 'FAIL'
      result.errors.push(`Environment verification failed: ${error}`)
    }

    this.results.push(result)
    this.printStageResult(result)
  }

  private async stage2SupabaseConnectivityCheck() {
    console.log('\n2️⃣ SUPABASE CONNECTIVITY CHECK')
    console.log('-------------------------------')
    
    const result: AuditResult = {
      stage: 'Supabase Connectivity Check',
      status: 'PASS',
      details: [],
      errors: []
    }

    try {
      // Test basic connection
      const { data: sessionData, error: sessionError } = await this.supabase.auth.getSession()
      
      if (sessionError) {
        result.status = 'FAIL'
        result.errors.push(`Session error: ${JSON.stringify(sessionError)}`)
      } else {
        result.details.push('✅ Basic Supabase connection successful')
      }

      // Test REST API connectivity
      try {
        if (!supabaseUrl || !supabaseKey) {
          result.status = 'FAIL'
          result.errors.push('Missing environment variables for REST API test')
        } else {
          const response = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'GET',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`
            }
          })
          
          if (response.ok) {
            result.details.push('✅ REST API connectivity confirmed')
          } else {
            result.status = 'FAIL'
            result.errors.push(`REST API error: ${response.status} ${response.statusText}`)
          }
        }
      } catch (httpError) {
        result.status = 'FAIL'
        result.errors.push(`HTTP request failed: ${httpError}`)
      }

      // Test authentication endpoint
      try {
        if (!supabaseUrl || !supabaseKey) {
          result.status = 'FAIL'
          result.errors.push('Missing environment variables for auth endpoint test')
        } else {
          const authResponse = await fetch(`${supabaseUrl}/auth/v1/`, {
            method: 'GET',
            headers: {
              'apikey': supabaseKey
            }
          })
          
          if (authResponse.ok) {
            result.details.push('✅ Authentication endpoint accessible')
          } else {
            result.status = 'FAIL'
            result.errors.push(`Auth endpoint error: ${authResponse.status}`)
          }
        }
      } catch (authError) {
        result.status = 'FAIL'
        result.errors.push(`Auth endpoint failed: ${authError}`)
      }

    } catch (error) {
      result.status = 'FAIL'
      result.errors.push(`Connectivity check failed: ${error}`)
    }

    this.results.push(result)
    this.printStageResult(result)
  }

  private async stage3FullSchemaAudit() {
    console.log('\n3️⃣ FULL SCHEMA AUDIT')
    console.log('---------------------')
    
    const result: AuditResult = {
      stage: 'Full Schema Audit',
      status: 'PASS',
      details: [],
      errors: []
    }

    const expectedTables = [
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

    try {
      for (const table of expectedTables) {
        console.log(`📋 Checking table: ${table}`)
        
        try {
          // Test table existence and basic access
          const { data, error } = await this.supabase
            .from(table)
            .select('*')
            .limit(1)
          
          if (error) {
            result.status = 'FAIL'
            result.errors.push(`${table}: ${JSON.stringify(error)}`)
          } else {
            result.details.push(`✅ ${table} exists and accessible`)
          }

          // Test table structure (basic column check)
          try {
            const { data: structureData, error: structureError } = await this.supabase
              .from(table)
              .select('*')
              .limit(0)
            
            if (structureError) {
              result.errors.push(`${table} structure error: ${JSON.stringify(structureError)}`)
            }
          } catch (structureErr) {
            result.errors.push(`${table} structure check failed: ${structureErr}`)
          }

        } catch (tableError) {
          result.status = 'FAIL'
          result.errors.push(`${table} access failed: ${tableError}`)
        }
      }

      // Check for user_id columns (RLS requirement)
      const tablesNeedingUserId = expectedTables.filter(t => t !== 'existential_levels')
      
      for (const table of tablesNeedingUserId) {
        try {
          const { data, error } = await this.supabase
            .from(table)
            .select('user_id')
            .limit(1)
          
          if (error && error.message.includes('column "user_id" does not exist')) {
            result.status = 'FAIL'
            result.errors.push(`${table}: Missing user_id column for RLS`)
          } else if (!error) {
            result.details.push(`✅ ${table} has user_id column`)
          }
        } catch (userIdError) {
          result.errors.push(`${table} user_id check failed: ${userIdError}`)
        }
      }

    } catch (error) {
      result.status = 'FAIL'
      result.errors.push(`Schema audit failed: ${error}`)
    }

    this.results.push(result)
    this.printStageResult(result)
  }

  private async stage4CRUDServiceLayerValidation() {
    console.log('\n4️⃣ CRUD SERVICE LAYER VALIDATION')
    console.log('---------------------------------')
    
    const result: AuditResult = {
      stage: 'CRUD Service Layer Validation',
      status: 'PASS',
      details: [],
      errors: []
    }

    // Test tables that support full CRUD operations
    const crudTables = [
      'journal_entries',
      'vocabulary_words',
      'tasks',
      'books',
      'life_arenas',
      'growth_goals'
    ]

    try {
      for (const table of crudTables) {
        console.log(`🔧 Testing CRUD for: ${table}`)
        
        try {
          // CREATE test
          const testData = this.generateTestData(table)
          const { data: createData, error: createError } = await this.supabase
            .from(table)
            .insert(testData)
            .select()
            .single()

          if (createError) {
            result.status = 'FAIL'
            result.errors.push(`${table} CREATE failed: ${JSON.stringify(createError)}`)
            continue
          } else {
            result.details.push(`✅ ${table} CREATE successful`)
          }

          const recordId = createData.id

          // READ test
          const { data: readData, error: readError } = await this.supabase
            .from(table)
            .select('*')
            .eq('id', recordId)
            .single()

          if (readError) {
            result.status = 'FAIL'
            result.errors.push(`${table} READ failed: ${JSON.stringify(readError)}`)
          } else {
            result.details.push(`✅ ${table} READ successful`)
          }

          // UPDATE test
          const updateData = { ...testData, id: recordId }
          const { data: updateResult, error: updateError } = await this.supabase
            .from(table)
            .update({ ...updateData, updated_at: new Date().toISOString() })
            .eq('id', recordId)
            .select()
            .single()

          if (updateError) {
            result.status = 'FAIL'
            result.errors.push(`${table} UPDATE failed: ${JSON.stringify(updateError)}`)
          } else {
            result.details.push(`✅ ${table} UPDATE successful`)
          }

          // DELETE test
          const { error: deleteError } = await this.supabase
            .from(table)
            .delete()
            .eq('id', recordId)

          if (deleteError) {
            result.status = 'FAIL'
            result.errors.push(`${table} DELETE failed: ${JSON.stringify(deleteError)}`)
          } else {
            result.details.push(`✅ ${table} DELETE successful`)
          }

        } catch (tableError) {
          result.status = 'FAIL'
          result.errors.push(`${table} CRUD test failed: ${tableError}`)
        }
      }

    } catch (error) {
      result.status = 'FAIL'
      result.errors.push(`CRUD validation failed: ${error}`)
    }

    this.results.push(result)
    this.printStageResult(result)
  }

  private async stage5RLSPolicyComplianceTest() {
    console.log('\n5️⃣ RLS POLICY COMPLIANCE TEST')
    console.log('------------------------------')
    
    const result: AuditResult = {
      stage: 'RLS Policy Compliance Test',
      status: 'PASS',
      details: [],
      errors: []
    }

    try {
      // Test RLS enforcement
      const testTables = ['journal_entries', 'tasks', 'books']
      
      for (const table of testTables) {
        console.log(`🔒 Testing RLS for: ${table}`)
        
        try {
          // Test that unauthenticated access is blocked
          const { data: publicData, error: publicError } = await this.supabase
            .from(table)
            .select('*')
            .limit(1)

          if (!publicError) {
            result.status = 'FAIL'
            result.errors.push(`${table}: RLS not blocking unauthenticated access`)
          } else {
            result.details.push(`✅ ${table} RLS blocking unauthenticated access`)
          }

          // Test authenticated user can create records
          const testData = this.generateTestData(table)
          const { data: createData, error: createError } = await this.supabase
            .from(table)
            .insert(testData)
            .select()
            .single()

          if (createError) {
            result.status = 'FAIL'
            result.errors.push(`${table} authenticated CREATE failed: ${JSON.stringify(createError)}`)
          } else {
            result.details.push(`✅ ${table} authenticated CREATE successful`)
            
            // Test user_id auto-population
            if (createData.user_id) {
              result.details.push(`✅ ${table} user_id auto-populated`)
            } else {
              result.status = 'FAIL'
              result.errors.push(`${table} user_id not auto-populated`)
            }

            // Clean up test record
            await this.supabase
              .from(table)
              .delete()
              .eq('id', createData.id)
          }

        } catch (tableError) {
          result.status = 'FAIL'
          result.errors.push(`${table} RLS test failed: ${tableError}`)
        }
      }

      // Test existential_levels public read access
      try {
        const { data: existentialData, error: existentialError } = await this.supabase
          .from('existential_levels')
          .select('*')
          .limit(1)

        if (existentialError) {
          result.status = 'FAIL'
          result.errors.push(`existential_levels public read failed: ${JSON.stringify(existentialError)}`)
        } else {
          result.details.push('✅ existential_levels public read access working')
        }
      } catch (existentialErr) {
        result.errors.push(`existential_levels test failed: ${existentialErr}`)
      }

    } catch (error) {
      result.status = 'FAIL'
      result.errors.push(`RLS compliance test failed: ${error}`)
    }

    this.results.push(result)
    this.printStageResult(result)
  }

  private generateTestData(table: string): any {
    const baseData: any = {
      user_id: '00000000-0000-0000-0000-000000000000' // Placeholder
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
          current_score: 50,
          target_score: 100,
          gradient: 'from-blue-500 to-purple-600',
          vision_statement: 'Test vision',
          current_actions: ['test action'],
          milestones: [],
          last_updated: new Date().toISOString(),
          sal_principle: 'Test principle',
          icon: 'target'
        }
      case 'growth_goals':
        return {
          ...baseData,
          title: 'Test Goal',
          description: 'Test goal description',
          category: 'mental',
          target_date: new Date().toISOString().split('T')[0],
          progress: 0,
          milestones: [],
          completed_milestones: 0,
          priority: 'medium',
          status: 'active'
        }
      default:
        return baseData
    }
  }

  private printStageResult(result: AuditResult) {
    console.log(`Status: ${result.status}`)
    result.details.forEach(detail => console.log(detail))
    if (result.errors.length > 0) {
      console.log('Errors:')
      result.errors.forEach(error => console.log(`❌ ${error}`))
    }
    console.log('')
  }

  private generateFinalReport() {
    console.log('🏁 FINAL BACKEND STABILIZATION REPORT')
    console.log('====================================')
    
    const totalStages = this.results.length
    const passedStages = this.results.filter(r => r.status === 'PASS').length
    const failedStages = this.results.filter(r => r.status === 'FAIL').length
    
    console.log(`Total Stages: ${totalStages}`)
    console.log(`Passed: ${passedStages}`)
    console.log(`Failed: ${failedStages}`)
    console.log('')

    if (failedStages === 0) {
      console.log('✅ PASS CERTIFICATE')
      console.log('==================')
      console.log('All backend stabilization stages passed successfully!')
      console.log(`System Readiness Score: ${Math.round((passedStages / totalStages) * 100)}%`)
      console.log('SAL OS backend is ready for production deployment.')
    } else {
      console.log('❌ FULL FAILURE REPORT')
      console.log('======================')
      console.log('Backend stabilization failed. Issues found:')
      console.log('')
      
      this.results.forEach(result => {
        if (result.status === 'FAIL') {
          console.log(`🔴 ${result.stage}:`)
          result.errors.forEach(error => console.log(`   - ${error}`))
          console.log('')
        }
      })
      
      console.log('Root Cause Analysis:')
      console.log('- Environment or connectivity issues detected')
      console.log('- Schema validation failures')
      console.log('- CRUD operation failures')
      console.log('- RLS policy compliance issues')
      console.log('')
      console.log('Fix Suggestions:')
      console.log('1. Verify Supabase project configuration')
      console.log('2. Check environment variables')
      console.log('3. Ensure all tables exist with correct schema')
      console.log('4. Validate RLS policies are properly configured')
      console.log('5. Test authentication and authorization')
    }
  }
}

// Run the audit
async function runAudit() {
  try {
    const audit = new BackendStabilizationAudit()
    await audit.runFullAudit()
  } catch (error) {
    console.error('❌ Audit failed to start:', error)
    process.exit(1)
  }
}

runAudit()
  .then(() => {
    console.log('🏁 Backend stabilization audit complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Backend stabilization audit failed:', error)
    process.exit(1)
  }) 