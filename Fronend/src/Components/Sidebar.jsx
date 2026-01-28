import { NavLink } from "react-router-dom";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { useState, useEffect } from "react";
import "./Sidebar.css";
import ThemeSwitcher from "./ThemeSwitcher";
import { menuIcons } from "./menuIcons";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";


export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false); // mobile toggle

    const { user, menu } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    return (
        <>
            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <h3 className="logo">EMS</h3>
                <h4 className="welcome-name">Hi {user ? user.UserName : "Guest"}</h4>

                {/* 🔹 Dynamic Menu */}
                {menu.map((menu, index) => (
                    <NavLink
                        key={index}
                        to={menu.path}
                        className={({ isActive }) =>
                            "nav-item" + (isActive ? " active" : "")
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        {menuIcons[menu.Icon]}
                        <span>{menu.Menu_Name}</span>
                    </NavLink>
                ))}

                {/* Logout */}
                <NavLink
                    to="/login"
                    className="nav-item logout"
                    onClick={() => dispatch(logout())}
                >
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
