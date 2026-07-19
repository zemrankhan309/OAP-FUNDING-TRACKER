import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Children from "../pages/Children";
import Funding from "../pages/Funding";
import Expenses from "../pages/Expenses";
import FinancialStatement from "../pages/FinancialStatement";
import Settings from "../pages/Settings";

import InvoiceUploader from "../features/invoice-import/components/InvoiceUploader";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Children */}
      <Route
        path="/children"
        element={
          <ProtectedRoute>
            <Children />
          </ProtectedRoute>
        }
      />

      {/* Funding */}
      <Route
        path="/funding"
        element={
          <ProtectedRoute>
            <Funding />
          </ProtectedRoute>
        }
      />

      {/* Expenses */}
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <Expenses />
          </ProtectedRoute>
        }
      />

      {/* Financial Statement */}
      <Route
        path="/financial-statement"
        element={
          <ProtectedRoute>
            <FinancialStatement />
          </ProtectedRoute>
        }
      />

      {/* Settings */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Invoice Import (Temporary Test Page) */}
      <Route
        path="/invoice-import"
        element={
          <ProtectedRoute>
            <InvoiceUploader />
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* Catch All */}
      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
}