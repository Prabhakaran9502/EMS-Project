import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EmployeePage.css";
import { getEmployeeById, updateEmployee, getMasterData, getEmails } from "../../Api/employeeApi";

export default function EditEmployee() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [photoPreview, setPhotoPreview] = useState(null);

    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [employmentTypes, setEmploymentTypes] = useState([]);

    const [emailError, setEmailError] = useState("");
    const [checkingEmail, setCheckingEmail] = useState(false);
    const [originalEmail, setOriginalEmail] = useState("");


    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        department_id: "",
        designation_id: "",
        salary: "",
        employmentType_id: "",
        status: "true",
        location: "",
        address: "",
        photo: null
    });

    useEffect(() => {
        fetchEmployee();
        fetchMasterData();
    }, [id]);

    const fetchEmployee = async () => {
        try {
            const res = await getEmployeeById(id);

            setForm({
                name: res.data.name,
                email: res.data.email,
                phone: res.data.phone,
                gender: res.data.gender,
                department_id: res.data.department_id,
                designation_id: res.data.designation_id,
                salary: res.data.salary,
                employmentType_id: res.data.employmentType_id,
                status: res.data.status.toString(),
                location: res.data.location,
                address: res.data.address,
                // photo: null
            });

            // Show existing photo
            if (res.data.photoBase64) {
                setPhotoPreview(`data:image/jpeg;base64,${res.data.photoBase64}`);
            }

            setOriginalEmail(res.data.email);

        } catch (err) {
            alert("Failed to load employee");
            navigate("/employees");
        }
    };

    const fetchMasterData = async () => {
        const res = await getMasterData();
        setDepartments(res.data.Table || []);
        setDesignations(res.data.Table1 || []);
        setEmploymentTypes(res.data.Table2 || []);
    };

    const filteredDesignations = designations.filter(
        d => d.Department_Id === Number(form.department_id)
    );


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoPreview(URL.createObjectURL(file));
            setForm({ ...form, photo: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (emailError) {
            alert("Please fix email error before updating");
            return;
        }

        try {
            const formData = new FormData();

            Object.keys(form).forEach(key => {
                if (key === "photo") {
                    // append photo ONLY if user selected a new one
                    if (form.photo) {
                        formData.append("photo", form.photo);
                    }
                } else {
                    formData.append(key, form[key]);
                }
            });

            await updateEmployee(id, formData);

            alert("Employee updated successfully");
            navigate("/employees");

        } catch (err) {
            alert("Update failed");
        }
    };


    const handleEmailBlur = async () => {

        if (form.email === originalEmail) {
            setEmailError("");
            return;
        }

        if (!form.email) return;

        try {
            setCheckingEmail(true);

            const res = await getEmails(form.email);

            if (res.data.exists) {
                setEmailError("Email already exists");
            } else {
                setEmailError("");
            }
        } catch {
            setEmailError("Unable to validate email");
        } finally {
            setCheckingEmail(false);
        }
    };

    return (
        <main className="edit-employee-main">
            <h2>Edit Employee</h2>

            <form className="employee-form" onSubmit={handleSubmit}>

                {/* Photo Upload */}
                <div className="photo-upload">
                    <div className="photo-preview">
                        {photoPreview ? (
                            <img src={photoPreview} alt="Employee" />
                        ) : (
                            <span>No Photo</span>
                        )}
                    </div>

                    <label className="upload-btn">
                        Change Photo
                        <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
                    </label>
                </div>

                <div className="form-group">
                    <label>Employee Name</label>
                    <input name="name" value={form.name} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleEmailBlur}
                        className={emailError ? "input-error" : ""}
                        required
                    />

                    {checkingEmail && (
                        <div className="field-message checking">
                            Checking email...
                        </div>
                    )}

                    {emailError && (
                        <div className="field-message error">
                            {emailError}
                        </div>
                    )}
                </div>


                <div className="form-group">
                    <label>Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange}>
                        <option value="">Select gender</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Department</label>
                    <select
                        name="department_id"
                        value={form.department_id}
                        onChange={(e) => {
                            setForm({
                                ...form,
                                department_id: e.target.value,
                                designation_id: ""
                            });
                        }}
                    >
                        <option value="">Select department</option>
                        {departments.map(dep => (
                            <option key={dep.Department_Id} value={dep.Department_Id}>
                                {dep.Department_Name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Designation</label>
                    <select
                        name="designation_id"
                        value={form.designation_id}
                        onChange={handleChange}
                        disabled={!form.department_id}
                    >
                        <option value="">Select designation</option>
                        {filteredDesignations.map(des => (
                            <option key={des.Designation_Id} value={des.Designation_Id}>
                                {des.Designation_Name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Salary</label>
                    <input type="number" name="salary" value={form.salary} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Employment Type</label>
                    <select
                        name="employmentType_id"
                        value={form.employmentType_id}
                        onChange={handleChange}
                    >
                        <option value="">Select type</option>
                        {employmentTypes.map(type => (
                            <option
                                key={type.Employment_Type_Id}
                                value={type.Employment_Type_Id}
                            >
                                {type.Employment_Type_Name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Location</label>
                    <input name="location" value={form.location} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Status</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>

                <div className="form-group full-width">
                    <label>Address</label>
                    <textarea
                        rows="3"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary">
                        Update
                    </button>
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => navigate("/employees")}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </main>
    );
}
