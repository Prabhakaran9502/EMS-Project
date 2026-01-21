import { useEffect, useState } from "react";
import "./ThemeSwitcher.css";

const themes = ["light", "blue", "green", "purple"];

export default function ThemeSwitcher() {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <div className="theme-switcher">
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                {themes.map((t) => (
                    <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
}
