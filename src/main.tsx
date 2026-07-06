import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

import { AuthProvider } from "./contexts/AuthContext";
import { SelectedChildProvider } from "./contexts/SelectedChildContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SelectedChildProvider>
          <App />

          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={12}
            toastOptions={{
              duration: 3000,
              style: {
                background: "#ffffff",
                color: "#111827",
                borderRadius: "12px",
                padding: "16px",
                fontSize: "14px",
                fontWeight: 500,
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              },
              success: {
                iconTheme: {
                  primary: "#16a34a",
                  secondary: "#ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#dc2626",
                  secondary: "#ffffff",
                },
              },
            }}
          />
        </SelectedChildProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);