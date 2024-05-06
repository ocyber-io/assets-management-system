import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Recent from "./screens/filemanager/Recent";
import Tags from "./screens/filemanager/Tags";
import Dashboard from "./screens/overview/Dashboard";
import Settings from "./screens/settings/Settings";
import Trash from "./screens/sharedfiles/Trash";
import Signup from "./screens/signupscreen/Signup";
import Profile from "./screens/settings/Profile";
import DocumentLinks from "./screens/settings/DocumentLinks";
import Login from "./screens/login/Login";
import Test from "./components/Test";
import RequireAuth from "./middlewares/RequireAuth";
import RedirectIfAuthenticated from "./middlewares/RedirectIfAuthenticated";

const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/signup"
        element={
          <RedirectIfAuthenticated>
            <Signup />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/login"
        element={
          <RedirectIfAuthenticated>
            <Login />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="recent" element={<Recent />} />
        <Route path="tags" element={<Tags />} />
        <Route path="trash" element={<Trash />} />
        <Route path="test" element={<Test />} />
        <Route path="settings" element={<Settings />}>
          <Route path="profile" element={<Profile />} />
          <Route path="document-links" element={<DocumentLinks />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
