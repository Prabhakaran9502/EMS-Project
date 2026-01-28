import "./AssignEmployeeForm.css";
import { useEffect, useState } from "react";
import { getEmployeeDetails, saveEmployee, getMasterData } from "../../Api/userApi";

export default function AssignEmployeeForm({ user, onClose }) {

    const [employee, setEmployee] = useState({
        userId: user.UserId,
        employeeName: "",
        email: "",
        phone: "",
        gender: "",
        department_id: "",
        designation_id: "",
        employment_type_id: "",
        salary: "",
        location: "",
        address: "",
        photo: null,
        photoBase64: null
    });

    const [photoPreview, setPhotoPreview] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [employmentTypes, setEmploymentTypes] = useState([]);

    // 🔹 Load existing employee data (if already assigned)
    useEffect(() => {
        fetchEmployeeDetails();
        fetchMasterData();
    }, []);

    const fetchEmployeeDetails = async () => {
        try {
            setLoading(true);
            const res = await getEmployeeDetails(user.UserId);
            if (res.data) {
                setEmployee({
                    userId: res.data.id,
                    employeeName: res.data.name,
                    email: res.data.email,
                    phone: res.data.phone,
                    gender: res.data.gender,
                    department_id: res.data.department_id?.toString(),
                    designation_id: res.data.designation_id?.toString(),
                    salary: res.data.salary,
                    employment_type_id: res.data.employmentType_id?.toString(),
                    location: res.data.location,
                    address: res.data.address,
                    photoBase64: res.data.photoBase64,
                    photo: res.data.photoBase64
                });

                if (res.data.photoBase64) {
                    setPhotoPreview(`data:image/jpeg;base64,${res.data.photoBase64}`);
                }
            } else {
                // New employee → prefill from user
                setEmployee(prev => ({
                    ...prev,
                    employeeName: user.UserName,
                    email: user.Email
                }));
            }
        } catch {
            setError("Failed to load employee details");
        } finally {
            setLoading(false);
        }
    };

    const fetchMasterData = async () => {
        const res = await getMasterData();
        setDepartments(res.data.Table || []);
        setDesignations(res.data.Table1 || []);
        setEmploymentTypes(res.data.Table2 || []);
    };

    const filteredDesignations = designations.filter(
        d => d.Department_Id === Number(employee.department_id)
    );


    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Save file in state
        setEmployee(prev => ({
            ...prev,
            photo: file
        }));
    };



    // 🔹 Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee(prev => ({ ...prev, [name]: value }));
    };

    // 🔹 Save employee
    const handleSave = async () => {
        try {
            const formData = new FormData();
            Object.keys(employee).forEach(key => {
                if (employee[key] !== null) {
                    formData.append(key, employee[key]);
                }
            });
            await saveEmployee(formData);

            alert("Employee assigned successfully");
            onClose();
        } catch (err) {
            console.log(err);
            alert("Save failed");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="assign-form">

            {error && <p className="error">{error}</p>}

            <div className="photo-section">
                {photoPreview ? (
                    <img
                        src={photoPreview}
                        alt="Employee"
                        className="photo-preview"
                    />
                ) : employee.photoBase64 ? (
                    <img
                        src={`data:image/jpeg;base64,${employee.photoBase64}`}
                        alt="Employee"
                        className="photo-preview"
                    />
                ) : (
                    <div className="photo-placeholder">No Photo</div>
                )}

                <label htmlFor="photoInput" className="upload-btn">
                    Upload Photo
                    <input
                        type="file"
                        id="photoInput"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handlePhotoChange}
                    />
                </label>
            </div>



            <div className="form-grid">

                <div>
                    <label>Employee Name</label>
                    <input
                        name="employeeName"
                        value={employee.employeeName}
                        onChange={handleChange}
                        disabled
                    />
                </div>

                <div>
                    <label>Email</label>
                    <input
                        name="email"
                        value={employee.email}
                        onChange={handleChange}
                        disabled
                    />
                </div>

                <div>
                    <label>Phone</label>
                    <input
                        name="phone"
                        value={employee.phone}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Gender</label>
                    <select
                        name="gender"
                        value={employee.gender}
                        onChange={handleChange}
                    >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <div>
                    <label>Department</label>
                    <select
                        name="department_id"
                        value={employee.department_id}
                        onChange={(e) => {
                            setEmployee(prev => ({
                                ...prev,
                                department_id: e.target.value,
                                designation_id: ""
                            }));
                        }}
                    >
                        <option value="">Select department</option>
                        {departments.map(dep => (
                            <option
                                key={dep.Department_Id}
                                value={dep.Department_Id}
                            >
                                {dep.Department_Name}
                            </option>
                        ))}
                    </select>
                </div>


                <div>
                    <label>Designation</label>
                    <select
                        name="designation_id"
                        value={employee.designation_id}
                        onChange={handleChange}
                        disabled={!employee.department_id}
                    >
                        <option value="">Select designation</option>
                        {filteredDesignations.map(des => (
                            <option
                                key={des.Designation_Id}
                                value={des.Designation_Id}
                            >
                                {des.Designation_Name}
                            </option>
                        ))}
                    </select>
                </div>


                <div>
                    <label>Salary</label>
                    <input
                        name="salary"
                        value={employee.salary}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Employment Type</label>
                    <select
                        name="employment_type_id"
                        value={employee.employment_type_id}
                        onChange={handleChange}
                    >
                        <option value="">Select type</option>
                        {employmentTypes.map(et => (
                            <option
                                key={et.Employment_Type_Id}
                                value={et.Employment_Type_Id}
                            >
                                {et.Employment_Type_Name}
                            </option>
                        ))}
                    </select>
                </div>



                <div>
                    <label>Location</label>
                    <input
                        name="location"
                        value={employee.location}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="address">
                <label>Address</label>
                <textarea
                    name="address"
                    value={employee.address}
                    onChange={handleChange}
                />
            </div>

            <div className="form-actions">
                <button className="save-btn" onClick={handleSave}>Save</button>
                <button className="cancel-btn" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}
