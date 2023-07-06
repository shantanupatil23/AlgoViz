import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const algos = [
    {
      id: crypto.randomUUID(),
      title: "Shortest Path to Get All Keys",
      endpoint: "shortest-path-keys",
    },
    {
      id: crypto.randomUUID(),
      title: "Minimum Path Sum",
      endpoint: "min-path-sum",
    },
  ];

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>AlgoViz</h1>
      <div className="card">
        {algos.map((algo) => {
          return (
            <Link key={algo.id} to={algo.endpoint}>
              <button className="algo-button">{algo.title}</button>
            </Link>
          );
        })}
      </div>
      <p className="read-the-docs">Click on the any Algorithm to proceed.</p>
    </>
  );
}

export default Home;
