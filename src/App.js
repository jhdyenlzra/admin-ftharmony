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
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);

  // RequireAuth ensures the route is accessible only when logged in
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          {/* Redirect "/" based on authentication */}
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


          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
            />

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

            <Route
            path="reports"
            element={
              <RequireAuth>
                <Reporting />
              </RequireAuth>}
          />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
