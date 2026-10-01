export function dfs(grid, startNode, endNode) {
  const stack = [startNode];
  const visited = new Set();
  const parents = new Map();
  const visitedNodesInOrder = [];

  while (stack.length > 0) {
    // DFS explores the most recently added node first.
    const current = stack.pop();
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
        newRow >= 0 &&
        newRow < grid.length &&
        newCol >= 0 &&
        newCol < grid[0].length
      ) {
        const neighbor = grid[newRow][newCol];
        const key = `${newRow}-${newCol}`;

        if (!neighbor.isWall && !visited.has(key)) {
          // Record how the node was first reached for path reconstruction.
          if (!parents.has(key)) {
            parents.set(key, current);
          }

          stack.push(neighbor);
        }
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
