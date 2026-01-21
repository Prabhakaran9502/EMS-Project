import { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css"; // reuse same CSS
import { forgotPassword } from "../Api/signupApi";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            await forgotPassword(email);
            alert("Temporary password sent to your email 📧");
        } catch (err) {
            alert(err.response?.data || "Email not found");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="signup-card">
                <h2>Forgot Password</h2>
                <p>Enter your email to reset password</p>

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
                    <button disabled={loading} className="signup-btn">
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                </form>

                <div className="links">
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}
