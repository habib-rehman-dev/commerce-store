import { Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import Login from "../auth/Pages/SignIn";
import Register from "../auth/Pages/SignUp";
import Dashboard from "../pages/Dashboard";

const AppRouter = () => {
  return (
    <div>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </div>
  );
};

export default AppRouter;
