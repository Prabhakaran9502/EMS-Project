import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";
import ForgotPassword from "./Pages/ForgotPassword";
import Dashboard from "./Pages/Dashboard";
// import EmployeePage from "./Pages/EmployeePage.Jsx";
import ProtectedLayout from "./Components/ProtectedLayout";
import Settings from "./Pages/Settings";
import EmployeeLayout from "./Pages/Employee/EmployeeLayout";
import EmployeeList from "./Pages/Employee/EmployeeList";
import AddEmployee from "./Pages/Employee/AddEmployee";
import EditEmployee from "./Pages/Employee/EditEmployee";

import UserLayout from "./Pages/Users/UserLayout";
import UserList from "./Pages/Users/UserList";

import Personal from "./Pages/Personal/personal";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected routes with sidebar */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<EmployeeLayout />}>
          <Route index element={<EmployeeList />} />
          <Route path="add" element={<AddEmployee />} />
          <Route path="edit/:id" element={<EditEmployee />} />
        </Route>
        <Route path="/users" element={<UserLayout />}>
          <Route index element={<UserList />} />
          {/* <Route path="add" element={<AddEmployee />} /> */}
          {/* <Route path="edit/:id" element={<EditEmployee />} /> */}
        </Route>
        <Route path="/personal" element={<Personal />} />
        <Route path="/settings" element={<Settings />} />

        {/* You can add more protected routes here */}
      </Route>

      {/* 404 */}
      <Route path="*" element={<h2 style={{ color: "white", textAlign: "center" }}>Page Not Found</h2>} />
    </Routes>
  );
}

export default App;
