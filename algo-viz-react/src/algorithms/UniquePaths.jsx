import { useState } from "react";
import { Grid } from "../constants";
import VisualizeBlock from "./VisualizeBlock";

export default function UniquePaths() {
  const grid = [
    [1, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 2, -1],
  ];

  const [matrix, setMatrix] = useState(
    grid.map((row) => {
      return row.map((item) => {
        return {
          id: crypto.randomUUID(),
          value: item,
          status:
            item === 1
              ? Grid.current
              : item === -1
              ? Grid.wall
              : Grid.notVisited,
        };
      });
    })
  );
  const [count, setCount] = useState(0);

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  let visited = [];
  let n_blocks = 0;

  async function traverse(i, j) {
    if (visited.some(([dx, dy]) => dx === i && dy === j)) return;

    const current_matrix = [...matrix];

    if (visited.length > 0) {
      const [dx, dy] = visited[visited.length - 1];
      current_matrix[dx][dy].status = Grid.visited;
    }
    current_matrix[i][j].status = Grid.current;
    setMatrix(current_matrix);
    await sleep(100);

    visited.push([i, j]);

    if (grid[i][j] === 2) {
      if (visited.length - 2 === n_blocks) {
        setCount((currentCount) => {
          return ++currentCount;
        });
        await sleep(500);
      }
      visited.pop();

      if (visited.length > 0) {
        const temp = visited[visited.length - 1];
        current_matrix[temp[0]][temp[1]].status = Grid.current;
        current_matrix[i][j].status = Grid.notVisited;
        setMatrix(current_matrix);
        await sleep(100);
      }
      return;
    }

    if (
      j !== grid[0].length - 1 &&
      grid[i][j + 1] !== -1 &&
      grid[i][j + 1] !== 1
    ) {
      await traverse(i, j + 1);
    }
    if (
      i !== grid.length - 1 &&
      grid[i + 1][j] !== -1 &&
      grid[i + 1][j] !== 1
    ) {
      await traverse(i + 1, j);
    }
    if (j !== 0 && grid[i][j - 1] !== -1 && grid[i][j - 1] !== 1) {
      await traverse(i, j - 1);
    }
    if (i !== 0 && grid[i - 1][j] !== -1 && grid[i - 1][j] !== 1) {
      await traverse(i - 1, j);
    }
    visited.pop();

    if (visited.length > 0) {
      const temp = visited[visited.length - 1];
      current_matrix[temp[0]][temp[1]].status = Grid.current;
      current_matrix[i][j].status = Grid.notVisited;
      setMatrix(current_matrix);
      await sleep(100);
    }
    return;
  }

  async function runAlgorithm() {
    setCount(0);
    let start_i = 0;
    let start_j = 0;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j] === 0) {
          n_blocks += 1;
        } else if (grid[i][j] == 1) {
          start_i = i;
          start_j = j;
        }
      }
    }
    await traverse(start_i, start_j);
  }

  return (
    <VisualizeBlock
      title="Unique Paths III"
      matrix={matrix}
      count={count}
      visualizeSection={
        <>
          <div className="viz-div">
            {matrix.map((row) => {
              return (
                <div key={crypto.randomUUID()} className="viz-row">
                  {row.map((item) => {
                    return (
                      <div key={item.id} className={`viz-block ${item.status}`}>
                        {item.value}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div>
            <div className="viz-results">
              <div className="viz-results-key">
                Unique Paths:&nbsp;&nbsp;{count}
              </div>
            </div>
          </div>
        </>
      }
      runAlgorithm={runAlgorithm}
      url="https://leetcode.com/problems/unique-paths-iii/"
      question="980. Unique Paths III (LeetCode)"
    />
  );
}
