import { useState } from "react";
import "./Signup.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { addUser, getEmails } from "../Api/signupApi";

export default function Signup() {
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (emailError) {
            alert("Please use another email");
            return;
        }

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match ❌");
            return;
        }

        await addUser(form);
        alert("Account Created Successfully ✅");
        navigate("/login");
    };



    const handleEmailBlur = async () => {
        if (!form.email) return;

        try {
            const res = await getEmails(form.email);

            if (res.data.exists) {
                setEmailError("Email already exists ❌");
            } else {
                setEmailError("");
            }
        } catch {
            setEmailError("Unable to verify email");
        }
    };



    return (
        <div className="page">
            <div className="signup-card">
                <h2>Create Account</h2>
                <p>Join us and start your journey</p>

                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="input-box">
                        <input
                            type="text"
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                        />
                        <label>Full Name</label>
                    </div>

                    {/* Email */}
                    <div className="input-box">
                        <input
                            type="email"
                            name="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            onBlur={handleEmailBlur}
                        />
                        <label>Email</label>
                        {emailError && <small className="error">{emailError}</small>}
                    </div>


                    {/* Password */}
                    <div className="input-box password-box">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            value={form.password}
                            onChange={handleChange}
                        />
                        <label>Password</label>
                        <span
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                    </div>

                    {/* Confirm Password */}
                    <div className="input-box password-box">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            required
                            value={form.confirmPassword}
                            onChange={handleChange}
                        />
                        <label>Confirm Password</label>
                        <span
                            className="toggle-password"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                        >
                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                    </div>

                    <button className="signup-btn">Create Account</button>
                </form>

                <div className="links">
                    <span>Already have an account?</span>
                    <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
}
