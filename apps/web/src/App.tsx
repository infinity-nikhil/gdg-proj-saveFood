import { Route, Routes } from "react-router";
import { Layout } from "@/components/Layout";
import { RequireAuth } from "@/components/RequireAuth";
import { Browse } from "@/pages/Browse";
import { Dashboard } from "@/pages/Dashboard";
import { Home } from "@/pages/Home";
import { ListingDetail } from "@/pages/ListingDetail";
import { Login } from "@/pages/Login";
import { NewListing } from "@/pages/NewListing";
import { NotFound } from "@/pages/NotFound";
import { Register } from "@/pages/Register";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="browse" element={<Browse />} />
        <Route path="listings/:id" element={<ListingDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="listings/new"
          element={
            <RequireAuth role="DONOR">
              <NewListing />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
