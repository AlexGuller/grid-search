import "./App.css";
import { useState, useRef } from "react";
import { bfs } from "./algorithms/bfs";
import { dfs } from "./algorithms/dfs";
import { dijkstra } from "./algorithms/dijkstra";

function App() {
  const timeouts = useRef([]);
  const rows = 25;
  const cols = 25;

  const createGrid = () =>
    Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col) => ({
        row,
        col,
        isWall: false,
        isVisited: false,
        isPath: false,
        weight: 1,
        isStart: row === 2 && col === 2,
        isEnd: row === 22 && col === 22,
      })),
    );

  const [editMode, setEditMode] = useState("wall");

  const [grid, setGrid] = useState(createGrid);

  const [stats, setStats] = useState({
    algorithm: "---",
    time: "---",
    space: "---",
    frontier: "---",
    optimal: "---",
    description: "---",
  });

  const bfsStats = {
    algorithm: "Breadth-First Search",
    time: "O(V + E)",
    space: "O(V)",
    frontier: "FIFO Queue",
    optimal: "YES - shortest path",
    description: "Expands cells level by level outward from the start.",
  };

  const dfsStats = {
    algorithm: "Depth-First Search",
    time: "O(V + E)",
    space: "O(V)",
    frontier: "LIFO Stack (or recursion)",
    optimal: "NO - may be suboptimal",
    description:
      "Dives as deep as possible along one path before backtracking.",
  };

  const dijkstraStats = {
    algorithm: "Dijkstra's Algorithm(Manhattan)",
    time: "O((V + E) log V)",
    space: "O(V)",
    frontier: "Min-Priority Queue",
    optimal: "YES - cheapest path",
    description:
      "Expands nodes in order of lowest cumulative cost from the start.",
  };

  function handleCellClick(row, col) {
    const newGrid = grid.map((currentRow) =>
      currentRow.map((cell) => {
        if (cell.row === row && cell.col === col) {
          if (cell.isStart || cell.isEnd) {
            return cell;
          }

          if (editMode === "wall") {
            return {
              ...cell,
              isWall: !cell.isWall,
              weight: 1,
            };
          }

          if (editMode === "weight") {
            return {
              ...cell,
              isWall: false,
              weight: cell.weight === 1 ? 5 : 1,
            };
          }
        }

        return cell;
      }),
    );

    setGrid(newGrid);
  }
  function runAlgorithm(searchFunction, algorithmStats) {
    clearAnimations();

    const clearedGrid = clearSearch();

    const startNode = clearedGrid[2][2];
    const endNode = clearedGrid[22][22];

    const { visitedNodesInOrder, path } = searchFunction(
      clearedGrid,
      startNode,
      endNode,
    );

    setStats(algorithmStats);

    animateVisitedNodes(visitedNodesInOrder, path);
  }

  function animateVisitedNodes(visitedNodes, path) {
    visitedNodes.forEach((node, index) => {
      const timeout = setTimeout(() => {
        setGrid((currentGrid) =>
          currentGrid.map((row) =>
            row.map((cell) => {
              if (cell.row === node.row && cell.col === node.col) {
                return {
                  ...cell,
                  isVisited: true,
                };
              }
              return cell;
            }),
          ),
        );
      }, index * 8);
      timeouts.current.push(timeout);
    });
    const pathTimeout = setTimeout(() => {
      animatePath(path);
    }, visitedNodes.length * 8);
    timeouts.current.push(pathTimeout);
  }

  function animatePath(shortestPath) {
    shortestPath.forEach((node, index) => {
      const timeout = setTimeout(() => {
        setGrid((currentGrid) =>
          currentGrid.map((row) =>
            row.map((cell) => {
              if (cell.row === node.row && cell.col === node.col) {
                return { ...cell, isPath: true };
              }
              return cell;
            }),
          ),
        );
      }, index * 20);
      timeouts.current.push(timeout);
    });
  }

  function clearSearch() {
    const clearedGrid = grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        isVisited: false,
        isPath: false,
      })),
    );
    setGrid(clearedGrid);
    return clearedGrid;
  }

  function clearAnimations() {
    timeouts.current.forEach((timeout) => {
      clearTimeout(timeout);
    });
    timeouts.current = [];
  }

  function resetGrid() {
    clearAnimations();

    setGrid(createGrid());

    setStats({
      algorithm: "---",
      time: "---",
      space: "---",
      frontier: "---",
      optimal: "---",
      description: "---",
    });

    setEditMode("wall");
  }

  return (
    <div>
      <div className="main-content">
        <div className="left-panel">
          <div className="toolbar">
            <div className="toolbar-group">
              <span className="toolbar-label">Search</span>

              <button
                className={
                  stats.algorithm === bfsStats.algorithm
                    ? "tool-button active-algorithm"
                    : "tool-button"
                }
                onClick={() => runAlgorithm(bfs, bfsStats)}
              >
                BFS
              </button>

              <button
                className={
                  stats.algorithm === dfsStats.algorithm
                    ? "tool-button active-algorithm"
                    : "tool-button"
                }
                onClick={() => runAlgorithm(dfs, dfsStats)}
              >
                DFS
              </button>

              <button
                className={
                  stats.algorithm === dijkstraStats.algorithm
                    ? "tool-button active-algorithm"
                    : "tool-button"
                }
                onClick={() => runAlgorithm(dijkstra, dijkstraStats)}
              >
                Dijkstra
              </button>
            </div>

            <div className="toolbar-divider"></div>

            <div className="toolbar-group">
              <span className="toolbar-label">Draw</span>

              <button
                className={
                  editMode === "wall"
                    ? "tool-button active-edit"
                    : "tool-button"
                }
                onClick={() => setEditMode("wall")}
              >
                Wall
              </button>

              <button
                className={
                  editMode === "weight"
                    ? "tool-button active-edit"
                    : "tool-button"
                }
                onClick={() => setEditMode("weight")}
              >
                Weight
              </button>
              <button className="tool-button reset-button" onClick={resetGrid}>
                Reset
              </button>
            </div>
          </div>

          <div className="grid">
            {grid.map((row, rowIndex) => (
              <div className="row" key={rowIndex}>
                {row.map((cell, colIndex) => {
                  let className = "cell";

                  if (cell.isStart) {
                    className += " start";
                  } else if (cell.isEnd) {
                    className += " end";
                  } else if (cell.isWall) {
                    className += " wall";
                  } else if (cell.isPath) {
                    className += " path";
                  } else if (cell.isVisited) {
                    className += " visited";
                  } else if (cell.weight > 1) {
                    className += " weighted";
                  }
                  return (
                    <div
                      className={className}
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(cell.row, cell.col)}
                    >
                      {cell.weight > 1 && !cell.isStart && !cell.isEnd
                        ? cell.weight
                        : ""}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="stats">
          <h2>Grid World Search</h2>

          <div className="algorithm-name">{stats.algorithm}</div>

          <div className="stat-row">
            <span>Time</span>
            <span>{stats.time}</span>
          </div>

          <div className="stat-row">
            <span>Space</span>
            <span>{stats.space}</span>
          </div>

          <div className="stat-row">
            <span>Frontier</span>
            <span>{stats.frontier}</span>
          </div>

          <div className="stat-row">
            <span>Optimal</span>
            <span>{stats.optimal}</span>
          </div>
          <p className="algorithm-description">{stats.description}</p>
        </div>
      </div>
    </div>
  );
}
export default App;
