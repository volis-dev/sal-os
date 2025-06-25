import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

interface AuditResult {
  component: string
  status: 'PASS' | 'FAIL' | 'WARNING'
  details: string[]
  errors: string[]
  warnings: string[]
}

class StabilizationAudit {
  private supabase: any
  private results: AuditResult[] = []

  constructor() {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async runFullAudit() {
    console.log('🔬 SAL OS FULL BACKEND STABILIZATION AUDIT')
    console.log('==========================================')
    console.log(`URL: ${supabaseUrl}`)
    console.log(`Key: ${supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'undefined'}`)
    console.log('')

    await this.stage1EnvironmentValidation()
    await this.stage2DNSConnectivityValidation()
    await this.stage3DatabaseSchemaValidation()
    await this.stage4RLSSecurityValidation()
    await this.stage5CRUDServiceLayerValidation()

    this.generateStabilizationReport()
  }

  private async stage1EnvironmentValidation() {
    console.log('1️⃣ ENVIRONMENT CONFIGURATION VALIDATION')
    console.log('=======================================')
    
    const result: AuditResult = {
      component: 'Environment Configuration',
      status: 'PASS',
      details: [],
      errors: [],
      warnings: []
    }

    // Validate URL format and content
    if (supabaseUrl === 'https://rrlahnmnyuinoymrfufl.supabase.co') {
      result.details.push('✅ NEXT_PUBLIC_SUPABASE_URL matches expected value')
    } else {
      result.status = 'FAIL'
      result.errors.push(`❌ NEXT_PUBLIC_SUPABASE_URL mismatch: ${supabaseUrl}`)
    }

    // Validate key format and content
    if (supabaseKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybGFobm1ueXVpbm95bXJmdWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3Njc1NDcsImV4cCI6MjA2NjM0MzU0N30.ANA2j2AI5xX8reaTAKWdkGgH3-UjRLWLdCvd-9ambG0') {
      result.details.push('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY matches expected value')
    } else {
      result.status = 'FAIL'
      result.errors.push(`❌ NEXT_PUBLIC_SUPABASE_ANON_KEY mismatch`)
    }

    this.results.push(result)
    this.printComponentResult(result)
  }

  private async stage2DNSConnectivityValidation() {
    console.log('\n2️⃣ DNS & CONNECTIVITY VALIDATION')
    console.log('==================================')
    
    const result: AuditResult = {
      component: 'DNS & Connectivity',
      status: 'PASS',
      details: [],
      errors: [],
      warnings: []
    }

    try {
      // Test basic Supabase connection
      const { data: sessionData, error: sessionError } = await this.supabase.auth.getSession()
      
      if (sessionError) {
        result.status = 'FAIL'
        result.errors.push(`❌ Basic Supabase connection failed: ${JSON.stringify(sessionError)}`)
      } else {
        result.details.push('✅ Basic Supabase connection successful')
      }

      // Test REST API connectivity
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'GET',
          headers: {
            'apikey': supabaseKey || '',
            'Authorization': `Bearer ${supabaseKey || ''}`
          }
        })
        
        if (response.ok) {
          result.details.push('✅ REST API connectivity confirmed')
        } else {
          result.status = 'FAIL'
          result.errors.push(`❌ REST API error: ${response.status} ${response.statusText}`)
        }
      } catch (httpError) {
        result.status = 'FAIL'
        result.errors.push(`❌ HTTP request failed: ${httpError}`)
      }

    } catch (error) {
      result.status = 'FAIL'
      result.errors.push(`Connectivity validation failed: ${error}`)
    }

    this.results.push(result)
    this.printComponentResult(result)
  }

  private async stage3DatabaseSchemaValidation() {
    console.log('\n3️⃣ FULL DATABASE SCHEMA VALIDATION')
    console.log('==================================')
    
    const result: AuditResult = {
      component: 'Database Schema',
      status: 'PASS',
      details: [],
      errors: [],
      warnings: []
    }

    const expectedTables = [
      'journal_entries', 'vocabulary_words', 'study_sessions', 'tasks',
      'books', 'chapters', 'reading_progress', 'life_arenas',
      'existential_levels', 'gravity_categories', 'gravity_items',
      'growth_goals', 'weekly_reviews', 'journey_maps',
      'journey_nodes', 'journey_connections'
    ]

    try {
      for (const table of expectedTables) {
        console.log(`📋 Validating table: ${table}`)
        
        try {
          const { data, error } = await this.supabase
            .from(table)
            .select('*')
            .limit(1)
          
          if (error && error.message.includes('relation') && error.message.includes('does not exist')) {
            result.status = 'FAIL'
            result.errors.push(`❌ Missing table: ${table}`)
          } else if (error) {
            result.status = 'FAIL'
            result.errors.push(`❌ ${table} access failed: ${JSON.stringify(error)}`)
          } else {
            result.details.push(`✅ Table exists: ${table}`)
          }
        } catch (tableError) {
          result.status = 'FAIL'
          result.errors.push(`❌ ${table} validation failed: ${tableError}`)
        }
      }
    } catch (error) {
      result.status = 'FAIL'
      result.errors.push(`Schema validation failed: ${error}`)
    }

    this.results.push(result)
    this.printComponentResult(result)
  }

  private async stage4RLSSecurityValidation() {
    console.log('\n4️⃣ RLS & SECURITY VALIDATION')
    console.log('=============================')
    
    const result: AuditResult = {
      component: 'RLS & Security',
      status: 'PASS',
      details: [],
      errors: [],
      warnings: []
    }

    try {
      const protectedTables = ['journal_entries', 'tasks', 'books', 'vocabulary_words']
      
      for (const table of protectedTables) {
        console.log(`🔒 Testing RLS for: ${table}`)
        
        try {
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
        } catch (tableError) {
          result.status = 'FAIL'
          result.errors.push(`❌ ${table} RLS test failed: ${tableError}`)
        }
      }
    } catch (error) {
      result.status = 'FAIL'
      result.errors.push(`RLS validation failed: ${error}`)
    }

    this.results.push(result)
    this.printComponentResult(result)
  }

  private async stage5CRUDServiceLayerValidation() {
    console.log('\n5️⃣ FULL CRUD SERVICE LAYER VALIDATION')
    console.log('======================================')
    
    const result: AuditResult = {
      component: 'CRUD Service Layer',
      status: 'PASS',
      details: [],
      errors: [],
      warnings: []
    }

    const serviceTables = ['journal_entries', 'vocabulary_words', 'tasks', 'books']

    try {
      for (const table of serviceTables) {
        console.log(`🔧 Testing CRUD for: ${table}`)
        
        try {
          const testData = this.generateTestData(table)
          const { data: createData, error: createError } = await this.supabase
            .from(table)
            .insert(testData)
            .select()
            .single()

          if (createError && createError.message.includes('relation') && createError.message.includes('does not exist')) {
            result.warnings.push(`⚠️ ${table}: Table not deployed yet`)
          } else if (createError && createError.message.includes('row-level security policy')) {
            result.details.push(`✅ ${table} CREATE blocked by RLS (expected)`)
          } else if (createError) {
            result.status = 'FAIL'
            result.errors.push(`❌ ${table} CREATE failed: ${JSON.stringify(createError)}`)
          } else {
            result.details.push(`✅ ${table} CREATE successful`)
            
            // Clean up
            await this.supabase
              .from(table)
              .delete()
              .eq('id', createData.id)
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
    this.printComponentResult(result)
  }

  private generateTestData(table: string): any {
    const baseData = { user_id: '00000000-0000-0000-0000-000000000000' }

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
      default:
        return baseData
    }
  }

  private printComponentResult(result: AuditResult) {
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

  private generateStabilizationReport() {
    console.log('🏁 SAL OS FULL BACKEND STABILIZATION AUDIT REPORT')
    console.log('================================================')
    
    const totalComponents = this.results.length
    const passedComponents = this.results.filter(r => r.status === 'PASS').length
    const failedComponents = this.results.filter(r => r.status === 'FAIL').length
    const totalWarnings = this.results.flatMap(r => r.warnings).length
    const totalErrors = this.results.flatMap(r => r.errors).length
    
    console.log(`Total Components: ${totalComponents}`)
    console.log(`Passed: ${passedComponents}`)
    console.log(`Failed: ${failedComponents}`)
    console.log(`Total Warnings: ${totalWarnings}`)
    console.log(`Total Errors: ${totalErrors}`)
    console.log('')

    // Component breakdown
    console.log('📊 COMPONENT BREAKDOWN')
    console.log('=====================')
    
    this.results.forEach(result => {
      const statusIcon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️'
      console.log(`${statusIcon} ${result.component}: ${result.status}`)
      
      if (result.errors.length > 0) {
        result.errors.forEach(error => console.log(`   ❌ ${error}`))
      }
      if (result.warnings.length > 0) {
        result.warnings.forEach(warning => console.log(`   ⚠️ ${warning}`))
      }
    })

    console.log('')

    // Root cause analysis
    if (failedComponents > 0) {
      console.log('🔍 ROOT CAUSE ANALYSIS')
      console.log('=====================')
      
      const schemaComponent = this.results.find(r => r.component === 'Database Schema')
      if (schemaComponent && schemaComponent.status === 'FAIL') {
        console.log('❌ Database Schema Issues:')
        console.log('   - Tables not deployed to Supabase')
        console.log('   - Missing schema components')
      }

      const rlsComponent = this.results.find(r => r.component === 'RLS & Security')
      if (rlsComponent && rlsComponent.status === 'FAIL') {
        console.log('❌ RLS Security Issues:')
        console.log('   - Row Level Security not enabled')
        console.log('   - Policies not configured')
      }

      console.log('')
    }

    // Actionable fixes
    if (failedComponents > 0) {
      console.log('🔧 IMMEDIATE ACTIONABLE FIXES')
      console.log('=============================')
      
      const schemaComponent = this.results.find(r => r.component === 'Database Schema')
      if (schemaComponent && schemaComponent.status === 'FAIL') {
        console.log('1️⃣ Deploy Database Schema:')
        console.log('   - Copy scripts/schema-deployment.sql to Supabase SQL Editor')
        console.log('   - Execute the complete schema')
      }

      const rlsComponent = this.results.find(r => r.component === 'RLS & Security')
      if (rlsComponent && rlsComponent.status === 'FAIL') {
        console.log('2️⃣ Deploy RLS Policies:')
        console.log('   - Copy scripts/rls-policies.sql to Supabase SQL Editor')
        console.log('   - Execute the RLS policies')
      }

      console.log('')
    }

    // Production readiness score
    const readinessScore = Math.round((passedComponents / totalComponents) * 100)
    console.log('🎯 PRODUCTION READINESS ASSESSMENT')
    console.log('==================================')
    console.log(`Production Readiness Score: ${readinessScore}%`)
    
    if (readinessScore === 100) {
      console.log('🏆 SAL OS backend is FULLY PRODUCTION READY!')
    } else if (readinessScore >= 80) {
      console.log('✅ SAL OS backend is mostly ready with minor issues')
    } else if (readinessScore >= 60) {
      console.log('⚠️ SAL OS backend needs significant work')
    } else {
      console.log('❌ SAL OS backend is NOT production ready')
    }

    console.log('')
    console.log('🏁 Full backend stabilization audit complete!')
  }
}

// Run the audit
async function runFullAudit() {
  try {
    const audit = new StabilizationAudit()
    await audit.runFullAudit()
  } catch (error) {
    console.error('❌ Full audit failed to start:', error)
    process.exit(1)
  }
}

runFullAudit()
  .then(() => {
    console.log('🏁 Full backend stabilization audit complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Full backend stabilization audit failed:', error)
    process.exit(1)
  }) 