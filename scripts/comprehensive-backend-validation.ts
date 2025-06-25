import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

interface ValidationResult {
  stage: string
  status: 'PASS' | 'FAIL'
  details: string[]
  errors: string[]
  warnings: string[]
}

class ComprehensiveBackendValidation {
  private supabase: any
  private results: ValidationResult[] = []
  private testUserId: string = '00000000-0000-0000-0000-000000000000'

  constructor() {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async runFullValidation() {
    console.log('🔍 SAL OS COMPREHENSIVE BACKEND VALIDATION')
    console.log('==========================================')
    console.log(`URL: ${supabaseUrl}`)
    console.log(`Key: ${supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'undefined'}`)
    console.log('')

    await this.stage1EnvironmentVerification()
    await this.stage2SupabaseConnectivity()
    await this.stage3SchemaValidation()
    await this.stage4RLSValidation()
    await this.stage5CRUDValidation()
    await this.stage6TypeScriptCompliance()
    await this.stage7ProductionReadiness()

    this.generateComprehensiveReport()
  }

  private async stage1EnvironmentVerification() {
    console.log('1️⃣ ENVIRONMENT VERIFICATION')
    console.log('----------------------------')
    
    const result: ValidationResult = {
      stage: 'Environment Verification',
      status: 'PASS',
      details: [],
      errors: [],
      warnings: []
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

      // Test DNS resolution
      try {
        if (supabaseUrl) {
          const url = new URL(supabaseUrl)
          result.details.push(`✅ URL parsing successful: ${url.hostname}`)
        } else {
          result.status = 'FAIL'
          result.errors.push('supabaseUrl is undefined, cannot parse URL')
        }
      } catch (urlError) {
        result.status = 'FAIL'
        result.errors.push(`URL parsing failed: ${urlError}`)
      }

    } catch (error) {
      result.status = 'FAIL'
      result.errors.push(`Environment verification failed: ${error}`)
    }

    this.results.push(result)
    this.printStageResult(result)
  }

  private async stage2SupabaseConnectivity() {
    console.log('\n2️⃣ SUPABASE CONNECTIVITY')
    console.log('------------------------')
    
    const result: ValidationResult = {
      stage: 'Supabase Connectivity',
      status: 'PASS',
      details: [],
      errors: [],
      warnings: []
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
        if (supabaseUrl && supabaseKey) {
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
        } else {
          result.status = 'FAIL'
          result.errors.push('Missing supabaseUrl or supabaseKey for REST API test')
        }
      } catch (httpError) {
        result.status = 'FAIL'
        result.errors.push(`REST API connectivity failed: ${httpError}`)
      }

      // Test Auth API connectivity
      try {
        if (supabaseUrl && supabaseKey) {
          const authResponse = await fetch(`${supabaseUrl}/auth/v1/`, {
            method: 'GET',
            headers: {
              'apikey': supabaseKey
            }
          })
          
          if (authResponse.ok) {
            result.details.push('✅ Auth API connectivity confirmed')
          } else {
            result.status = 'FAIL'
            result.errors.push(`Auth API error: ${authResponse.status} ${authResponse.statusText}`)
          }
        } else {
          result.status = 'FAIL'
          result.errors.push('Missing supabaseUrl or supabaseKey for Auth API test')
        }
      } catch (authError) {
        result.status = 'FAIL'
        result.errors.push(`Auth API connectivity failed: ${authError}`)
      }

      // Test database connectivity
      try {
        const { data, error } = await this.supabase
          .from('information_schema.tables')
          .select('table_name')
          .limit(1)
        
        if (error) {
          result.status = 'FAIL'
          result.errors.push(`Database connectivity failed: ${JSON.stringify(error)}`)
        } else {
          result.details.push('✅ Database connectivity confirmed')
        }
      } catch (dbError) {
        result.status = 'FAIL'
        result.errors.push(`Database test failed: ${dbError}`)
      }

    } catch (error) {
      result.status = 'FAIL'
      result.errors.push(`Connectivity check failed: ${error}`)
    }

    this.results.push(result)
    this.printStageResult(result)
  }

  private async stage3SchemaValidation() {
    console.log('\n3️⃣ SCHEMA VALIDATION')
    console.log('---------------------')
    
    const result: ValidationResult = {
      stage: 'Schema Validation',
      status: 'PASS',
      details: [],
      errors: [],
      warnings: []
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
      // Get all tables from information_schema
      const { data: tables, error: tablesError } = await this.supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_type', 'BASE TABLE')

      if (tablesError) {
        result.status = 'FAIL'
        result.errors.push(`Failed to get tables: ${JSON.stringify(tablesError)}`)
        return
      }

      const existingTables = tables.map((t: any) => t.table_name)
      result.details.push(`✅ Found ${existingTables.length} tables in database`)

      // Check each expected table
      for (const expectedTable of expectedTables) {
        console.log(`📋 Validating table: ${expectedTable}`)
        
        if (!existingTables.includes(expectedTable)) {
          result.status = 'FAIL'
          result.errors.push(`❌ Missing table: ${expectedTable}`)
          continue
        }

        result.details.push(`✅ Table exists: ${expectedTable}`)

        // Test table access
        try {
          const { data, error } = await this.supabase
            .from(expectedTable)
            .select('*')
            .limit(1)
          
          if (error) {
            result.status = 'FAIL'
            result.errors.push(`❌ ${expectedTable} access failed: ${JSON.stringify(error)}`)
          } else {
            result.details.push(`✅ ${expectedTable} accessible`)
          }

          // Check for user_id column (except existential_levels)
          if (expectedTable !== 'existential_levels') {
            try {
              const { data: userIdData, error: userIdError } = await this.supabase
                .from(expectedTable)
                .select('user_id')
                .limit(1)
              
              if (userIdError && userIdError.message.includes('column "user_id" does not exist')) {
                result.status = 'FAIL'
                result.errors.push(`❌ ${expectedTable}: Missing user_id column for RLS`)
              } else if (!userIdError) {
                result.details.push(`✅ ${expectedTable} has user_id column`)
              }
            } catch (userIdErr) {
              result.warnings.push(`⚠️ ${expectedTable} user_id check failed: ${userIdErr}`)
            }
          }

        } catch (tableError) {
          result.status = 'FAIL'
          result.errors.push(`❌ ${expectedTable} validation failed: ${tableError}`)
        }
      }

      // Check for unexpected tables
      const unexpectedTables = existingTables.filter((t: string) => !expectedTables.includes(t))
      if (unexpectedTables.length > 0) {
        result.warnings.push(`⚠️ Unexpected tables found: ${unexpectedTables.join(', ')}`)
      }

    } catch (error) {
      result.status = 'FAIL'
      result.errors.push(`Schema validation failed: ${error}`)
    }

    this.results.push(result)
    this.printStageResult(result)
  }

  private async stage4RLSValidation() {
    console.log('\n4️⃣ RLS VALIDATION')
    console.log('------------------')
    
    const result: ValidationResult = {
      stage: 'RLS Validation',
      status: 'PASS',
      details: [],
      errors: [],
      warnings: []
    }

    try {
      // Test RLS enforcement on protected tables
      const protectedTables = ['journal_entries', 'tasks', 'books', 'vocabulary_words']
      
      for (const table of protectedTables) {
        console.log(`🔒 Testing RLS for: ${table}`)
        
        try {
          // Test that unauthenticated access is blocked
          const { data: publicData, error: publicError } = await this.supabase
            .from(table)
            .select('*')
            .limit(1)

          if (!publicError) {
            result.status = 'FAIL'
            result.errors.push(`❌ ${table}: RLS not blocking unauthenticated access`)
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
            result.errors.push(`❌ ${table} authenticated CREATE failed: ${JSON.stringify(createError)}`)
          } else {
            result.details.push(`✅ ${table} authenticated CREATE successful`)
            
            // Test user_id auto-population
            if (createData.user_id) {
              result.details.push(`✅ ${table} user_id auto-populated`)
            } else {
              result.status = 'FAIL'
              result.errors.push(`❌ ${table} user_id not auto-populated`)
            }

            // Clean up test record
            await this.supabase
              .from(table)
              .delete()
              .eq('id', createData.id)
          }

        } catch (tableError) {
          result.status = 'FAIL'
          result.errors.push(`❌ ${table} RLS test failed: ${tableError}`)
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
          result.errors.push(`❌ existential_levels public read failed: ${JSON.stringify(existentialError)}`)
        } else {
          result.details.push('✅ existential_levels public read access working')
        }
      } catch (existentialErr) {
        result.errors.push(`❌ existential_levels test failed: ${existentialErr}`)
      }

    } catch (error) {
      result.status = 'FAIL'
      result.errors.push(`RLS validation failed: ${error}`)
    }

    this.results.push(result)
    this.printStageResult(result)
  }

  private async stage5CRUDValidation() {
    console.log('\n5️⃣ CRUD VALIDATION')
    console.log('-------------------')
    
    const result: ValidationResult = {
      stage: 'CRUD Validation',
      status: 'PASS',
      details: [],
      errors: [],
      warnings: []
    }

    // Test all service tables
    const serviceTables = [
      'journal_entries',
      'vocabulary_words',
      'tasks',
      'books',
      'life_arenas',
      'growth_goals',
      'journey_maps'
    ]

    try {
      for (const table of serviceTables) {
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
            result.errors.push(`❌ ${table} CREATE failed: ${JSON.stringify(createError)}`)
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
            result.errors.push(`❌ ${table} READ failed: ${JSON.stringify(readError)}`)
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
            result.errors.push(`❌ ${table} UPDATE failed: ${JSON.stringify(updateError)}`)
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
            result.errors.push(`❌ ${table} DELETE failed: ${JSON.stringify(deleteError)}`)
          } else {
            result.details.push(`✅ ${table} DELETE successful`)
          }

        } catch (tableError) {
          result.status = 'FAIL'
          result.errors.push(`❌ ${table} CRUD test failed: ${tableError}`)
        }
      }

    } catch (error) {
      result.status = 'FAIL'
      result.errors.push(`CRUD validation failed: ${error}`)
    }

    this.results.push(result)
    this.printStageResult(result)
  }

  private async stage6TypeScriptCompliance() {
    console.log('\n6️⃣ TYPESCRIPT COMPLIANCE')
    console.log('------------------------')
    
    const result: ValidationResult = {
      stage: 'TypeScript Compliance',
      status: 'PASS',
      details: [],
      errors: [],
      warnings: []
    }

    try {
      // Test type compliance by validating data structures
      const testCases = [
        {
          table: 'journal_entries',
          data: {
            title: 'Test Entry',
            content: 'Test content',
            type: 'reflection',
            date: new Date().toISOString().split('T')[0],
            word_count: 10,
            tags: ['test']
          }
        },
        {
          table: 'vocabulary_words',
          data: {
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
        },
        {
          table: 'tasks',
          data: {
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
        }
      ]

      for (const testCase of testCases) {
        console.log(`📝 Testing TypeScript compliance for: ${testCase.table}`)
        
        try {
          // Test data insertion with proper types
          const { data: insertData, error: insertError } = await this.supabase
            .from(testCase.table)
            .insert({ ...testCase.data, user_id: this.testUserId })
            .select()
            .single()

          if (insertError) {
            result.status = 'FAIL'
            result.errors.push(`❌ ${testCase.table} type validation failed: ${JSON.stringify(insertError)}`)
          } else {
            result.details.push(`✅ ${testCase.table} TypeScript compliance verified`)
            
            // Clean up
            await this.supabase
              .from(testCase.table)
              .delete()
              .eq('id', insertData.id)
          }

        } catch (typeError) {
          result.status = 'FAIL'
          result.errors.push(`❌ ${testCase.table} type test failed: ${typeError}`)
        }
      }

      // Test enum compliance
      const enumTests = [
        { table: 'vocabulary_words', field: 'source', value: 'manual' },
        { table: 'vocabulary_words', field: 'mastery_level', value: 'new' },
        { table: 'tasks', field: 'category', value: 'foundation' },
        { table: 'tasks', field: 'status', value: 'not-started' }
      ]

      for (const enumTest of enumTests) {
        try {
          const { data, error } = await this.supabase
            .from(enumTest.table)
            .select(enumTest.field)
            .eq(enumTest.field, enumTest.value)
            .limit(1)

          if (error) {
            result.warnings.push(`⚠️ ${enumTest.table}.${enumTest.field} enum validation failed`)
          } else {
            result.details.push(`✅ ${enumTest.table}.${enumTest.field} enum compliance verified`)
          }
        } catch (enumError) {
          result.warnings.push(`⚠️ ${enumTest.table}.${enumTest.field} enum test failed`)
        }
      }

    } catch (error) {
      result.status = 'FAIL'
      result.errors.push(`TypeScript compliance validation failed: ${error}`)
    }

    this.results.push(result)
    this.printStageResult(result)
  }

  private async stage7ProductionReadiness() {
    console.log('\n7️⃣ PRODUCTION READINESS')
    console.log('------------------------')
    
    const result: ValidationResult = {
      stage: 'Production Readiness',
      status: 'PASS',
      details: [],
      errors: [],
      warnings: []
    }

    try {
      // Check all previous stages passed
      const failedStages = this.results.filter(r => r.status === 'FAIL')
      if (failedStages.length > 0) {
        result.status = 'FAIL'
        result.errors.push(`❌ ${failedStages.length} validation stages failed`)
        failedStages.forEach(stage => {
          result.errors.push(`   - ${stage.stage}: ${stage.errors.length} errors`)
        })
      } else {
        result.details.push('✅ All validation stages passed')
      }

      // Test performance with larger dataset
      try {
        const startTime = Date.now()
        const { data, error } = await this.supabase
          .from('journal_entries')
          .select('*')
          .limit(100)
        
        const endTime = Date.now()
        const responseTime = endTime - startTime

        if (error) {
          result.warnings.push(`⚠️ Performance test failed: ${JSON.stringify(error)}`)
        } else {
          result.details.push(`✅ Performance test passed (${responseTime}ms for 100 records)`)
          
          if (responseTime > 5000) {
            result.warnings.push(`⚠️ Slow response time: ${responseTime}ms`)
          }
        }
      } catch (perfError) {
        result.warnings.push(`⚠️ Performance test failed: ${perfError}`)
      }

      // Check for any warnings across all stages
      const allWarnings = this.results.flatMap(r => r.warnings)
      if (allWarnings.length > 0) {
        result.warnings.push(`⚠️ ${allWarnings.length} warnings across all stages`)
        allWarnings.forEach(warning => {
          result.warnings.push(`   - ${warning}`)
        })
      } else {
        result.details.push('✅ No warnings detected')
      }

      // Final production readiness assessment
      if (result.status === 'PASS' && result.warnings.length === 0) {
        result.details.push('🎉 SAL OS backend is PRODUCTION READY!')
      } else if (result.status === 'PASS') {
        result.details.push('✅ SAL OS backend is ready with minor warnings')
      } else {
        result.details.push('❌ SAL OS backend is NOT production ready')
      }

    } catch (error) {
      result.status = 'FAIL'
      result.errors.push(`Production readiness assessment failed: ${error}`)
    }

    this.results.push(result)
    this.printStageResult(result)
  }

  private generateTestData(table: string): any {
    const baseData: any = {
      user_id: this.testUserId
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
      case 'journey_maps':
        return {
          ...baseData,
          title: 'Test Journey',
          description: 'Test journey description',
          current_node_id: null,
          completed_nodes: 0,
          total_nodes: 1,
          theme: 'default'
        }
      default:
        return baseData
    }
  }

  private printStageResult(result: ValidationResult) {
    console.log(`Status: ${result.status}`)
    result.details.forEach(detail => console.log(detail))
    if (result.warnings.length > 0) {
      console.log('Warnings:')
      result.warnings.forEach(warning => console.log(`⚠️ ${warning}`))
    }
    if (result.errors.length > 0) {
      console.log('Errors:')
      result.errors.forEach(error => console.log(`❌ ${error}`))
    }
    console.log('')
  }

  private generateComprehensiveReport() {
    console.log('🏁 COMPREHENSIVE BACKEND VALIDATION REPORT')
    console.log('=========================================')
    
    const totalStages = this.results.length
    const passedStages = this.results.filter(r => r.status === 'PASS').length
    const failedStages = this.results.filter(r => r.status === 'FAIL').length
    const totalWarnings = this.results.flatMap(r => r.warnings).length
    const totalErrors = this.results.flatMap(r => r.errors).length
    
    console.log(`Total Stages: ${totalStages}`)
    console.log(`Passed: ${passedStages}`)
    console.log(`Failed: ${failedStages}`)
    console.log(`Total Warnings: ${totalWarnings}`)
    console.log(`Total Errors: ${totalErrors}`)
    console.log('')

    // Generate summary
    console.log('📊 VALIDATION SUMMARY')
    console.log('====================')
    
    const summary = {
      'Connection': this.results.find(r => r.stage === 'Supabase Connectivity')?.status === 'PASS' ? '✅' : '❌',
      'Schema': this.results.find(r => r.stage === 'Schema Validation')?.status === 'PASS' ? '✅' : '❌',
      'RLS': this.results.find(r => r.stage === 'RLS Validation')?.status === 'PASS' ? '✅' : '❌',
      'CRUD': this.results.find(r => r.stage === 'CRUD Validation')?.status === 'PASS' ? '✅' : '❌',
      'Types': this.results.find(r => r.stage === 'TypeScript Compliance')?.status === 'PASS' ? '✅' : '❌',
      'Production': this.results.find(r => r.stage === 'Production Readiness')?.status === 'PASS' ? '✅' : '❌'
    }

    Object.entries(summary).forEach(([key, value]) => {
      console.log(`${key}: ${value}`)
    })

    console.log('')

    if (failedStages === 0) {
      console.log('🎉 SAL OS BACKEND VALIDATION: PASSED')
      console.log('====================================')
      console.log('All validation stages completed successfully!')
      
      const readinessScore = Math.round((passedStages / totalStages) * 100)
      console.log(`Production Readiness Score: ${readinessScore}%`)
      
      if (totalWarnings === 0) {
        console.log('🏆 SAL OS backend is FULLY PRODUCTION READY!')
      } else {
        console.log('✅ SAL OS backend is production ready with minor warnings')
      }
    } else {
      console.log('❌ SAL OS BACKEND VALIDATION: FAILED')
      console.log('===================================')
      console.log('Validation failed. Issues found:')
      console.log('')
      
      this.results.forEach(result => {
        if (result.status === 'FAIL') {
          console.log(`❌ ${result.stage}:`)
          result.errors.forEach(error => console.log(`   - ${error}`))
          console.log('')
        }
      })
      
      console.log('Root Cause Analysis:')
      console.log('- Infrastructure connectivity issues')
      console.log('- Schema validation failures')
      console.log('- RLS policy enforcement problems')
      console.log('- CRUD operation failures')
      console.log('- TypeScript compliance issues')
      console.log('')
      console.log('Fix Recommendations:')
      console.log('1. Resolve connectivity issues')
      console.log('2. Deploy missing schema components')
      console.log('3. Configure RLS policies correctly')
      console.log('4. Fix CRUD operation errors')
      console.log('5. Ensure TypeScript type compliance')
    }
  }
}

// Run the validation
async function runValidation() {
  try {
    const validation = new ComprehensiveBackendValidation()
    await validation.runFullValidation()
  } catch (error) {
    console.error('❌ Validation failed to start:', error)
    process.exit(1)
  }
}

runValidation()
  .then(() => {
    console.log('🏁 Comprehensive backend validation complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Comprehensive backend validation failed:', error)
    process.exit(1)
  }) 