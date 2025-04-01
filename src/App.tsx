import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import CustomersPage from "@/pages/customers";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<CustomersPage />} path="/customers" />
    </Routes>
  );
}

export default App;
