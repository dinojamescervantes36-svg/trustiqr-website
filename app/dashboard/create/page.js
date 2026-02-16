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
  FiAward,
  FiMail,
} from "react-icons/fi";
import QRCode from "react-qr-code";

export default function CreateCertificate() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    completionDate: "",
    certificateTitle: "",
    program: "",
    template: "Academic Degree",
  });

  // ✅ Stable hash (not regenerated on every render)
  const [uniqueHash, setUniqueHash] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleIssue = () => {
    if (!form.fullName || !form.email || !form.program) {
      alert("Please complete all required fields.");
      return;
    }

    const hash =
      "TX-" + Math.random().toString(36).substring(2, 10).toUpperCase();

    setUniqueHash(hash);
    alert("Certificate Issued Successfully!");
  };

  const handleSendEmail = () => {
    if (!form.email) {
      alert("Please enter a recipient email first.");
      return;
    }

    alert(`Certificate sent to ${form.email}`);
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src="/img/logo.png" alt="TrustiQR Logo" />
          <span>TrustiQR</span>
        </div>

        <ul>
          <li onClick={() => router.push("/dashboard")}>
            <FiHome /> Dashboard
          </li>
          <li className="active">
            <FiFilePlus /> Create New Certificates
          </li>
          <li onClick={() => router.push("/dashboard/verify")}>
            <FiCheckCircle /> Verify Certificate
          </li>
          <li onClick={() => router.push("/dashboard/templates")}>
            <FiLayers /> Manage Templates
          </li>
          <li onClick={() => router.push("/dashboard/users")}>
            <FiUsers /> User Accounts
          </li>
          <li onClick={() => router.push("/dashboard/settings")}>
            <FiSettings /> Settings
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main">
        {/* Navbar */}
        <div className="create-navbar">
          <div className="create-navbar-left">
            <h1>Create New Certificate</h1>
          </div>

          <div className="create-navbar-right">
            <button className="secondary small-btn">Save Draft</button>
            <button className="primary small-btn">Preview</button>
          </div>
        </div>

        <div className="create-grid">
          {/* Left Section */}
          <div className="left-section">
            {/* 1. Recipient Info */}
            <div className="card">
              <h3>1. Recipient Information</h3>
              <div className="form-grid">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  onChange={handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Work Email"
                  onChange={handleChange}
                />
                <input
                  type="date"
                  name="completionDate"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* 2. Certificate Details */}
            <div className="card">
              <h3>2. Certificate Details</h3>
              <input
                type="text"
                name="certificateTitle"
                placeholder="Professional Certificate in Data Analytics"
                onChange={handleChange}
              />
            </div>

            {/* 3. Program Selection */}
            <div className="card">
              <h3>3. Program Selection</h3>
              <select name="program" onChange={handleChange}>
                <option value="">Select Program</option>

                {/* Computer & Technology */}
                <option>Bachelor of Science in Computer Science</option>
                <option>Bachelor of Science in Information Technology</option>
                <option>Bachelor of Science in Information Systems</option>
                <option>Bachelor of Science in Data Science</option>
                <option>Bachelor of Science in Cybersecurity</option>
                <option>Bachelor of Science in Software Engineering</option>
                <option>Professional Data Analytics</option>

                {/* Business */}
                <option>Bachelor of Science in Business Administration</option>
                <option>Bachelor of Science in Accountancy</option>
                <option>Bachelor of Science in Entrepreneurship</option>
                <option>Bachelor of Science in Marketing Management</option>
                <option>Bachelor of Science in Financial Management</option>
                <option>Bachelor of Science in Human Resource Management</option>

                {/* Engineering */}
                <option>Bachelor of Science in Civil Engineering</option>
                <option>Bachelor of Science in Computer Engineering</option>
                <option>Bachelor of Science in Electrical Engineering</option>
                <option>Bachelor of Science in Mechanical Engineering</option>
                <option>Bachelor of Science in Industrial Engineering</option>
                <option>Bachelor of Science in Mechatrinocs Engineering</option>
                {/* Education */}
                <option>Bachelor of Elementary Education</option>
                <option>Bachelor of Secondary Education – Major in English</option>
                <option>Bachelor of Secondary Education – Major in Mathematics</option>
                <option>Bachelor of Secondary Education – Major in Science</option>
                <option>Bachelor of Secondary Education – Major in Filipino</option>
                <option>Bachelor of Physical Education</option>

                {/* Others */}
                <option>Bachelor of Science in Psychology</option>
                <option>Bachelor of Science in Nursing</option>
                <option>Bachelor of Science in Multimedia Arts</option>
              </select>
            </div>

            {/* 4. Template Selection */}
            <div className="card">
              <h3>4. Template Selection</h3>
              <div className="templates">
                {["Academic Degree", "Course Completion", "Employee ID"].map(
                  (temp) => (
                    <div
                      key={temp}
                      className={`template ${
                        form.template === temp ? "selected" : ""
                      }`}
                      onClick={() =>
                        setForm({ ...form, template: temp })
                      }
                    >
                      <FiAward size={28} />
                      <p>{temp}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="right-section">
            <div className="card security">
              <h3>Security & QR Generation</h3>

              <div className="qr-box">
                {uniqueHash ? (
                  <QRCode value={uniqueHash} size={120} />
                ) : (
                  <p className="qr-placeholder">QR will appear here</p>
                )}
              </div>

              <p className="hash">
                <strong>Unique Hash ID:</strong>
                <br />
                <span>{uniqueHash || "Not generated yet"}</span>
              </p>

              <button
                className="primary"
                onClick={handleIssue}
              >
                Issue Certificate
              </button>

              <button
                className="secondary"
                onClick={handleSendEmail}
                disabled={!uniqueHash}
              >
                <FiMail /> Send via Email
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
