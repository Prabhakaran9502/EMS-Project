import { Outlet } from "react-router-dom"; // Nested routes
import Sidebar from "./Sidebar";
import "./ProtectedLayout.css";

export default function ProtectedLayout() {
    return (
        <div className="protected-layout">
            <Sidebar />
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
}
