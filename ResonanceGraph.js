/**
 * ResonanceGraph - A JavaScript implementation for tracking concept resonance
 * Manages nodes (concepts) and weighted edges (connections) with feedback loops
 */
export class ResonanceGraph {
  constructor() {
    this.nodes = new Map(); // concept -> { id, label, vector, energy }
    this.edges = new Map(); // "sourceId:targetId" -> weight
    this.nextId = 0;
  }

  /**
   * Add a new concept to the graph
   * @param {string} label - Human-readable concept name
   * @param {Array<number>} vector - Semantic embedding vector
   * @returns {number} - Node ID
   */
  addConcept(label, vector = null) {
    const id = this.nextId++;
    this.nodes.set(id, {
      id,
      label,
      vector: vector || this._generateRandomVector(),
      energy: 1.0 // Initial activation energy
    });
    return id;
  }

  /**
   * Create or strengthen a connection between concepts
   * @param {number} sourceId - Source node ID
   * @param {number} targetId - Target node ID
   * @param {number} weight - Connection strength (default 1.0)
   */
  connect(sourceId, targetId, weight = 1.0) {
    if (!this.nodes.has(sourceId) || !this.nodes.has(targetId)) {
      throw new Error('Both nodes must exist in the graph');
    }

    const edgeKey = `${sourceId}:${targetId}`;
    const currentWeight = this.edges.get(edgeKey) || 0;
    this.edges.set(edgeKey, currentWeight + weight);
  }

  /**
   * Apply feedback to strengthen/weaken connections
   * @param {number} sourceId - Source concept
   * @param {number} targetId - Target concept
   * @param {number} feedback - Positive or negative feedback (-1 to 1)
   */
  feedback(sourceId, targetId, feedback = 0.1) {
    const edgeKey = `${sourceId}:${targetId}`;
    const currentWeight = this.edges.get(edgeKey) || 0;
    const newWeight = Math.max(0, currentWeight + feedback);
    
    if (newWeight === 0) {
      this.edges.delete(edgeKey);
    } else {
      this.edges.set(edgeKey, newWeight);
    }

    // Update node energy based on feedback
    const source = this.nodes.get(sourceId);
    const target = this.nodes.get(targetId);
    
    if (source) source.energy = Math.min(10, source.energy + feedback * 0.5);
    if (target) target.energy = Math.min(10, target.energy + feedback * 0.5);
  }

  /**
   * Calculate cosine similarity between two vectors
   * @param {Array<number>} vecA 
   * @param {Array<number>} vecB 
   * @returns {number} - Similarity score (0-1)
   */
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

    return magA && magB ? dotProduct / (magA * magB) : 0;
  }

  /**
   * Find the most resonant (similar) concept to a given vector
   * @param {Array<number>} queryVector 
   * @param {number} topK - Number of top results to return
   * @returns {Array} - [{id, label, similarity, energy}, ...]
   */
  findResonant(queryVector, topK = 5) {
    const results = [];

    for (const [id, node] of this.nodes) {
      const similarity = this.cosineSimilarity(queryVector, node.vector);
      results.push({
        id: node.id,
        label: node.label,
        similarity,
        energy: node.energy,
        resonance: similarity * node.energy // Combined score
      });
    }

    return results
      .sort((a, b) => b.resonance - a.resonance)
      .slice(0, topK);
  }

  /**
   * Get all neighbors of a concept
   * @param {number} nodeId 
   * @returns {Array} - [{targetId, weight}, ...]
   */
  getNeighbors(nodeId) {
    const neighbors = [];

    for (const [edgeKey, weight] of this.edges) {
      const [sourceId, targetId] = edgeKey.split(':').map(Number);
      
      if (sourceId === nodeId) {
        const target = this.nodes.get(targetId);
        if (target) {
          neighbors.push({
            id: targetId,
            label: target.label,
            weight,
            energy: target.energy
          });
        }
      }
    }

    return neighbors.sort((a, b) => b.weight - a.weight);
  }

  /**
   * Serialize graph to JSON
   * @returns {Object} - Serialized graph data
   */
  toJSON() {
    return {
      nodes: Array.from(this.nodes.entries()).map(([id, node]) => ({
        id: node.id,
        label: node.label,
        vector: node.vector,
        energy: node.energy
      })),
      edges: Array.from(this.edges.entries()).map(([key, weight]) => {
        const [sourceId, targetId] = key.split(':').map(Number);
        return { source: sourceId, target: targetId, weight };
      })
    };
  }

  /**
   * Load graph from JSON
   * @param {Object} data - Serialized graph data
   */
  fromJSON(data) {
    this.nodes.clear();
    this.edges.clear();

    // Restore nodes
    data.nodes.forEach(node => {
      this.nodes.set(node.id, {
        id: node.id,
        label: node.label,
        vector: node.vector,
        energy: node.energy
      });
      this.nextId = Math.max(this.nextId, node.id + 1);
    });

    // Restore edges
    data.edges.forEach(edge => {
      const edgeKey = `${edge.source}:${edge.target}`;
      this.edges.set(edgeKey, edge.weight);
    });
  }

  /**
   * Get graph statistics
   * @returns {Object} - {nodeCount, edgeCount, avgEnergy}
   */
  getStats() {
    const nodeCount = this.nodes.size;
    const edgeCount = this.edges.size;
    const totalEnergy = Array.from(this.nodes.values()).reduce((sum, n) => sum + n.energy, 0);
    const avgEnergy = nodeCount > 0 ? totalEnergy / nodeCount : 0;

    return { nodeCount, edgeCount, avgEnergy };
  }

  /**
   * Generate a random vector for testing (fallback)
   * @private
   */
  _generateRandomVector(dimensions = 384) {
    return Array.from({ length: dimensions }, () => Math.random() * 2 - 1);
  }

  /**
   * Decay all node energies over time (simulate forgetting)
   * @param {number} decayRate - Amount to decay (default 0.05)
   */
  decay(decayRate = 0.05) {
    for (const node of this.nodes.values()) {
      node.energy = Math.max(0.1, node.energy - decayRate);
    }
  }

  /**
   * Prune weak edges below a threshold
   * @param {number} threshold - Minimum weight to keep
   */
  prune(threshold = 0.1) {
    const toDelete = [];
    
    for (const [edgeKey, weight] of this.edges) {
      if (weight < threshold) {
        toDelete.push(edgeKey);
      }
    }

    toDelete.forEach(key => this.edges.delete(key));
  }
}

export default ResonanceGraph;
