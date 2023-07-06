import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import NoPage from "./NoPage";
import MinimumPathSum from "./algorithms/MinimumPathSum";
import ShortestPathToGetAllKeys from "./algorithms/ShortestPathToGetAllKeys";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="min-path-sum" element={<MinimumPathSum />} />
        <Route
          path="shortest-path-keys"
          element={<ShortestPathToGetAllKeys />}
        />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
