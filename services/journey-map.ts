import { supabase } from '@/lib/supabase'
import type { JourneyMap, JourneyNode, JourneyConnection, JourneyStats } from '@/types/journey-map'

// Journey Map CRUD Operations
export const journeyMapService = {
  // Create a new journey map
  async createJourneyMap(map: Omit<JourneyMap, 'id' | 'created_at' | 'updated_at'>): Promise<JourneyMap> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('journey_maps')
      .insert({
        title: map.title,
        description: map.description,
        current_node_id: map.currentNodeId,
        completed_nodes: map.completedNodes,
        total_nodes: map.totalNodes,
        theme: map.theme,
        user_id: session.user.id
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      currentNodeId: data.current_node_id,
      completedNodes: data.completed_nodes,
      totalNodes: data.total_nodes,
      theme: data.theme
    }
  },

  // Get journey map by ID
  async getJourneyMapById(id: string): Promise<JourneyMap | null> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('journey_maps')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      currentNodeId: data.current_node_id,
      completedNodes: data.completed_nodes,
      totalNodes: data.total_nodes,
      theme: data.theme
    }
  },

  // Get all journey maps
  async getAllJourneyMaps(): Promise<JourneyMap[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('journey_maps')
      .select('*')
      .eq('user_id', session.user.id)
      .order('title', { ascending: true })

    if (error) throw error

    return data.map((map: any) => ({
      id: map.id,
      title: map.title,
      description: map.description,
      currentNodeId: map.current_node_id,
      completedNodes: map.completed_nodes,
      totalNodes: map.total_nodes,
      theme: map.theme
    }))
  },

  // Update a journey map
  async updateJourneyMap(id: string, updates: Partial<Omit<JourneyMap, 'id' | 'created_at' | 'updated_at'>>): Promise<JourneyMap> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('journey_maps')
      .update({
        title: updates.title,
        description: updates.description,
        current_node_id: updates.currentNodeId,
        completed_nodes: updates.completedNodes,
        total_nodes: updates.totalNodes,
        theme: updates.theme
      })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      currentNodeId: data.current_node_id,
      completedNodes: data.completed_nodes,
      totalNodes: data.total_nodes,
      theme: data.theme
    }
  },

  // Delete a journey map
  async deleteJourneyMap(id: string): Promise<void> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { error } = await supabase
      .from('journey_maps')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) throw error
  },

  // Get journey statistics
  async getJourneyStats(): Promise<JourneyStats> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('journey_maps')
      .select('completed_nodes, total_nodes')
      .eq('user_id', session.user.id)

    if (error) throw error

    const totalMaps = data.length
    const totalNodes = data.reduce((sum: number, map: any) => sum + map.total_nodes, 0)
    const completedNodes = data.reduce((sum: number, map: any) => sum + map.completed_nodes, 0)
    const progressPercentage = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0

    return {
      totalMaps,
      totalNodes,
      completedNodes,
      progressPercentage
    }
  }
}

// Journey Nodes CRUD Operations
export const journeyNodesService = {
  // Create a new journey node
  async createJourneyNode(node: Omit<JourneyNode, 'id' | 'created_at' | 'updated_at'>): Promise<JourneyNode> {
    const { data, error } = await supabase
      .from('journey_nodes')
      .insert({
        journey_map_id: node.journeyMapId,
        title: node.title,
        description: node.description,
        type: node.type,
        position_x: node.positionX,
        position_y: node.positionY,
        completed: node.completed,
        completion_date: node.completionDate,
        metadata: node.metadata
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      journeyMapId: data.journey_map_id,
      title: data.title,
      description: data.description,
      type: data.type,
      positionX: data.position_x,
      positionY: data.position_y,
      completed: data.completed,
      completionDate: data.completion_date,
      metadata: data.metadata || {}
    }
  },

  // Get journey node by ID
  async getJourneyNodeById(id: string): Promise<JourneyNode | null> {
    const { data, error } = await supabase
      .from('journey_nodes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      journeyMapId: data.journey_map_id,
      title: data.title,
      description: data.description,
      type: data.type,
      positionX: data.position_x,
      positionY: data.position_y,
      completed: data.completed,
      completionDate: data.completion_date,
      metadata: data.metadata || {}
    }
  },

  // Get all nodes for a journey map
  async getJourneyNodesByMapId(mapId: string): Promise<JourneyNode[]> {
    const { data, error } = await supabase
      .from('journey_nodes')
      .select('*')
      .eq('journey_map_id', mapId)
      .order('created_at', { ascending: true })

    if (error) throw error

    return data.map((node: any) => ({
      id: node.id,
      journeyMapId: node.journey_map_id,
      title: node.title,
      description: node.description,
      type: node.type,
      positionX: node.position_x,
      positionY: node.position_y,
      completed: node.completed,
      completionDate: node.completion_date,
      metadata: node.metadata || {}
    }))
  },

  // Update a journey node
  async updateJourneyNode(id: string, updates: Partial<Omit<JourneyNode, 'id' | 'journeyMapId'>>): Promise<JourneyNode> {
    const { data, error } = await supabase
      .from('journey_nodes')
      .update({
        title: updates.title,
        description: updates.description,
        type: updates.type,
        position_x: updates.positionX,
        position_y: updates.positionY,
        completed: updates.completed,
        completion_date: updates.completionDate,
        metadata: updates.metadata
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      journeyMapId: data.journey_map_id,
      title: data.title,
      description: data.description,
      type: data.type,
      positionX: data.position_x,
      positionY: data.position_y,
      completed: data.completed,
      completionDate: data.completion_date,
      metadata: data.metadata || {}
    }
  },

  // Delete a journey node
  async deleteJourneyNode(id: string): Promise<void> {
    const { error } = await supabase
      .from('journey_nodes')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Mark node as completed
  async markNodeAsCompleted(id: string): Promise<JourneyNode> {
    const { data, error } = await supabase
      .from('journey_nodes')
      .update({
        completed: true,
        completion_date: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      journeyMapId: data.journey_map_id,
      title: data.title,
      description: data.description,
      type: data.type,
      positionX: data.position_x,
      positionY: data.position_y,
      completed: data.completed,
      completionDate: data.completion_date,
      metadata: data.metadata || {}
    }
  }
}

// Journey Connections CRUD Operations
export const journeyConnectionsService = {
  // Create a new journey connection
  async createJourneyConnection(connection: Omit<JourneyConnection, 'id' | 'created_at' | 'updated_at'>): Promise<JourneyConnection> {
    const { data, error } = await supabase
      .from('journey_connections')
      .insert({
        journey_map_id: connection.journeyMapId,
        source_node_id: connection.sourceNodeId,
        target_node_id: connection.targetNodeId,
        type: connection.type,
        label: connection.label,
        metadata: connection.metadata
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      journeyMapId: data.journey_map_id,
      sourceNodeId: data.source_node_id,
      targetNodeId: data.target_node_id,
      type: data.type,
      label: data.label,
      metadata: data.metadata || {}
    }
  },

  // Get journey connection by ID
  async getJourneyConnectionById(id: string): Promise<JourneyConnection | null> {
    const { data, error } = await supabase
      .from('journey_connections')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      journeyMapId: data.journey_map_id,
      sourceNodeId: data.source_node_id,
      targetNodeId: data.target_node_id,
      type: data.type,
      label: data.label,
      metadata: data.metadata || {}
    }
  },

  // Get all connections for a journey map
  async getJourneyConnectionsByMapId(mapId: string): Promise<JourneyConnection[]> {
    const { data, error } = await supabase
      .from('journey_connections')
      .select('*')
      .eq('journey_map_id', mapId)
      .order('created_at', { ascending: true })

    if (error) throw error

    return data.map((connection: any) => ({
      id: connection.id,
      journeyMapId: connection.journey_map_id,
      sourceNodeId: connection.source_node_id,
      targetNodeId: connection.target_node_id,
      type: connection.type,
      label: connection.label,
      metadata: connection.metadata || {}
    }))
  },

  // Update a journey connection
  async updateJourneyConnection(id: string, updates: Partial<Omit<JourneyConnection, 'id' | 'journeyMapId' | 'sourceNodeId' | 'targetNodeId'>>): Promise<JourneyConnection> {
    const { data, error } = await supabase
      .from('journey_connections')
      .update({
        type: updates.type,
        label: updates.label,
        metadata: updates.metadata
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      journeyMapId: data.journey_map_id,
      sourceNodeId: data.source_node_id,
      targetNodeId: data.target_node_id,
      type: data.type,
      label: data.label,
      metadata: data.metadata || {}
    }
  },

  // Delete a journey connection
  async deleteJourneyConnection(id: string): Promise<void> {
    const { error } = await supabase
      .from('journey_connections')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
} 