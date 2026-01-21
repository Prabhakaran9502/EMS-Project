import { NavLink } from "react-router-dom";
import { FiHome, FiUsers, FiSettings, FiLogOut, FiMenu } from "react-icons/fi";
import { FaUserTie } from "react-icons/fa";
import { useState } from "react";
import "./Sidebar.css";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false); // mobile toggle

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <>
            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <h3 className="logo">EMS</h3>
                <h4 className="welcome-name">Hi {user ? user.UserName : "Guest"}</h4>

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
                    onClick={() => setIsOpen(false)} // close on click mobile
                >
                    <FiHome />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/employees"
                    className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
                    onClick={() => setIsOpen(false)}
                >
                    <FiUsers />
                    <span>Employees</span>
                </NavLink>

                <NavLink
                    to="/users"
                    className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
                    onClick={() => setIsOpen(false)}
                >
                    <FaUserTie />
                    <span>Users</span>
                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
                    onClick={() => setIsOpen(false)}
                >
                    <FiSettings />
                    <span>Settings</span>
                </NavLink>

                <NavLink to="/login" className="nav-item logout">
                    <FiLogOut />
                    <span>Logout</span>
                </NavLink>

                <div style={{ padding: "12px" }}>
                    <ThemeSwitcher />
                </div>
            </div>

            {/* Mobile menu button */}
            <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
                <FiMenu />
            </button>
        </>
    );
}
