import { Route, Routes } from "react-router-dom";

import RouterGuard from "./components/router-guard";

import IndexPage from "@/pages/index";
import CustomersPage from "@/pages/customers";
import FinancePage from "@/pages/finance";
import MyProfilePage from "@/pages/my-profile";
import AuthenticatedPage from "@/pages/authenticated";

function App() {
  return (
    <Routes>
      <Route
        element={
          <RouterGuard>
            <IndexPage />
          </RouterGuard>
        }
        path="/"
      />
      <Route
        element={
          <RouterGuard>
            <AuthenticatedPage />
          </RouterGuard>
        }
        path="/authenticated"
      >
        <Route
          element={
            <RouterGuard>
              <CustomersPage />
            </RouterGuard>
          }
          path="customers"
        />
        <Route
          element={
            <RouterGuard>
              <FinancePage />
            </RouterGuard>
          }
          path="finance"
        />
        <Route
          element={
            <RouterGuard>
              <MyProfilePage />
            </RouterGuard>
          }
          path="my-profile"
        />
      </Route>
    </Routes>
  );
}

export default App;
