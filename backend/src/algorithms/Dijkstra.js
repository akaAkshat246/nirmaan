/**
 * Dijkstra's Shortest Path Algorithm for City Waste Road Networks
 */

export class CityGraph {
  constructor(graphData) {
    this.nodes = new Map();
    this.adjacencyList = new Map();
    this.edgeMetadata = new Map();
    this.depotId = graphData?.depot?.id || 'DEPOT';

    if (graphData) {
      this._initGraph(graphData);
    }
  }

  _initGraph(graphData) {
    for (const node of graphData.nodes) {
      this.nodes.set(node.id, node);
      this.adjacencyList.set(node.id, []);
    }

    for (const edge of graphData.edges) {
      this.addEdge(edge.from, edge.to, edge.distance, edge);
    }
  }

  addEdge(u, v, weight, metadata = {}) {
    if (!this.adjacencyList.has(u)) this.adjacencyList.set(u, []);
    if (!this.adjacencyList.has(v)) this.adjacencyList.set(v, []);

    this.adjacencyList.get(u).push({ node: v, weight, ...metadata });
    this.adjacencyList.get(v).push({ node: u, weight, ...metadata }); // Undirected road network
  }

  /**
   * Runs Dijkstra's algorithm from startNode to all other reachable nodes.
   * Returns distances map and previous node pointers for path reconstruction.
   */
  dijkstra(startNodeId) {
    const distances = {};
    const previous = {};
    const visited = new Set();
    const unvisited = new Set();

    for (const [nodeId] of this.nodes) {
      distances[nodeId] = Infinity;
      previous[nodeId] = null;
      unvisited.add(nodeId);
    }

    distances[startNodeId] = 0;

    while (unvisited.size > 0) {
      // Find unvisited node with lowest distance
      let current = null;
      let minDistance = Infinity;

      for (const nodeId of unvisited) {
        if (distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          current = nodeId;
        }
      }

      if (current === null || distances[current] === Infinity) {
        break; // Remaining nodes are unreachable
      }

      unvisited.delete(current);
      visited.add(current);

      const neighbors = this.adjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        if (visited.has(neighbor.node)) continue;

        const newDist = distances[current] + neighbor.weight;
        if (newDist < distances[neighbor.node]) {
          distances[neighbor.node] = Number(newDist.toFixed(2));
          previous[neighbor.node] = current;
        }
      }
    }

    return { distances, previous };
  }

  /**
   * Reconstructs shortest path from startNode to targetNode
   */
  getShortestPath(startNodeId, targetNodeId) {
    const { distances, previous } = this.dijkstra(startNodeId);
    const path = [];
    let curr = targetNodeId;

    while (curr) {
      path.unshift(curr);
      curr = previous[curr];
    }

    if (path.length > 0 && path[0] !== startNodeId) {
      return { path: [], distance: Infinity, readablePath: [] }; // No path
    }

    const readablePath = path.map(id => this.nodes.get(id)?.name || id);

    return {
      path,
      distance: distances[targetNodeId],
      readablePath,
      start: startNodeId,
      destination: targetNodeId
    };
  }
}
