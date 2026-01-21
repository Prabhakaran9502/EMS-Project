import { Outlet } from "react-router-dom";
import "./Users.css";

export default function UserLayout() {
    return (
        <div className="user-layout">
            <main className="user-main">
                <Outlet />
            </main>
        </div>
    );
}
