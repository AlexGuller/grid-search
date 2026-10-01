class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(node, priority) {
    this.heap.push({ node, priority });
    this.bubbleUp();
  }

  pop() {
    if (this.heap.length === 1) {
      return this.heap.pop();
    }

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();

    this.bubbleDown();

    return min;
  }

  // Restore min-heap order after inserting a node.
  bubbleUp() {
    let index = this.heap.length - 1;

    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);

      if (this.heap[parentIndex].priority <= this.heap[index].priority) {
        break;
      }

      [this.heap[parentIndex], this.heap[index]] = [
        this.heap[index],
        this.heap[parentIndex],
      ];

      index = parentIndex;
    }
  }

  // Restore min-heap order after removing the minimum.
  bubbleDown() {
    let index = 0;

    while (true) {
      const left = index * 2 + 1;
      const right = index * 2 + 2;

      let smallest = index;

      if (
        left < this.heap.length &&
        this.heap[left].priority < this.heap[smallest].priority
      ) {
        smallest = left;
      }

      if (
        right < this.heap.length &&
        this.heap[right].priority < this.heap[smallest].priority
      ) {
        smallest = right;
      }

      if (smallest === index) {
        break;
      }

      [this.heap[index], this.heap[smallest]] = [
        this.heap[smallest],
        this.heap[index],
      ];

      index = smallest;
    }
  }

  get length() {
    return this.heap.length;
  }
}

export function dijkstra(grid, startNode, endNode) {
  // Priority queue always explores the lowest-cost node next.
  const frontier = new MinHeap();

  const distances = new Map();
  const parents = new Map();
  const visited = new Set();
  const visitedNodesInOrder = [];

  const startKey = `${startNode.row}-${startNode.col}`;

  distances.set(startKey, 0);
  frontier.push(startNode, 0);

  while (frontier.length > 0) {
    const { node: current } = frontier.pop();

    const currentKey = `${current.row}-${current.col}`;

    if (visited.has(currentKey)) {
      continue;
    }

    visited.add(currentKey);
    visitedNodesInOrder.push(current);

    if (current.row === endNode.row && current.col === endNode.col) {
      return {
        visitedNodesInOrder,
        path: buildPath(current, parents),
      };
    }

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const [rowChange, colChange] of directions) {
      const newRow = current.row + rowChange;
      const newCol = current.col + colChange;

      if (
        newRow < 0 ||
        newRow >= grid.length ||
        newCol < 0 ||
        newCol >= grid[0].length
      ) {
        continue;
      }

      const neighbor = grid[newRow][newCol];

      if (neighbor.isWall) {
        continue;
      }

      const neighborKey = `${neighbor.row}-${neighbor.col}`;
      const currentDistance = distances.get(currentKey);

      // Cost to reach this neighbor through the current node.
      const newDistance = currentDistance + neighbor.weight;

      const oldDistance = distances.get(neighborKey) ?? Infinity;

      // Keep the cheaper route if one is found.
      if (newDistance < oldDistance) {
        distances.set(neighborKey, newDistance);
        parents.set(neighborKey, current);
        frontier.push(neighbor, newDistance);
      }
    }
  }

  return {
    visitedNodesInOrder,
    path: [],
  };
}

function buildPath(endNode, parents) {
  const path = [];
  let current = endNode;

  // Follow parent links backward from end to start.
  while (current) {
    path.push(current);

    const key = `${current.row}-${current.col}`;
    current = parents.get(key);
  }

  path.reverse();

  return path;
}
