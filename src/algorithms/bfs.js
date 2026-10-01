export function bfs(grid, startNode, endNode) {
  const queue = [startNode];
  const visited = new Set();
  const parents = new Map();
  const visitedNodesInOrder = [];

  const startKey = `${startNode.row}-${startNode.col}`;
  visited.add(startKey);

  while (queue.length > 0) {
    // BFS explores nodes in FIFO order.
    const current = queue.shift();

    visitedNodesInOrder.push(current);

    if (current.row === endNode.row && current.col === endNode.col) {
      const path = buildPath(current, parents);
      return { visitedNodesInOrder, path };
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
        newRow >= 0 &&
        newRow < grid.length &&
        newCol >= 0 &&
        newCol < grid[0].length
      ) {
        const neighbor = grid[newRow][newCol];
        const key = `${newRow}-${newCol}`;

        if (!neighbor.isWall && !visited.has(key)) {
          visited.add(key);

          // Store the previous node so the final path can be rebuilt.
          parents.set(key, current);

          queue.push(neighbor);
        }
      }
    }
  }

  return { visitedNodesInOrder, path: [] };
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
