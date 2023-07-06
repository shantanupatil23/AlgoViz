/* eslint-disable react/prop-types */
export default function VisualizeBlock(props) {
  return (
    <>
      <h1>{props.title}</h1>
      <div className="viz-section">{props.visualizeSection}</div>
      <button
        onClick={() => props.runAlgorithm()}
        className="algo-button"
        style={{ margin: "1em" }}
      >
        Click to start
      </button>
      <a href={props.url} target="_blank" rel="noreferrer">
        <p className="read-the-docs">{props.question}</p>
      </a>
    </>
  );
}
