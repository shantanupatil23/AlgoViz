import { useState } from "react";
import VisualizeBlock from "./VisualizeBlock";
import { Grid } from "../constants";

export default function ShortestPathToGetAllKeys() {
  const grid = ["@..aA", "..B#.", "....b"];

  const [matrix, setMatrix] = useState(
    grid.map((row) => {
      return row.split("").map((item) => {
        return {
          id: crypto.randomUUID(),
          value: item,
          status:
            item === "@"
              ? Grid.current
              : item === "."
              ? Grid.notVisited
              : item === "#"
              ? Grid.wall
              : Grid.notVisited,
        };
      });
    })
  );

  const [resultMatrix, setResultMatrix] = useState(
    grid.map((row) => {
      return row.split("").map((item) => {
        return {
          id: crypto.randomUUID(),
          value: item,
          status:
            item === "@"
              ? Grid.current
              : item === "."
              ? Grid.notVisited
              : item === "#"
              ? Grid.wall
              : Grid.notVisited,
        };
      });
    })
  );

  let total_keys = 0;

  let path = [];

  let key_fetched_ptr = [0];
  let key_fetched_value = [];
  let key_fetched_index = [];

  let key_found_in_paths = [];

  let min_path = null;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function traverse(i, j) {
    if (grid[i][j] === "#") return;

    const current_matrix = [...matrix];

    if (path.length > 0) {
      const [dx, dy] = path[path.length - 1];
      current_matrix[dx][dy].status = Grid.visited;
    }
    current_matrix[i][j].status = Grid.current;
    setMatrix(current_matrix);
    await sleep(100);

    path.push([i, j]);

    const currentChar = grid[i][j];
    if (!["@", "#", "."].includes(currentChar)) {
      if (currentChar === currentChar.toLowerCase()) {
        if (
          !key_fetched_value.includes(grid[i][j]) &&
          !key_found_in_paths.includes(path)
        ) {
          key_found_in_paths.push(...path);
          key_fetched_ptr.push(path.length - 1);
          key_fetched_value.push(grid[i][j]);
          key_fetched_index.push([i, j]);
          if (
            key_fetched_value.length === total_keys &&
            (min_path === null || min_path > path.length)
          ) {
            min_path = path.length;
            setResultMatrix(JSON.parse(JSON.stringify(matrix)));
          }

          if (
            grid[0].length != j + 1 &&
            !path
              .slice(key_fetched_ptr[-1])
              .some(([dx, dy]) => dx === i && dy === j + 1)
          ) {
            await traverse(i, j + 1);
          }
          if (
            grid.length != i + 1 &&
            !path
              .slice(key_fetched_ptr[-1])
              .some(([dx, dy]) => dx === i + 1 && dy === j)
          ) {
            await traverse(i + 1, j);
          }
          if (
            j != 0 &&
            !path
              .slice(key_fetched_ptr[-1])
              .some(([dx, dy]) => dx === i && dy === j - 1)
          ) {
            await traverse(i, j - 1);
          }
          if (
            i != 0 &&
            !path
              .slice(key_fetched_ptr[-1])
              .some(([dx, dy]) => dx === i - 1 && dy === j)
          ) {
            await traverse(i - 1, j);
          }
        }
      } else {
        const temp = grid[i][j].toLowerCase();
        if (!key_fetched_value.includes(temp)) {
          path.pop();
          const [dx, dy] = path[path.length - 1];
          current_matrix[dx][dy].status = Grid.current;
          current_matrix[i][j].status = Grid.notVisited;
          setMatrix(current_matrix);
          await sleep(100);
          return;
        }
      }
    }

    if (
      grid[0].length != j + 1 &&
      !path
        .slice(key_fetched_ptr[-1])
        .some(([dx, dy]) => dx === i && dy === j + 1)
    ) {
      await traverse(i, j + 1);
    }
    if (
      grid.length != i + 1 &&
      !path
        .slice(key_fetched_ptr[-1])
        .some(([dx, dy]) => dx === i + 1 && dy === j)
    ) {
      await traverse(i + 1, j);
    }
    if (
      j != 0 &&
      !path
        .slice(key_fetched_ptr[-1])
        .some(([dx, dy]) => dx === i && dy === j - 1)
    ) {
      await traverse(i, j - 1);
    }
    if (
      i != 0 &&
      !path
        .slice(key_fetched_ptr[-1])
        .some(([dx, dy]) => dx === i - 1 && dy === j)
    ) {
      await traverse(i - 1, j);
    }

    const temp = path[path.length - 1];
    const key_index = key_fetched_index.findIndex((item) => item === temp);

    if (path.indexOf(temp) !== -1 && key_index !== -1) {
      key_fetched_index.splice(key_index, 1);
      key_fetched_value.splice(grid[temp[0]][temp[1]], 1);
      key_fetched_ptr.length === 1
        ? (key_fetched_ptr = [0])
        : key_fetched_ptr.pop();
    }

    path.pop();
    if (path.length > 0) {
      const temp = path[path.length - 1];
      current_matrix[temp[0]][temp[1]].status = Grid.current;
      current_matrix[i][j].status = Grid.notVisited;
      setMatrix(current_matrix);
      await sleep(100);
    }
    return;
  }

  async function runAlgorithm() {
    let si = 0;
    let sj = 0;

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].split("").length; j++) {
        const cell = grid[i][j];
        if (cell === "@") {
          si = i;
          sj = j;
        } else if (/[a-z]/.test(cell)) {
          total_keys++;
        }
      }
    }

    await traverse(si, sj);
    return;
  }

  return (
    <VisualizeBlock
      title="Shortest Path to Get All Keys"
      matrix={matrix}
      resultMatrix={resultMatrix}
      visualizeSection={
        <>
          {[
            { id: crypto.randomUUID(), data: matrix, comment: "Input" },
            { id: crypto.randomUUID(), data: resultMatrix, comment: "Output" },
          ].map((item) => {
            return (
              <div key={item.id} className="viz-div">
                {item.data.map((row) => {
                  return (
                    <div key={crypto.randomUUID()} className="viz-row">
                      {row.map((item) => {
                        return (
                          <div
                            key={item.id}
                            className={`viz-block ${item.status}`}
                          >
                            {item.value}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
                <p>{item.comment}</p>
              </div>
            );
          })}
        </>
      }
      runAlgorithm={runAlgorithm}
      url="https://leetcode.com/problems/shortest-path-to-get-all-keys/"
      question="864. Shortest Path to Get All Keys (LeetCode)"
    />
  );
}
