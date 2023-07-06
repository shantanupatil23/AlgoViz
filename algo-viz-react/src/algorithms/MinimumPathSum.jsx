import { useState } from "react";
import "./algorithms.css";

export default function MinimumPathSum() {
  const Grid = {
    notVisited: "viz-block-not-visited",
    visited: "viz-block-visited",
    current: "viz-block-current",
  };

  const matrix_data = [
    [1, 3, 1],
    [1, 5, 1],
    [4, 2, 1],
  ];
  const [matrix, setMatrix] = useState(
    matrix_data.map((row) => {
      return row.map((item) => {
        return {
          id: crypto.randomUUID(),
          value: item,
          status: Grid.notVisited,
        };
      });
    })
  );
  const [count, setCount] = useState(0);
  const [minCount, setMinCount] = useState("NA");

  let count_debug = 0;
  let min_sum = null;

  function updateMatrix(i, j, new_status, change_count = 0, min_count = null) {
    let matrix_copy = [...matrix];
    matrix_copy[i][j].status = new_status;
    setMatrix(matrix_copy);

    if (change_count != 0) {
      setCount((currentCount) => {
        count_debug = currentCount + change_count;
        return count_debug;
      });
    }
    if (min_count != null) {
      setMinCount(min_count);
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function runAlgorithm(pointer) {
    const i = pointer[0];
    const j = pointer[1];
    const current_pointer_value = matrix[i][j].value;

    updateMatrix(i, j, Grid.current, current_pointer_value);
    await sleep(200);

    if (i === matrix.length - 1 && j === matrix[0].length - 1) {
      await sleep(500);
      min_sum = min_sum != null ? Math.min(min_sum, count_debug) : count_debug;
      updateMatrix(i, j, Grid.notVisited, current_pointer_value * -1, min_sum);
      return;
    }

    if (j < matrix[0].length - 1) {
      updateMatrix(i, j, Grid.visited);
      await runAlgorithm([i, j + 1]);
      updateMatrix(i, j, Grid.current);
    }

    if (i < matrix.length - 1) {
      updateMatrix(i, j, Grid.visited);
      await runAlgorithm([i + 1, j]);
      updateMatrix(i, j, Grid.current);
    }

    await sleep(200);
    updateMatrix(i, j, Grid.notVisited, current_pointer_value * -1);
    return;
  }

  return (
    <>
      <h1>Minimum Path Sum</h1>
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
        </div>
        <div>
          <div className="viz-results">
            <div className="viz-results-key">
              Current Path Sum:&nbsp;&nbsp;{count}
            </div>
          </div>
          <div className="viz-results">
            <div className="viz-results-key">
              Minimum Path Sum:&nbsp;&nbsp;{minCount}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => runAlgorithm([0, 0])}
        className="algo-button"
        style={{ margin: "1em" }}
      >
        Click to start
      </button>
    </>
  );
}
