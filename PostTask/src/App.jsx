import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Posts/Dashboard";
import Error from "./components/Error";
import Register from "./components/Register";
import UserList from "./components/Users/UserList";
import DataGram from "./components/Posts/DataGram";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/datagram" element={<DataGram />} />
        <Route path="/userlist" element={<UserList />} />

        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
