import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FileUpload from "./FileUpload";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoutes";
import ProposalsList from "./pages/ProposalsList";

const App = () => {
  return (
    <>
      <div>
        <Toaster position="top-right" />
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<FileUpload />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/proposals" element={<ProposalsList />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
