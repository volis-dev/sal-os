export interface Database {
  public: {
    Tables: {
      journal_entries: {
        Row: {
          id: string
          title: string
          content: string
          type: string
          date: string
          book_reference: string | null
          chapter_reference: string | null
          word_count: number
          tags: string[]
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          type: string
          date: string
          book_reference?: string | null
          chapter_reference?: string | null
          word_count?: number
          tags?: string[]
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          type?: string
          date?: string
          book_reference?: string | null
          chapter_reference?: string | null
          word_count?: number
          tags?: string[]
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      vocabulary_words: {
        Row: {
          id: string
          word: string
          part_of_speech: string
          definition: string
          etymology: string
          pronunciation: string | null
          example_sentences: string[]
          synonyms: string[]
          antonyms: string[]
          source: 'reading' | 'tasks' | 'manual' | 'daily'
          book_reference: string | null
          date_added: string
          last_reviewed: string
          review_count: number
          mastery_level: 'new' | 'learning' | 'familiar' | 'mastered'
          tags: string[]
          personal_notes: string | null
          next_review_date: string
          difficulty_rating: number
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          word: string
          part_of_speech: string
          definition: string
          etymology: string
          pronunciation?: string | null
          example_sentences?: string[]
          synonyms?: string[]
          antonyms?: string[]
          source: 'reading' | 'tasks' | 'manual' | 'daily'
          book_reference?: string | null
          date_added?: string
          last_reviewed?: string
          review_count?: number
          mastery_level?: 'new' | 'learning' | 'familiar' | 'mastered'
          tags?: string[]
          personal_notes?: string | null
          next_review_date?: string
          difficulty_rating?: number
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          word?: string
          part_of_speech?: string
          definition?: string
          etymology?: string
          pronunciation?: string | null
          example_sentences?: string[]
          synonyms?: string[]
          antonyms?: string[]
          source?: 'reading' | 'tasks' | 'manual' | 'daily'
          book_reference?: string | null
          date_added?: string
          last_reviewed?: string
          review_count?: number
          mastery_level?: 'new' | 'learning' | 'familiar' | 'mastered'
          tags?: string[]
          personal_notes?: string | null
          next_review_date?: string
          difficulty_rating?: number
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      study_sessions: {
        Row: {
          id: string
          date: string
          words_studied: string[]
          correct_answers: number
          total_questions: number
          duration: number
          mode: 'flashcards' | 'quiz' | 'review'
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          date?: string
          words_studied?: string[]
          correct_answers?: number
          total_questions?: number
          duration?: number
          mode: 'flashcards' | 'quiz' | 'review'
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          words_studied?: string[]
          correct_answers?: number
          total_questions?: number
          duration?: number
          mode?: 'flashcards' | 'quiz' | 'review'
          user_id?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: number
          title: string
          description: string | null
          book_section: string | null
          category: 'foundation' | 'knowledge' | 'action' | 'reflection' | 'service' | 'creation'
          status: 'not-started' | 'in-progress' | 'completed'
          started_date: string | null
          completed_date: string | null
          time_spent: number
          notes: string | null
          evidence_url: string | null
          related_journal_ids: string[]
          related_arena_ids: string[]
          estimated_minutes: number
          is_multi_part: boolean
          sub_tasks: string[]
          completed_sub_tasks: number
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          book_section?: string | null
          category: 'foundation' | 'knowledge' | 'action' | 'reflection' | 'service' | 'creation'
          status?: 'not-started' | 'in-progress' | 'completed'
          started_date?: string | null
          completed_date?: string | null
          time_spent?: number
          notes?: string | null
          evidence_url?: string | null
          related_journal_ids?: string[]
          related_arena_ids?: string[]
          estimated_minutes?: number
          is_multi_part?: boolean
          sub_tasks?: string[]
          completed_sub_tasks?: number
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          book_section?: string | null
          category?: 'foundation' | 'knowledge' | 'action' | 'reflection' | 'service' | 'creation'
          status?: 'not-started' | 'in-progress' | 'completed'
          started_date?: string | null
          completed_date?: string | null
          time_spent?: number
          notes?: string | null
          evidence_url?: string | null
          related_journal_ids?: string[]
          related_arena_ids?: string[]
          estimated_minutes?: number
          is_multi_part?: boolean
          sub_tasks?: string[]
          completed_sub_tasks?: number
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      books: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          total_chapters: number
          completed_chapters: number
          current_chapter: number
          last_read: string | null
          total_pages: number
          pages_read: number
          color: string
          description: string | null
          estimated_hours: number
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          total_chapters?: number
          completed_chapters?: number
          current_chapter?: number
          last_read?: string | null
          total_pages?: number
          pages_read?: number
          color?: string
          description?: string | null
          estimated_hours?: number
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          total_chapters?: number
          completed_chapters?: number
          current_chapter?: number
          last_read?: string | null
          total_pages?: number
          pages_read?: number
          color?: string
          description?: string | null
          estimated_hours?: number
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      chapters: {
        Row: {
          id: string
          book_id: string
          number: number
          title: string
          content: string | null
          estimated_minutes: number
          completed: boolean
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          number: number
          title: string
          content?: string | null
          estimated_minutes?: number
          completed?: boolean
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          number?: number
          title?: string
          content?: string | null
          estimated_minutes?: number
          completed?: boolean
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      reading_progress: {
        Row: {
          id: string
          book_id: string
          chapter_id: string
          position: number
          total_time: number
          last_read: string
          completed: boolean
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          chapter_id: string
          position?: number
          total_time?: number
          last_read?: string
          completed?: boolean
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          chapter_id?: string
          position?: number
          total_time?: number
          last_read?: string
          completed?: boolean
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      life_arenas: {
        Row: {
          id: string
          name: string
          description: string | null
          current_score: number
          target_score: number
          gradient: string
          vision_statement: string | null
          current_actions: string[]
          milestones: any
          last_updated: string
          sal_principle: string | null
          icon: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          current_score?: number
          target_score?: number
          gradient?: string
          vision_statement?: string | null
          current_actions?: string[]
          milestones?: any
          last_updated?: string
          sal_principle?: string | null
          icon?: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          current_score?: number
          target_score?: number
          gradient?: string
          vision_statement?: string | null
          current_actions?: string[]
          milestones?: any
          last_updated?: string
          sal_principle?: string | null
          icon?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      existential_levels: {
        Row: {
          level: number
          name: string
          description: string
          color: string
          requirements: string[]
          focus: string
          created_at: string
        }
        Insert: {
          level: number
          name: string
          description: string
          color: string
          requirements?: string[]
          focus: string
          created_at?: string
        }
        Update: {
          level?: number
          name?: string
          description?: string
          color?: string
          requirements?: string[]
          focus?: string
          created_at?: string
        }
      }
      gravity_categories: {
        Row: {
          id: string
          name: string
          icon: string
          color: string
          description: string | null
          examples: string[]
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          icon: string
          color: string
          description?: string | null
          examples?: string[]
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string
          color?: string
          description?: string | null
          examples?: string[]
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      gravity_items: {
        Row: {
          id: string
          category_id: string
          name: string
          description: string
          severity: number
          impact: string
          action_plan: string
          date_identified: string
          status: 'active' | 'improving' | 'resolved'
          last_reviewed: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          description: string
          severity: number
          impact: string
          action_plan: string
          date_identified?: string
          status?: 'active' | 'improving' | 'resolved'
          last_reviewed?: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          description?: string
          severity?: number
          impact?: string
          action_plan?: string
          date_identified?: string
          status?: 'active' | 'improving' | 'resolved'
          last_reviewed?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      growth_goals: {
        Row: {
          id: string
          title: string
          description: string
          category: 'spiritual' | 'mental' | 'physical' | 'social' | 'emotional' | 'financial' | 'moral' | 'constitutional'
          target_date: string
          progress: number
          milestones: string[]
          completed_milestones: number
          priority: 'low' | 'medium' | 'high'
          status: 'active' | 'completed' | 'paused'
          date_created: string
          last_updated: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: 'spiritual' | 'mental' | 'physical' | 'social' | 'emotional' | 'financial' | 'moral' | 'constitutional'
          target_date: string
          progress?: number
          milestones?: string[]
          completed_milestones?: number
          priority?: 'low' | 'medium' | 'high'
          status?: 'active' | 'completed' | 'paused'
          date_created?: string
          last_updated?: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: 'spiritual' | 'mental' | 'physical' | 'social' | 'emotional' | 'financial' | 'moral' | 'constitutional'
          target_date?: string
          progress?: number
          milestones?: string[]
          completed_milestones?: number
          priority?: 'low' | 'medium' | 'high'
          status?: 'active' | 'completed' | 'paused'
          date_created?: string
          last_updated?: string
          user_id?: string
          created_at?: string
        }
      }
      weekly_reviews: {
        Row: {
          id: string
          week_of: string
          overall_rating: number
          wins: string[]
          challenges: string[]
          lessons: string[]
          next_week_focus: string[]
          gravity_progress: any
          arena_progress: any
          date_created: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          week_of: string
          overall_rating: number
          wins?: string[]
          challenges?: string[]
          lessons?: string[]
          next_week_focus?: string[]
          gravity_progress?: any
          arena_progress?: any
          date_created?: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          week_of?: string
          overall_rating?: number
          wins?: string[]
          challenges?: string[]
          lessons?: string[]
          next_week_focus?: string[]
          gravity_progress?: any
          arena_progress?: any
          date_created?: string
          user_id?: string
          created_at?: string
        }
      }
      journey_maps: {
        Row: {
          id: string
          title: string
          description: string | null
          current_node_id: string | null
          completed_nodes: number
          total_nodes: number
          theme: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          current_node_id?: string | null
          completed_nodes?: number
          total_nodes?: number
          theme?: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          current_node_id?: string | null
          completed_nodes?: number
          total_nodes?: number
          theme?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      journey_nodes: {
        Row: {
          id: string
          journey_map_id: string
          title: string
          description: string | null
          type: 'milestone' | 'challenge' | 'achievement' | 'checkpoint'
          position_x: number
          position_y: number
          completed: boolean
          completion_date: string | null
          metadata: any
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          journey_map_id: string
          title: string
          description?: string | null
          type: 'milestone' | 'challenge' | 'achievement' | 'checkpoint'
          position_x?: number
          position_y?: number
          completed?: boolean
          completion_date?: string | null
          metadata?: any
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          journey_map_id?: string
          title?: string
          description?: string | null
          type?: 'milestone' | 'challenge' | 'achievement' | 'checkpoint'
          position_x?: number
          position_y?: number
          completed?: boolean
          completion_date?: string | null
          metadata?: any
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      journey_connections: {
        Row: {
          id: string
          journey_map_id: string
          source_node_id: string
          target_node_id: string
          type: 'linear' | 'conditional' | 'parallel'
          label: string | null
          metadata: any
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          journey_map_id: string
          source_node_id: string
          target_node_id: string
          type?: 'linear' | 'conditional' | 'parallel'
          label?: string | null
          metadata?: any
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          journey_map_id?: string
          source_node_id?: string
          target_node_id?: string
          type?: 'linear' | 'conditional' | 'parallel'
          label?: string | null
          metadata?: any
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 