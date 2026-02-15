"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiHome,
  FiFilePlus,
  FiCheckCircle,
  FiUsers,
  FiLayers,
  FiSettings,
  FiUser,
  FiMoon,
  FiSun,
  FiLink,
  FiShield,
} from "react-icons/fi";

export default function SettingsPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "Institution Admin",
    email: "admin@institution.com",
    password: "",
    team: "Registrar",
  });

  const [appearance, setAppearance] = useState("light");
  const [twoFA, setTwoFA] = useState(true);
  const [connections, setConnections] = useState({
    google: true,
    facebook: false,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleConnection = (provider) =>
    setConnections({ ...connections, [provider]: !connections[provider] });

  const handleSaveProfile = () => {
    alert(`Saved changes for ${form.name} (${form.email})`);
    // Here you can add your API/Firebase call to update the user profile
  };

  return (
    <div className="dashboard">
      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">
        <div className="logo">
          <img src="/img/logo.png" alt="TrustiQR Logo" />
          <span>TrustiQR</span>
        </div>

        <ul>
          <li onClick={() => router.push("/dashboard")}>
            <FiHome /> Dashboard
          </li>

          <li onClick={() => router.push("/dashboard/create")}>
            <FiFilePlus /> Create Certificates
          </li>

          <li onClick={() => router.push("/dashboard/verify")}>
            <FiCheckCircle /> Verify Certificate
          </li>

          <li onClick={() => router.push("/dashboard/templates")}>
            <FiLayers /> Manage Templates
          </li>

          <li className="active">
            <FiUsers /> User Accounts
          </li>

          <li onClick={() => router.push("/dashboard/settings")}>
            <FiSettings /> Settings
          </li>
        </ul>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="main">
        <div className="settings-page">
          <h1>User Account</h1>

          {/* ================= PROFILE CARD ================= */}
          <div className="card">
            <h3><FiUser /> Profile</h3>

            <div className="profile-grid">
              {/* Avatar */}
              <div className="avatar-placeholder">
                {form.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>

              {/* Form */}
              <div className="form">
                <label>Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />

                <label>Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />

                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                />

                <label>Default Team</label>
                <select name="team" value={form.team} onChange={handleChange}>
                  <option>Registrar</option>
                  <option>Admin</option>
                  <option>Verifier</option>
                </select>

                <button className="primary" onClick={handleSaveProfile}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* ================= CONNECTED ACCOUNTS ================= */}
          <div className="card">
            <h3><FiLink /> Connected Accounts</h3>

            <div className="connection">
              <span>Google</span>
              <button onClick={() => toggleConnection("google")}>
                {connections.google ? "Disconnect" : "Connect"}
              </button>
            </div>

            <div className="connection">
              <span>Facebook</span>
              <button onClick={() => toggleConnection("facebook")}>
                {connections.facebook ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>

          {/* ================= APPEARANCE ================= */}
          <div className="card">
            <h3>Appearance</h3>
            <div className="appearance">
              <button
                className={appearance === "light" ? "active" : ""}
                onClick={() => setAppearance("light")}
              >
                <FiSun /> Light
              </button>

              <button
                className={appearance === "dark" ? "active" : ""}
                onClick={() => setAppearance("dark")}
              >
                <FiMoon /> Dark
              </button>
            </div>
          </div>

          {/* ================= SECURITY ================= */}
          <div className="card">
            <h3><FiShield /> Security</h3>

            <div className="twofa">
              <span>Two-Factor Authentication</span>
              <input
                type="checkbox"
                checked={twoFA}
                onChange={() => setTwoFA(!twoFA)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
