import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

class RLSPolicyInventory {
  private supabase: any

  constructor() {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async runInventory() {
    console.log('🔒 SAL OS RLS POLICY INVENTORY DIAGNOSTIC')
    console.log('=========================================')
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
      const { data: tables, error } = await this.supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_type', 'BASE TABLE')
        .order('table_name')

      if (error) {
        console.log(`❌ Error querying tables: ${error.message}`)
        return
      }

      console.log(`Found ${tables.length} tables:`)
      tables.forEach((table: any, index: number) => {
        console.log(`${index + 1}. ${table.table_name}`)
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
        .rpc('check_rls_enabled', { table_name: tableName })

      if (error) {
        // Fallback to direct query
        const { data: rlsData, error: rlsError } = await this.supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .eq('table_name', tableName)
          .single()

        if (rlsError) {
          console.log(`❌ RLS Status: Error checking - ${rlsError.message}`)
        } else {
          console.log(`⚠️ RLS Status: Could not determine (table exists: ${!!rlsData})`)
        }
      } else {
        console.log(`✅ RLS Status: ${data ? 'ENABLED' : 'DISABLED'}`)
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
        // Query PostgreSQL system catalogs for RLS policies
        const { data: policies, error } = await this.supabase
          .rpc('get_table_policies', { 
            target_table: tableName,
            target_operation: operation 
          })

        if (error) {
          // Fallback to information_schema query
          const { data: fallbackPolicies, error: fallbackError } = await this.supabase
            .from('information_schema.policies')
            .select('policy_name, permissive, roles, cmd, qual, with_check')
            .eq('table_schema', 'public')
            .eq('table_name', tableName)
            .eq('cmd', operation.toLowerCase())

          if (fallbackError) {
            console.log(`    ❌ Error querying policies: ${fallbackError.message}`)
            console.log(`    📝 Status: MISSING (could not query)`)
          } else if (fallbackPolicies && fallbackPolicies.length > 0) {
            fallbackPolicies.forEach((policy: any, index: number) => {
              console.log(`    ✅ Policy ${index + 1}: ${policy.policy_name}`)
              console.log(`       Type: ${policy.permissive ? 'PERMISSIVE' : 'RESTRICTIVE'}`)
              console.log(`       Roles: ${policy.roles || 'ALL'}`)
              console.log(`       USING: ${policy.qual || 'N/A'}`)
              console.log(`       WITH CHECK: ${policy.with_check || 'N/A'}`)
            })
          } else {
            console.log(`    📝 Status: MISSING`)
          }
        } else if (policies && policies.length > 0) {
          policies.forEach((policy: any, index: number) => {
            console.log(`    ✅ Policy ${index + 1}: ${policy.policy_name}`)
            console.log(`       Type: ${policy.permissive ? 'PERMISSIVE' : 'RESTRICTIVE'}`)
            console.log(`       USING: ${policy.qual || 'N/A'}`)
            console.log(`       WITH CHECK: ${policy.with_check || 'N/A'}`)
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

// Run the inventory
async function runInventory() {
  try {
    const inventory = new RLSPolicyInventory()
    await inventory.runInventory()
  } catch (error) {
    console.error('❌ Inventory failed to start:', error)
    process.exit(1)
  }
}

runInventory()
  .then(() => {
    console.log('\n🏁 RLS policy inventory complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Inventory failed:', error)
    process.exit(1)
  }) 