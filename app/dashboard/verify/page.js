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
  FiSearch,
} from "react-icons/fi";

export default function VerifyCertificate() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const certificates = [
    { id: "", name: "", issued: "", status: "" },
  ];

  const filteredCertificates = certificates.filter((cert) =>
    cert.name.toLowerCase().includes(search.toLowerCase())
  );

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
          <li onClick={() => router.push("/dashboard/create")}>
            <FiFilePlus /> Create New Certificates
          </li>
          <li className="active">
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
        <div className="verify-header">
          <h1>Verify Certificate</h1>
        </div>

        <div className="verify-grid">
          {/* LEFT SECTION */}
          <div className="card">
            <h3>Issued Certificates</h3>

            {/* Search */}
            <div className="search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="Search recipient name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Table */}
            <table className="certificate-table">
              <thead>
                <tr>
                  <th>Certificate ID</th>
                  <th>Issued On</th>
                  <th>Recipient Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.length > 0 ? (
                  filteredCertificates.map((cert) => (
                    <tr key={cert.id}>
                      <td>{cert.id}</td>
                      <td>{cert.issued}</td>
                      <td>{cert.name}</td>
                      <td>
                        <span className={`status ${cert.status.toLowerCase()}`}>
                          {cert.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>
                      No certificates found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* RIGHT SECTION */}
          <div className="card activity">
            <h3>Recent Activities</h3>

            <div className="chart-placeholder">
              <p>Certificate Verifications</p>
              <div className="fake-chart">
                <div style={{ height: "" }}></div>
                <div style={{ height: "" }}></div>
                <div style={{ height: "" }}></div>
                <div style={{ height: "" }}></div>
                <div style={{ height: "" }}></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}