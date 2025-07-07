import './index.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Main from "./pages/Main";
import Auth from "./pages/Auth";
import History from "./pages/History";
import TaskDetails from "./pages/TaskDetails";
import QuickReplies from "./pages/QuickReplies";
import Header from "./components/Header";
import { getToken } from "./services/auth";

function PrivateRoute({ children }) {
  const token = getToken();
  return token ? children : <Navigate to="/login" />;
}

function Layout({ children }) {
  const location = useLocation();
  const isLogin = location.pathname === "/login" || location.pathname === "/";

  return (
    <div className={`min-h-screen w-full ${!isLogin ? "bg-black text-white px-4 py-6" : ""}`}>
      {!isLogin && <Header />}
      {children}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route 
            path="/quick-replies" 
            element={
              <PrivateRoute>
                <QuickReplies />
              </PrivateRoute>
            } 
          />
          <Route
            path="/main"
            element={
              <PrivateRoute>
                <Main />
              </PrivateRoute>
            }
          />
          <Route 
            path="/history" 
            element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            } 
          />
          <Route
            path="/task/:id"
            element={
              <PrivateRoute>
                <TaskDetails />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
