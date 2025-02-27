import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";
import "./style/dark.scss";

// Page Imports
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import Profile from "./pages/profile/Profile";
import Posts from "./pages/posting/Posts";
import PostDetail from "./pages/postdetail/PostDetail";
import CreatePost from "./pages/createpost/CreatePost";
import EditPost from "./pages/editpost/EditPost";
import Reporting from "./pages/reporting/Reporting";
import FakeReports from "./pages/fakereports/FakeReports";
import RealReports from "./pages/realreports/RealReports";

// Form Inputs
import { productInputs, userInputs } from "./formSource";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);

  // Protect routes with authentication
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          {/* Authentication Redirect */}
          <Route
            path="/"
            element={
              currentUser ? <Navigate to="/home" /> : <Navigate to="/login" />
            }
          />

          {/* Public Routes */}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />

          {/* User Management */}
          <Route path="users">
            <Route
              index
              element={
                <RequireAuth>
                  <List />
                </RequireAuth>
              }
            />
            <Route
              path=":userId"
              element={
                <RequireAuth>
                  <Single />
                </RequireAuth>
              }
            />
            <Route
              path="new"
              element={
                <RequireAuth>
                  <New inputs={userInputs} title="Add New User" />
                </RequireAuth>
              }
            />
          </Route>

          {/* Product Management */}
          <Route path="products">
            <Route
              index
              element={
                <RequireAuth>
                  <List />
                </RequireAuth>
              }
            />
            <Route
              path=":productId"
              element={
                <RequireAuth>
                  <Single />
                </RequireAuth>
              }
            />
            <Route
              path="new"
              element={
                <RequireAuth>
                  <New inputs={productInputs} title="Add New Product" />
                </RequireAuth>
              }
            />
          </Route>

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          {/* Posts */}
          <Route
            path="posts"
            element={
              <RequireAuth>
                <Posts />
              </RequireAuth>
            }
          />
          <Route
            path="/postdetail/:postID"
            element={
              <RequireAuth>
                <PostDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/create"
            element={
              <RequireAuth>
                <CreatePost />
              </RequireAuth>
            }
          />
          <Route
            path="/post/:postID/edit"
            element={
              <RequireAuth>
                <EditPost />
              </RequireAuth>
            }
          />

          {/* Reporting Management */}
          <Route
            path="reports"
            element={
              <RequireAuth>
                <Reporting />
              </RequireAuth>
            }
          />
          <Route
            path="reports/fake"
            element={
              <RequireAuth>
                <FakeReports />
              </RequireAuth>
            }
          />
          <Route
            path="reports/real"
            element={
              <RequireAuth>
                <RealReports />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
