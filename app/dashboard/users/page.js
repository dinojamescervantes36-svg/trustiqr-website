"use client";

import { useState, useEffect } from "react";
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

import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function SettingsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    team: "Registrar",
  });

  const [appearance, setAppearance] = useState("light");
  const [twoFA, setTwoFA] = useState(true);
  const [connections, setConnections] = useState({
    google: true,
    facebook: false,
  });

  // 🔐 Load Auth + Firestore user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/auth");
        return;
      }

      setFirebaseUser(user);

      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {
        setForm({
          name: snap.data().name || "",
          email: user.email || "",
          password: "",
          team: snap.data().team || "Registrar",
        });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleConnection = (provider) =>
    setConnections({ ...connections, [provider]: !connections[provider] });

  // 💾 Save profile to Firestore
  const handleSaveProfile = async () => {
    if (!firebaseUser) return;

    try {
      await updateDoc(doc(db, "users", firebaseUser.uid), {
        name: form.name,
        team: form.team,
        updatedAt: new Date(),
      });

      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  if (loading) return <p>Loading account...</p>;

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

      {/* ================= MAIN ================= */}
      <main className="main">
        <div className="settings-page">
          <h1>User Account</h1>

          {/* ================= PROFILE ================= */}
          <div className="card">
            <h3><FiUser /> Profile</h3>

            <div className="profile-grid">
              <div className="avatar-placeholder">
                {form.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>

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
                  disabled
                />

                <label>New Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  placeholder="Managed in Auth"
                  disabled
                />

                <label>Default Team</label>
                <select
                  name="team"
                  value={form.team}
                  onChange={handleChange}
                >
                  <option value="Registrar">Registrar</option>
                  <option value="Admin">Admin</option>
                  <option value="Verifier">Verifier</option>
                </select>

                <button className="primary" onClick={handleSaveProfile}>
                  Save Changes
                </button>
              </div>
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
