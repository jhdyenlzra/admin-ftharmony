import React, { useContext, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";
import "./style/dark.scss";

// Page Imports
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import List from "./pages/list/List";
import SingleUser from "./pages/singleuser/SingleUser";
import SingleReport from "./pages/singlereport/SingleReport";
import New from "./pages/new/New";
import Profile from "./pages/profile/Profile";
import Posts from "./pages/posting/Posts";
import PostDetail from "./pages/postdetail/PostDetail";
import CreatePost from "./pages/createpost/CreatePost";
import DatatableReport from "./components/datatablereport/DatatableReport";
import Analytics from "./pages/analytics/Analytics";
import { productInputs, userInputs, reportInputs } from "./formSource";

// Route Guard Components
const PublicRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? <Navigate to="/home" /> : children;
};

const RequireAuth = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [avatarUpdated, setAvatarUpdated] = useState(false);

  const handleAvatarUpdate = () => {
    setAvatarUpdated(prev => !prev);
  };

  // Wrapper for components that need avatar updates
  const withAvatarUpdate = (Component, props = {}) => {
    return (
      <RequireAuth>
        <Component {...props} avatarUpdated={avatarUpdated} onAvatarUpdate={handleAvatarUpdate} />
      </RequireAuth>
    );
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          {/* Authentication Redirect */}
          <Route
            path="/"
            element={currentUser ? <Navigate to="/home" /> : <Navigate to="/login" />}
          />

          {/* Public Routes */}
          <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/* Protected Routes */}
          <Route path="home" element={withAvatarUpdate(Home)} />
          
          {/* User Management */}
          <Route path="users">
            <Route index element={withAvatarUpdate(List)} />
            <Route path=":id" element={withAvatarUpdate(SingleUser)} />
            <Route 
              path="new" 
              element={withAvatarUpdate(New, { inputs: userInputs, title: "Add New User" })} 
            />
          </Route>

          {/* Profile */}
          <Route path="/profile" element={withAvatarUpdate(Profile)} />
          
          {/* Analytics */}
          <Route path="/analytics" element={withAvatarUpdate(Analytics)} />

          {/* Posts */}
          <Route path="posts" element={withAvatarUpdate(Posts)} />
          <Route path="/postdetail/:postID" element={withAvatarUpdate(PostDetail)} />
          <Route path="/create" element={withAvatarUpdate(CreatePost)} />
          
          {/* Reporting Management */}
          <Route path="reports">
            <Route index element={withAvatarUpdate(DatatableReport)} />
            <Route path=":reportId" element={withAvatarUpdate(SingleReport)} />
            <Route 
              path="new" 
              element={withAvatarUpdate(New, { inputs: reportInputs, title: "Add New Report" })} 
            />
          </Route>

          {/* Fallback Route */}
          <Route
            path="*"
            element={currentUser ? <Navigate to="/home" /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
