import { useState } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { loginUser, fetchMenu } from "../Api/LoginApi";
import { useDispatch } from "react-redux";
import { setAuthData } from "../store/authSlice";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState("");

    const dispatch = useDispatch();


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!email && !password)
                setLoginError("");
            const res = await loginUser({ email, password });
            const menuRes = await fetchMenu(res.data.RoleId);
            dispatch(
                setAuthData({
                    user: res.data,
                    role: res.data.RoleId,
                    menu: menuRes.data.Table
                })
            );

            navigate("/dashboard");

        } catch (err) {
            setLoginError("Invalid login");
        }
    };


    return (
        <div className="page">
            <div className="login-card">
                <h2>Welcome to EMS</h2>
                <p>Please login to your account</p>

                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label>Email</label>
                    </div>

                    {/* Password with Toggle */}
                    <div className="input-box password-box">
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label>Password</label>

                        <span
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                    </div>

                    <button className="login-btn">Login</button>
                    <span className="login-error">
                        {loginError}
                    </span>
                </form>

                <div className="links">
                    <Link to="/forgot-password">Forgot Password?</Link>
                    <Link to="/signup">Create Account</Link>
                </div>
            </div>
        </div>
    );
}
