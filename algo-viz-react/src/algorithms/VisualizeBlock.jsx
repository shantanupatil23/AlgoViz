/* eslint-disable react/prop-types */
export default function VisualizeBlock(props) {
  return (
    <>
      <h1>Minimum Path Sum</h1>
      <div className="viz-section">{props.visualizeSection}</div>
      <button
        onClick={() => props.runAlgorithm()}
        className="algo-button"
        style={{ margin: "1em" }}
      >
        Click to start
      </button>
    </>
  );
}
