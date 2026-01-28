import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EmployeePage.css";
import { getMasterData, addEmployee, getEmails } from "../../Api/employeeApi";

export default function AddEmployee() {
    const navigate = useNavigate();

    const [photoPreview, setPhotoPreview] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [employmentTypes, setEmploymentTypes] = useState([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

    const [emailError, setEmailError] = useState("");
    const [checkingEmail, setCheckingEmail] = useState(false);

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
        fetchEmployeeMasterData();
    }, []);

    const fetchEmployeeMasterData = async () => {
        const res = await getMasterData();
        setDepartments(res.data.Table || []);
        setDesignations(res.data.Table1 || []);
        setEmploymentTypes(res.data.Table2 || []);
 
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
 
        if (emailError) {
            alert("Please fix errors before submitting");
            return;
        }

        try {
            const formData = new FormData();

            // append all form fields
            Object.keys(form).forEach(key => {
                formData.append(key, form[key]);
            });

            await addEmployee(formData);

            alert("Employee added successfully");
            navigate("/employees");

        } catch (error) {
            console.error("Error adding employee:", error);
            alert("Failed to add employee");
        }
    };

    const handleEmailBlur = async () => {
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
            setEmailError("Unable to verify email");
        } finally {
            setCheckingEmail(false);
        }
    };


    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoPreview(URL.createObjectURL(file));
            setForm({ ...form, photo: file });
        }
    };

    const filteredDesignations = designations.filter(
        d => d.Department_Id === Number(selectedDepartmentId)
    );


    return (
        <main className="add-employee-main">
            <h2>Add Employee</h2>

            <form className="employee-form" onSubmit={handleSubmit}>

                {/* Upload Photo */}
                <div className="photo-upload">
                    <div className="photo-preview">
                        {photoPreview ? (
                            <img src={photoPreview} alt="Employee" />
                        ) : (
                            <span>No Photo</span>
                        )}
                    </div>

                    <label className="upload-btn">
                        Upload Photo
                        <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
                    </label>
                </div>

                <div className="form-group">
                    <label>Employee Name</label>
                    <input name="name" placeholder="Enter name" onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        onChange={handleChange}
                        onBlur={handleEmailBlur}
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
                    <input required name="phone" placeholder="Enter phone number" onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Gender</label>
                    <select required name="gender" onChange={handleChange}>
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
                            const deptId = e.target.value;
                            setSelectedDepartmentId(deptId);

                            setForm(prev => ({
                                ...prev,
                                department_id: deptId,
                                designation_id: ""   // reset designation
                            }));
                        }}
                        required
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
                        disabled={!selectedDepartmentId}
                        required
                    >
                        <option value="">
                            {selectedDepartmentId ? "Select designation" : "Select department first"}
                        </option>

                        {filteredDesignations.map(des => (
                            <option key={des.Designation_Id} value={des.Designation_Id}>
                                {des.Designation_Name}
                            </option>
                        ))}
                    </select>
                </div>



                <div className="form-group">
                    <label>Salary</label>
                    <input required type="number" name="salary" placeholder="Enter salary" onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Employment Type</label>
                    <select
                        name="employmentType_id"
                        value={form.employmentType_id}
                        onChange={handleChange}
                        required
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
                    <input required name="location" placeholder="Enter location" onChange={handleChange} />
                </div>


                <div className="form-group full-width">
                    <label>Address</label>
                    <textarea
                        name="address"
                        rows="3"
                        placeholder="Enter full address"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={emailError || checkingEmail}
                    >
                        Save
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
