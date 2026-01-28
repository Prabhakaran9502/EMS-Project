import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getEmployeeDetails } from "../../Api/userApi";
import "./Personal.css";

export default function Personal() {
    const user = useSelector((state) => state.auth.user);
    const userId = user?.UserId;

    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (userId) {
            fetchEmployee();
        }
    }, [userId]);

    const fetchEmployee = async () => {
        try {
            setLoading(true);
            const res = await getEmployeeDetails(userId);
            setEmployee(res.data);
        } catch {
            setError("Failed to load personal details");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="personal-layout">

            <main className="personal-main">
                {/* Photo */}
                <div className="photo-section">
                    {employee.photoBase64 ? (
                        <img
                            src={`data:image/jpeg;base64,${employee.photoBase64}`}
                            alt="Employee"
                            className="photo-preview"
                        />
                    ) : (
                        <div className="photo-placeholder">No Photo</div>
                    )}
                </div>

                {/* Details */}
                <div className="details-grid">
                    <Detail label="Name" value={employee.name} />
                    <Detail label="Email" value={employee.email} />
                    <Detail label="Phone" value={employee.phone} />
                    <Detail label="Gender" value={employee.gender} />
                    <Detail label="Department" value={employee.department} />
                    <Detail label="Designation" value={employee.designation} />
                    <Detail label="Employment Type" value={employee.employmentType} />
                    <Detail label="Salary" value={employee.salary} />
                    <Detail label="Location" value={employee.location} />
                </div>

                {/* Address */}
                <div className="address">
                    <label>Address</label>
                    <p>{employee.address || "-"}</p>
                </div>
            </main>
        </div>
    );
}

function Detail({ label, value }) {
    return (
        <div className="detail-item">
            <label>{label}</label>
            <span>{value || "-"}</span>
        </div>
    );
}
