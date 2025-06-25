-- SAL OS RLS Policies
-- Copy and paste this entire file into Supabase SQL Editor AFTER running the schema deployment
-- This enables Row Level Security and creates all necessary policies

-- Enable RLS on all tables
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_arenas ENABLE ROW LEVEL SECURITY;
ALTER TABLE existential_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE gravity_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gravity_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_connections ENABLE ROW LEVEL SECURITY;

-- Create admin role function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create user ownership function
CREATE OR REPLACE FUNCTION is_owner(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() = user_id OR is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Journal Entries RLS Policies
CREATE POLICY "Users can view their own journal entries" ON journal_entries
  FOR SELECT USING (is_owner(user_id));

CREATE POLICY "Users can insert their own journal entries" ON journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries" ON journal_entries
  FOR UPDATE USING (is_owner(user_id)) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries" ON journal_entries
  FOR DELETE USING (is_owner(user_id));

-- Vocabulary Words RLS Policies
CREATE POLICY "Users can view their own vocabulary words" ON vocabulary_words
  FOR SELECT USING (is_owner(user_id));

CREATE POLICY "Users can insert their own vocabulary words" ON vocabulary_words
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vocabulary words" ON vocabulary_words
  FOR UPDATE USING (is_owner(user_id)) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vocabulary words" ON vocabulary_words
  FOR DELETE USING (is_owner(user_id));

-- Study Sessions RLS Policies
CREATE POLICY "Users can view their own study sessions" ON study_sessions
  FOR SELECT USING (is_owner(user_id));

CREATE POLICY "Users can insert their own study sessions" ON study_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study sessions" ON study_sessions
  FOR UPDATE USING (is_owner(user_id)) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study sessions" ON study_sessions
  FOR DELETE USING (is_owner(user_id));

-- Tasks RLS Policies
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (is_owner(user_id));

CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (is_owner(user_id)) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (is_owner(user_id));

-- Books RLS Policies
CREATE POLICY "Users can view their own books" ON books
  FOR SELECT USING (is_owner(user_id));

CREATE POLICY "Users can insert their own books" ON books
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books" ON books
  FOR UPDATE USING (is_owner(user_id)) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books" ON books
  FOR DELETE USING (is_owner(user_id));

-- Chapters RLS Policies
CREATE POLICY "Users can view their own chapters" ON chapters
  FOR SELECT USING (is_owner(user_id));

CREATE POLICY "Users can insert their own chapters" ON chapters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chapters" ON chapters
  FOR UPDATE USING (is_owner(user_id)) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chapters" ON chapters
  FOR DELETE USING (is_owner(user_id));

-- Reading Progress RLS Policies
CREATE POLICY "Users can view their own reading progress" ON reading_progress
  FOR SELECT USING (is_owner(user_id));

CREATE POLICY "Users can insert their own reading progress" ON reading_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading progress" ON reading_progress
  FOR UPDATE USING (is_owner(user_id)) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading progress" ON reading_progress
  FOR DELETE USING (is_owner(user_id));

-- Life Arenas RLS Policies
CREATE POLICY "Users can view their own life arenas" ON life_arenas
  FOR SELECT USING (is_owner(user_id));

CREATE POLICY "Users can insert their own life arenas" ON life_arenas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own life arenas" ON life_arenas
  FOR UPDATE USING (is_owner(user_id)) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own life arenas" ON life_arenas
  FOR DELETE USING (is_owner(user_id));

-- Existential Levels RLS Policies (Read-only for all authenticated users)
CREATE POLICY "Authenticated users can view existential levels" ON existential_levels
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can modify existential levels" ON existential_levels
  FOR ALL USING (is_admin());

-- Gravity Categories RLS Policies
CREATE POLICY "Users can view their own gravity categories" ON gravity_categories
  FOR SELECT USING (is_owner(user_id));

CREATE POLICY "Users can insert their own gravity categories" ON gravity_categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gravity categories" ON gravity_categories
  FOR UPDATE USING (is_owner(user_id)) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own gravity categories" ON gravity_categories
  FOR DELETE USING (is_owner(user_id));

-- Gravity Items RLS Policies
CREATE POLICY "Users can view their own gravity items" ON gravity_items
  FOR SELECT USING (is_owner(user_id));

CREATE POLICY "Users can insert their own gravity items" ON gravity_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gravity items" ON gravity_items
  FOR UPDATE USING (is_owner(user_id)) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own gravity items" ON gravity_items
  FOR DELETE USING (is_owner(user_id));

-- Growth Goals RLS Policies
CREATE POLICY "Users can view their own growth goals" ON growth_goals
  FOR SELECT USING (is_owner(user_id));

CREATE POLICY "Users can insert their own growth goals" ON growth_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own growth goals" ON growth_goals
  FOR UPDATE USING (is_owner(user_id)) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own growth goals" ON growth_goals
  FOR DELETE USING (is_owner(user_id));

-- Weekly Reviews RLS Policies
CREATE POLICY "Users can view their own weekly reviews" ON weekly_reviews
  FOR SELECT USING (is_owner(user_id));

CREATE POLICY "Users can insert their own weekly reviews" ON weekly_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly reviews" ON weekly_reviews
  FOR UPDATE USING (is_owner(user_id)) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly reviews" ON weekly_reviews
  FOR DELETE USING (is_owner(user_id));

-- Journey Maps RLS Policies
CREATE POLICY "Users can view their own journey maps" ON journey_maps
  FOR SELECT USING (is_owner(user_id));

CREATE POLICY "Users can insert their own journey maps" ON journey_maps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journey maps" ON journey_maps
  FOR UPDATE USING (is_owner(user_id)) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journey maps" ON journey_maps
  FOR DELETE USING (is_owner(user_id));

-- Journey Nodes RLS Policies
CREATE POLICY "Users can view their own journey nodes" ON journey_nodes
  FOR SELECT USING (is_owner(user_id));

CREATE POLICY "Users can insert their own journey nodes" ON journey_nodes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journey nodes" ON journey_nodes
  FOR UPDATE USING (is_owner(user_id)) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journey nodes" ON journey_nodes
  FOR DELETE USING (is_owner(user_id));

-- Journey Connections RLS Policies
CREATE POLICY "Users can view their own journey connections" ON journey_connections
  FOR SELECT USING (is_owner(user_id));

CREATE POLICY "Users can insert their own journey connections" ON journey_connections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journey connections" ON journey_connections
  FOR UPDATE USING (is_owner(user_id)) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journey connections" ON journey_connections
  FOR DELETE USING (is_owner(user_id));

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated; 