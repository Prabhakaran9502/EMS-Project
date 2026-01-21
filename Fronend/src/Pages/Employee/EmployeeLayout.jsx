import { Outlet } from "react-router-dom";
import "./EmployeePage.css";

export default function EmployeeLayout() {
    return (
        <div className="employee-layout">
            <main className="employee-main">
                <Outlet />
            </main>
        </div>
    );
}
