# SAL OS Database Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Deploy Database Schema
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `scripts/schema-deployment.sql`
4. Paste into the SQL Editor
5. Click **Run** to execute

### 2. Deploy RLS Policies
1. In the same SQL Editor (or new query)
2. Copy the entire contents of `scripts/rls-policies.sql`
3. Paste into the SQL Editor
4. Click **Run** to execute

### 3. Verify Deployment
1. Go to **Table Editor** in Supabase
2. Verify all 16 tables are created:
   - journal_entries
   - vocabulary_words
   - study_sessions
   - tasks
   - books
   - chapters
   - reading_progress
   - life_arenas
   - existential_levels
   - gravity_categories
   - gravity_items
   - growth_goals
   - weekly_reviews
   - journey_maps
   - journey_nodes
   - journey_connections

### 4. Run Validation
After deployment, run the comprehensive validation:
```bash
npx tsx scripts/comprehensive-backend-validation.ts
```

## 📋 What Gets Deployed

### Database Schema
- ✅ 16 core tables with proper structure
- ✅ All foreign keys and constraints
- ✅ Performance indexes
- ✅ Automatic timestamps (created_at, updated_at)
- ✅ User ownership triggers
- ✅ Default existential levels data

### Security (RLS)
- ✅ Row Level Security enabled on all tables
- ✅ User ownership policies
- ✅ Admin role support
- ✅ Public read access for existential_levels
- ✅ Proper authentication checks

### Automation
- ✅ Automatic user_id population on insert
- ✅ Automatic updated_at timestamp updates
- ✅ UUID generation for primary keys
- ✅ Data validation constraints

## 🔧 Troubleshooting

### Common Issues
1. **Permission Denied**: Ensure you're using the correct Supabase credentials
2. **Table Already Exists**: The schema uses `CREATE TABLE IF NOT EXISTS` - safe to run multiple times
3. **RLS Policy Errors**: Make sure to run RLS policies after schema deployment

### Validation Failures
If validation fails after deployment:
1. Check Supabase project settings
2. Verify environment variables
3. Ensure authentication is working
4. Check table permissions

## 🎯 Expected Results

After successful deployment and validation:
- ✅ All 7 validation stages should pass
- ✅ Production readiness score: 100%
- ✅ Full CRUD operations working
- ✅ RLS policies enforced
- ✅ TypeScript compliance verified

## 📞 Support

If you encounter issues:
1. Check the validation output for specific error messages
2. Verify your Supabase project configuration
3. Ensure all environment variables are set correctly
4. Run the validation script for detailed diagnostics 