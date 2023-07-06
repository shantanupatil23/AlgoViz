import { useState } from "react";

export default function ShortestPathToGetAllKeys() {
  const Grid = {
    notVisited: "viz-block-not-visited",
    visited: "viz-block-visited",
    current: "viz-block-current",
    wall: "viz-block-wall",
  };

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

  let nkeys = 0;

  let path = [];

  let key_fetched_ptr = [0];
  let key_fetched_value = [];
  let key_fetched_index = [];

  let key_found_in_paths = [];

  let min_path = null;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function traverse(grid, i, j) {
    if (grid[i][j] === "#") {
      return;
    }

    let matrix_copy = [...matrix];
    if (path.length > 0) {
      const prev_path = path.slice(-1);
      matrix_copy[prev_path[0][0]][prev_path[0][1]].status = Grid.visited;
    }
    matrix_copy[i][j].status = Grid.current;
    setMatrix(matrix_copy);
    await sleep(100);

    path.push([i, j]);

    if (grid[i][j] !== "@" && grid[i][j] !== "#" && grid[i][j] !== ".") {
      if (grid[i][j] === grid[i][j].toLowerCase()) {
        if (
          !key_fetched_value.includes(grid[i][j]) &&
          !key_found_in_paths.includes(path)
        ) {
          key_found_in_paths.push(JSON.parse(JSON.stringify(path)));
          key_fetched_ptr.push(path.length - 1);
          key_fetched_value.push(grid[i][j]);
          key_fetched_index.push([i, j]);
          if (key_fetched_value.length === nkeys) {
            if (min_path !== null) {
              if (min_path > path.length) {
                min_path = path.length;
                setResultMatrix(JSON.parse(JSON.stringify(matrix)));
              }
            } else {
              min_path = path.length;
              setResultMatrix(JSON.parse(JSON.stringify(matrix)));
            }
          }
          if (
            grid[0].length != j + 1 &&
            !path
              .slice(key_fetched_ptr[-1])
              .some((subarray) => subarray[0] === i && subarray[1] === j + 1)
          ) {
            await traverse(grid, i, j + 1);
          }
          if (
            grid.length != i + 1 &&
            !path
              .slice(key_fetched_ptr[-1])
              .some((subarray) => subarray[0] === i + 1 && subarray[1] === j)
          ) {
            await traverse(grid, i + 1, j);
          }
          if (
            j != 0 &&
            !path
              .slice(key_fetched_ptr[-1])
              .some((subarray) => subarray[0] === i && subarray[1] === j - 1)
          ) {
            await traverse(grid, i, j - 1);
          }
          if (
            i != 0 &&
            !path
              .slice(key_fetched_ptr[-1])
              .some((subarray) => subarray[0] === i - 1 && subarray[1] === j)
          ) {
            await traverse(grid, i - 1, j);
          }
        }
      } else {
        const temp = grid[i][j].toLowerCase();
        if (!key_fetched_value.includes(temp)) {
          path.pop();
          let temp = path.slice(-1);
          temp = temp[0];
          let matrix_copy = [...matrix];
          matrix_copy[temp[0]][temp[1]].status = Grid.current;
          matrix_copy[i][j].status = Grid.notVisited;
          setMatrix(matrix_copy);
          await sleep(100);
          return;
        }
      }
    }
    if (
      grid[0].length != j + 1 &&
      !path
        .slice(key_fetched_ptr[-1])
        .some((subarray) => subarray[0] === i && subarray[1] === j + 1)
    ) {
      await traverse(grid, i, j + 1);
    }
    if (
      grid.length != i + 1 &&
      !path
        .slice(key_fetched_ptr[-1])
        .some((subarray) => subarray[0] === i + 1 && subarray[1] === j)
    ) {
      await traverse(grid, i + 1, j);
    }
    if (
      j != 0 &&
      !path
        .slice(key_fetched_ptr[-1])
        .some((subarray) => subarray[0] === i && subarray[1] === j - 1)
    ) {
      await traverse(grid, i, j - 1);
    }
    if (
      i != 0 &&
      !path
        .slice(key_fetched_ptr[-1])
        .some((subarray) => subarray[0] === i - 1 && subarray[1] === j)
    ) {
      await traverse(grid, i - 1, j);
    }

    let temp = path.slice(-1);
    temp = temp[0];

    const counter = {};

    path.forEach((ele) => {
      if (counter[ele]) {
        counter[ele] += 1;
      } else {
        counter[ele] = 1;
      }
    });
    if (
      counter[temp] === 1 &&
      key_fetched_index.some(
        (subarray) => subarray[0] === temp[0] && subarray[1] === temp[1]
      )
    ) {
      key_fetched_index.splice(key_fetched_index.indexOf(temp), 1);
      key_fetched_value.splice(grid[temp[0]][temp[1]], 1);
      if (key_fetched_ptr.length === 1) {
        key_fetched_ptr = [0];
      } else {
        key_fetched_ptr.pop();
      }
    }
    path.pop();
    if (path.length > 0) {
      let temp = path.slice(-1);
      temp = temp[0];
      let matrix_copy = [...matrix];
      matrix_copy[temp[0]][temp[1]].status = Grid.current;
      matrix_copy[i][j].status = Grid.notVisited;
      setMatrix(matrix_copy);
      await sleep(100);
    }
    return;
  }

  async function runAlgorithm() {
    let si = 0;
    let sj = 0;

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].split("").length; j++) {
        if (grid[i][j] === "@") {
          si = i;
          sj = j;
        }
        if (
          grid[i][j] !== "@" &&
          grid[i][j] !== "#" &&
          grid[i][j] !== "." &&
          grid[i][j] === grid[i][j].toLowerCase()
        ) {
          nkeys += 1;
        }
      }
    }

    await traverse(grid, si, sj);
    return;
  }

  return (
    <>
      <h1>Shortest Path to Get All Keys</h1>
      <div className="viz-section">
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
          <p>Input</p>
        </div>
        <div className="viz-div">
          {resultMatrix.map((row) => {
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
          <p>Output</p>
        </div>
      </div>
      <button
        onClick={() => runAlgorithm()}
        className="algo-button"
        style={{ margin: "1em" }}
      >
        Click to start
      </button>
    </>
  );
}
