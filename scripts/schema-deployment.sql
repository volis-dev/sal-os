-- SAL OS Complete Database Schema
-- Copy and paste this entire file into Supabase SQL Editor
-- Generated from TypeScript interfaces and service layer analysis

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Journal Entries Table
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL,
    date DATE NOT NULL,
    book_reference TEXT,
    chapter_reference TEXT,
    word_count INTEGER NOT NULL DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vocabulary Words Table
CREATE TABLE IF NOT EXISTS vocabulary_words (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    word TEXT NOT NULL UNIQUE,
    part_of_speech TEXT NOT NULL,
    definition TEXT NOT NULL,
    etymology TEXT NOT NULL,
    pronunciation TEXT,
    example_sentences TEXT[] DEFAULT '{}',
    synonyms TEXT[] DEFAULT '{}',
    antonyms TEXT[] DEFAULT '{}',
    source TEXT NOT NULL CHECK (source IN ('reading', 'tasks', 'manual', 'daily')),
    book_reference TEXT,
    date_added DATE NOT NULL DEFAULT CURRENT_DATE,
    last_reviewed DATE NOT NULL DEFAULT CURRENT_DATE,
    review_count INTEGER NOT NULL DEFAULT 0,
    mastery_level TEXT NOT NULL DEFAULT 'new' CHECK (mastery_level IN ('new', 'learning', 'familiar', 'mastered')),
    tags TEXT[] DEFAULT '{}',
    personal_notes TEXT,
    next_review_date DATE NOT NULL DEFAULT CURRENT_DATE,
    difficulty_rating INTEGER NOT NULL DEFAULT 1 CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study Sessions Table
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    words_studied TEXT[] DEFAULT '{}',
    correct_answers INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0,
    duration INTEGER NOT NULL DEFAULT 0,
    mode TEXT NOT NULL CHECK (mode IN ('flashcards', 'quiz', 'review')),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    book_section TEXT,
    category TEXT NOT NULL CHECK (category IN ('foundation', 'knowledge', 'action', 'reflection', 'service', 'creation')),
    status TEXT NOT NULL DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed')),
    started_date DATE,
    completed_date DATE,
    time_spent INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    evidence_url TEXT,
    related_journal_ids TEXT[] DEFAULT '{}',
    related_arena_ids TEXT[] DEFAULT '{}',
    estimated_minutes INTEGER NOT NULL DEFAULT 0,
    is_multi_part BOOLEAN NOT NULL DEFAULT FALSE,
    sub_tasks TEXT[] DEFAULT '{}',
    completed_sub_tasks INTEGER NOT NULL DEFAULT 0,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Books Table
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT,
    total_chapters INTEGER NOT NULL DEFAULT 0,
    completed_chapters INTEGER NOT NULL DEFAULT 0,
    current_chapter INTEGER NOT NULL DEFAULT 1,
    last_read TIMESTAMP WITH TIME ZONE,
    total_pages INTEGER NOT NULL DEFAULT 0,
    pages_read INTEGER NOT NULL DEFAULT 0,
    color TEXT NOT NULL DEFAULT '#3B82F6',
    description TEXT,
    estimated_hours INTEGER NOT NULL DEFAULT 0,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chapters Table
CREATE TABLE IF NOT EXISTS chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    estimated_minutes INTEGER NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, number)
);

-- Reading Progress Table
CREATE TABLE IF NOT EXISTS reading_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    total_time INTEGER NOT NULL DEFAULT 0,
    last_read TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, chapter_id)
);

-- Life Arenas Table
CREATE TABLE IF NOT EXISTS life_arenas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    current_score INTEGER NOT NULL DEFAULT 0 CHECK (current_score >= 0 AND current_score <= 100),
    target_score INTEGER NOT NULL DEFAULT 100 CHECK (target_score >= 0 AND target_score <= 100),
    gradient TEXT NOT NULL DEFAULT 'from-blue-500 to-purple-600',
    vision_statement TEXT,
    current_actions TEXT[] DEFAULT '{}',
    milestones JSONB DEFAULT '[]',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sal_principle TEXT,
    icon TEXT NOT NULL DEFAULT 'target',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Existential Levels Table
CREATE TABLE IF NOT EXISTS existential_levels (
    level INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    color TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    focus TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gravity Categories Table
CREATE TABLE IF NOT EXISTS gravity_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    description TEXT,
    examples TEXT[] DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gravity Items Table
CREATE TABLE IF NOT EXISTS gravity_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES gravity_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 5),
    impact TEXT NOT NULL,
    action_plan TEXT NOT NULL,
    date_identified DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'improving', 'resolved')),
    last_reviewed DATE NOT NULL DEFAULT CURRENT_DATE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Growth Goals Table
CREATE TABLE IF NOT EXISTS growth_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('spiritual', 'mental', 'physical', 'social', 'emotional', 'financial', 'moral', 'constitutional')),
    target_date DATE NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    milestones TEXT[] DEFAULT '{}',
    completed_milestones INTEGER NOT NULL DEFAULT 0,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    date_created DATE NOT NULL DEFAULT CURRENT_DATE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly Reviews Table
CREATE TABLE IF NOT EXISTS weekly_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    week_of DATE NOT NULL,
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 10),
    wins TEXT[] DEFAULT '{}',
    challenges TEXT[] DEFAULT '{}',
    lessons TEXT[] DEFAULT '{}',
    next_week_focus TEXT[] DEFAULT '{}',
    gravity_progress JSONB DEFAULT '{}',
    arena_progress JSONB DEFAULT '{}',
    date_created DATE NOT NULL DEFAULT CURRENT_DATE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journey Maps Table
CREATE TABLE IF NOT EXISTS journey_maps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    current_node_id UUID,
    completed_nodes INTEGER NOT NULL DEFAULT 0,
    total_nodes INTEGER NOT NULL DEFAULT 0,
    theme TEXT NOT NULL DEFAULT 'default',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journey Nodes Table
CREATE TABLE IF NOT EXISTS journey_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_map_id UUID NOT NULL REFERENCES journey_maps(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('milestone', 'challenge', 'achievement', 'checkpoint')),
    position_x INTEGER NOT NULL DEFAULT 0,
    position_y INTEGER NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completion_date TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journey Connections Table
CREATE TABLE IF NOT EXISTS journey_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_map_id UUID NOT NULL REFERENCES journey_maps(id) ON DELETE CASCADE,
    source_node_id UUID NOT NULL REFERENCES journey_nodes(id) ON DELETE CASCADE,
    target_node_id UUID NOT NULL REFERENCES journey_nodes(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'linear' CHECK (type IN ('linear', 'conditional', 'parallel')),
    label TEXT,
    metadata JSONB DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON journal_entries(date);
CREATE INDEX IF NOT EXISTS idx_journal_entries_type ON journal_entries(type);
CREATE INDEX IF NOT EXISTS idx_journal_entries_tags ON journal_entries USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_vocabulary_words_user_id ON vocabulary_words(user_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_words_word ON vocabulary_words(word);
CREATE INDEX IF NOT EXISTS idx_vocabulary_words_mastery_level ON vocabulary_words(mastery_level);
CREATE INDEX IF NOT EXISTS idx_vocabulary_words_source ON vocabulary_words(source);
CREATE INDEX IF NOT EXISTS idx_vocabulary_words_next_review_date ON vocabulary_words(next_review_date);
CREATE INDEX IF NOT EXISTS idx_vocabulary_words_tags ON vocabulary_words USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_date ON study_sessions(date);
CREATE INDEX IF NOT EXISTS idx_study_sessions_mode ON study_sessions(mode);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_book_section ON tasks(book_section);
CREATE INDEX IF NOT EXISTS idx_tasks_related_journal_ids ON tasks USING GIN(related_journal_ids);
CREATE INDEX IF NOT EXISTS idx_tasks_related_arena_ids ON tasks USING GIN(related_arena_ids);

CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_last_read ON books(last_read);

CREATE INDEX IF NOT EXISTS idx_chapters_user_id ON chapters(user_id);
CREATE INDEX IF NOT EXISTS idx_chapters_book_id ON chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_chapters_number ON chapters(number);

CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_book_id ON reading_progress(book_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_chapter_id ON reading_progress(chapter_id);

CREATE INDEX IF NOT EXISTS idx_life_arenas_user_id ON life_arenas(user_id);
CREATE INDEX IF NOT EXISTS idx_life_arenas_name ON life_arenas(name);
CREATE INDEX IF NOT EXISTS idx_life_arenas_current_score ON life_arenas(current_score);

CREATE INDEX IF NOT EXISTS idx_gravity_items_user_id ON gravity_items(user_id);
CREATE INDEX IF NOT EXISTS idx_gravity_items_category_id ON gravity_items(category_id);
CREATE INDEX IF NOT EXISTS idx_gravity_items_status ON gravity_items(status);
CREATE INDEX IF NOT EXISTS idx_gravity_items_severity ON gravity_items(severity);

CREATE INDEX IF NOT EXISTS idx_growth_goals_user_id ON growth_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_growth_goals_category ON growth_goals(category);
CREATE INDEX IF NOT EXISTS idx_growth_goals_status ON growth_goals(status);
CREATE INDEX IF NOT EXISTS idx_growth_goals_priority ON growth_goals(priority);
CREATE INDEX IF NOT EXISTS idx_growth_goals_target_date ON growth_goals(target_date);

CREATE INDEX IF NOT EXISTS idx_weekly_reviews_user_id ON weekly_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_reviews_week_of ON weekly_reviews(week_of);

CREATE INDEX IF NOT EXISTS idx_journey_maps_user_id ON journey_maps(user_id);
CREATE INDEX IF NOT EXISTS idx_journey_nodes_user_id ON journey_nodes(user_id);
CREATE INDEX IF NOT EXISTS idx_journey_nodes_map_id ON journey_nodes(journey_map_id);
CREATE INDEX IF NOT EXISTS idx_journey_nodes_type ON journey_nodes(type);
CREATE INDEX IF NOT EXISTS idx_journey_nodes_completed ON journey_nodes(completed);

CREATE INDEX IF NOT EXISTS idx_journey_connections_user_id ON journey_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_journey_connections_map_id ON journey_connections(journey_map_id);
CREATE INDEX IF NOT EXISTS idx_journey_connections_source ON journey_connections(source_node_id);
CREATE INDEX IF NOT EXISTS idx_journey_connections_target ON journey_connections(target_node_id);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vocabulary_words_updated_at BEFORE UPDATE ON vocabulary_words FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reading_progress_updated_at BEFORE UPDATE ON reading_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_life_arenas_updated_at BEFORE UPDATE ON life_arenas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gravity_categories_updated_at BEFORE UPDATE ON gravity_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gravity_items_updated_at BEFORE UPDATE ON gravity_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journey_maps_updated_at BEFORE UPDATE ON journey_maps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journey_nodes_updated_at BEFORE UPDATE ON journey_nodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journey_connections_updated_at BEFORE UPDATE ON journey_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set user_id on insert
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to automatically set user_id
CREATE TRIGGER set_journal_entries_user_id BEFORE INSERT ON journal_entries FOR EACH ROW EXECUTE FUNCTION set_user_id();
CREATE TRIGGER set_vocabulary_words_user_id BEFORE INSERT ON vocabulary_words FOR EACH ROW EXECUTE FUNCTION set_user_id();
CREATE TRIGGER set_study_sessions_user_id BEFORE INSERT ON study_sessions FOR EACH ROW EXECUTE FUNCTION set_user_id();
CREATE TRIGGER set_tasks_user_id BEFORE INSERT ON tasks FOR EACH ROW EXECUTE FUNCTION set_user_id();
CREATE TRIGGER set_books_user_id BEFORE INSERT ON books FOR EACH ROW EXECUTE FUNCTION set_user_id();
CREATE TRIGGER set_chapters_user_id BEFORE INSERT ON chapters FOR EACH ROW EXECUTE FUNCTION set_user_id();
CREATE TRIGGER set_reading_progress_user_id BEFORE INSERT ON reading_progress FOR EACH ROW EXECUTE FUNCTION set_user_id();
CREATE TRIGGER set_life_arenas_user_id BEFORE INSERT ON life_arenas FOR EACH ROW EXECUTE FUNCTION set_user_id();
CREATE TRIGGER set_gravity_categories_user_id BEFORE INSERT ON gravity_categories FOR EACH ROW EXECUTE FUNCTION set_user_id();
CREATE TRIGGER set_gravity_items_user_id BEFORE INSERT ON gravity_items FOR EACH ROW EXECUTE FUNCTION set_user_id();
CREATE TRIGGER set_growth_goals_user_id BEFORE INSERT ON growth_goals FOR EACH ROW EXECUTE FUNCTION set_user_id();
CREATE TRIGGER set_weekly_reviews_user_id BEFORE INSERT ON weekly_reviews FOR EACH ROW EXECUTE FUNCTION set_user_id();
CREATE TRIGGER set_journey_maps_user_id BEFORE INSERT ON journey_maps FOR EACH ROW EXECUTE FUNCTION set_user_id();
CREATE TRIGGER set_journey_nodes_user_id BEFORE INSERT ON journey_nodes FOR EACH ROW EXECUTE FUNCTION set_user_id();
CREATE TRIGGER set_journey_connections_user_id BEFORE INSERT ON journey_connections FOR EACH ROW EXECUTE FUNCTION set_user_id();

-- Insert default existential levels
INSERT INTO existential_levels (level, name, description, color, requirements, focus) VALUES
(1, 'Foundation', 'Building core habits and systems', '#3B82F6', ARRAY['Establish daily routines', 'Create basic tracking systems'], 'Habit formation'),
(2, 'Awareness', 'Developing self-awareness and reflection', '#8B5CF6', ARRAY['Daily journaling', 'Weekly reviews', 'Mindfulness practice'], 'Self-reflection'),
(3, 'Growth', 'Active personal development', '#10B981', ARRAY['Goal setting', 'Skill development', 'Regular learning'], 'Continuous improvement'),
(4, 'Mastery', 'Deep expertise and leadership', '#F59E0B', ARRAY['Teaching others', 'Mentoring', 'Advanced skills'], 'Leadership'),
(5, 'Transcendence', 'Creating lasting impact', '#EF4444', ARRAY['Legacy building', 'Systemic change', 'Inspiration'], 'Impact creation')
ON CONFLICT (level) DO NOTHING; 