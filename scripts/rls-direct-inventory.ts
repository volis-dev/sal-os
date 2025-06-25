import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

class RLSDirectInventory {
  private supabase: any

  constructor() {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async runDirectInventory() {
    console.log('🔒 SAL OS DIRECT RLS POLICY INVENTORY')
    console.log('=====================================')
    console.log(`URL: ${supabaseUrl}`)
    console.log(`Key: ${supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'undefined'}`)
    console.log('')

    await this.listAllTables()
    await this.inventoryRLSPolicies()
  }

  private async listAllTables() {
    console.log('1️⃣ ALL TABLES IN SAL OS DATABASE')
    console.log('=================================')
    
    try {
      // Use raw SQL to query system catalogs
      const { data: tables, error } = await this.supabase
        .rpc('sql', {
          query: `
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            ORDER BY tablename;
          `
        })

      if (error) {
        console.log(`❌ Error querying tables: ${error.message}`)
        return
      }

      console.log(`Found ${tables.length} tables:`)
      tables.forEach((table: any, index: number) => {
        console.log(`${index + 1}. ${table.tablename}`)
      })
      console.log('')

    } catch (error) {
      console.log(`❌ Failed to list tables: ${error}`)
    }
  }

  private async inventoryRLSPolicies() {
    console.log('2️⃣ RLS POLICY INVENTORY')
    console.log('========================')
    
    const salOSTables = [
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

    for (const tableName of salOSTables) {
      console.log(`\n📋 TABLE: ${tableName}`)
      console.log('='.repeat(50))
      
      await this.checkRLSEnabled(tableName)
      await this.listTablePolicies(tableName)
    }
  }

  private async checkRLSEnabled(tableName: string) {
    try {
      const { data, error } = await this.supabase
        .rpc('sql', {
          query: `
            SELECT relname, relrowsecurity 
            FROM pg_class 
            WHERE relname = '${tableName}' 
            AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
          `
        })

      if (error) {
        console.log(`❌ RLS Status: Error checking - ${error.message}`)
      } else if (data && data.length > 0) {
        const rlsEnabled = data[0].relrowsecurity
        console.log(`✅ RLS Status: ${rlsEnabled ? 'ENABLED' : 'DISABLED'}`)
      } else {
        console.log(`❌ RLS Status: Table not found`)
      }
    } catch (error) {
      console.log(`❌ RLS Status: Error - ${error}`)
    }
  }

  private async listTablePolicies(tableName: string) {
    const operations = ['SELECT', 'INSERT', 'UPDATE', 'DELETE']
    
    for (const operation of operations) {
      console.log(`\n  🔒 ${operation} Policies:`)
      console.log('  ' + '-'.repeat(30))
      
      try {
        const { data: policies, error } = await this.supabase
          .rpc('sql', {
            query: `
              SELECT 
                polname as policy_name,
                polpermissive as permissive,
                polcmd as command,
                pg_get_expr(polqual, polrelid) as using_condition,
                pg_get_expr(polwithcheck, polrelid) as with_check_condition
              FROM pg_policy 
              WHERE polrelid = (
                SELECT oid 
                FROM pg_class 
                WHERE relname = '${tableName}' 
                AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
              )
              AND polcmd = '${operation.charAt(0).toLowerCase()}'
              ORDER BY polname;
            `
          })

        if (error) {
          console.log(`    ❌ Error querying policies: ${error.message}`)
          console.log(`    📝 Status: MISSING (could not query)`)
        } else if (policies && policies.length > 0) {
          policies.forEach((policy: any, index: number) => {
            console.log(`    ✅ Policy ${index + 1}: ${policy.policy_name}`)
            console.log(`       Type: ${policy.permissive ? 'PERMISSIVE' : 'RESTRICTIVE'}`)
            console.log(`       Command: ${policy.command}`)
            console.log(`       USING: ${policy.using_condition || 'N/A'}`)
            console.log(`       WITH CHECK: ${policy.with_check_condition || 'N/A'}`)
          })
        } else {
          console.log(`    📝 Status: MISSING`)
        }

      } catch (error) {
        console.log(`    ❌ Error: ${error}`)
        console.log(`    📝 Status: MISSING (error occurred)`)
      }
    }
  }
}

// Run the direct inventory
async function runDirectInventory() {
  try {
    const inventory = new RLSDirectInventory()
    await inventory.runDirectInventory()
  } catch (error) {
    console.error('❌ Direct inventory failed to start:', error)
    process.exit(1)
  }
}

runDirectInventory()
  .then(() => {
    console.log('\n🏁 Direct RLS policy inventory complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Direct inventory failed:', error)
    process.exit(1)
  }) 