"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiHome,
  FiFilePlus,
  FiCheckCircle,
  FiUsers,
  FiLayers,
  FiSettings,
  FiSearch,
  FiPlus,
  FiTrash2,
  FiEye,
  FiRefreshCw,
} from "react-icons/fi";

function loadCertificatesFromStorage() {
  try {
    const raw = localStorage.getItem("certificates");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCertificatesToStorage(list) {
  try {
    localStorage.setItem("certificates", JSON.stringify(list));
  } catch {}
}

export default function VerifyCertificate() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState({
    id: "",
    name: "",
    issued: new Date().toISOString().slice(0, 10),
    status: "Issued",
  });

  useEffect(() => {
    setCertificates(loadCertificatesFromStorage());
    const onStorage = (e) => {
      if (e.key === "certificates") setCertificates(loadCertificatesFromStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return certificates.slice().reverse();
    return certificates
      .filter(
        (c) =>
          (c.name || "").toLowerCase().includes(q) ||
          (c.id || "").toLowerCase().includes(q) ||
          (c.status || "").toLowerCase().includes(q)
      )
      .slice()
      .reverse();
  }, [certificates, search]);

  const handleAddOpen = () => {
    setAdding({
      id: `CERT-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
      name: "",
      issued: new Date().toISOString().slice(0, 10),
      status: "Issued",
    });
    setShowAdd(true);
  };

  const handleAddSave = () => {
    if (!adding.name.trim() || !adding.id.trim()) {
      alert("Please provide certificate ID and recipient name.");
      return;
    }
    const next = [...certificates, { ...adding }];
    setCertificates(next);
    saveCertificatesToStorage(next);
    setShowAdd(false);
  };

  const handleRemove = (id) => {
    if (!confirm("Remove this certificate? This action cannot be undone.")) return;
    const next = certificates.filter((c) => c.id !== id);
    setCertificates(next);
    saveCertificatesToStorage(next);
  };

  const handleView = (cert) => {
    router.push(`/dashboard/verify?qr=${encodeURIComponent(cert.id)}`);
  };

  const handleClearAll = () => {
    if (!confirm("Clear all certificates? This action cannot be undone.")) return;
    setCertificates([]);
    saveCertificatesToStorage([]);
  };

  const handleRefresh = () => {
    setCertificates(loadCertificatesFromStorage());
  };

  return (
    <div className="dashboard">
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

      <main className="main verify-main">
        <div className="verify-header-section">
          <div className="verify-title">
            <h1>Verify Certificates</h1>
            <p>Search and manage issued certificates.</p>
          </div>

          <div className="verify-controls">
            <div className="search-box-verify">
              <FiSearch />
              <input
                placeholder="Search by name, ID or status"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button onClick={handleAddOpen} className="primary">
              <FiPlus /> Add
            </button>
          </div>
        </div>

        <div className="verify-content">
          <section className="card verify-card-list">
            <div className="card-header">
              <h3>Issued Certificates</h3>
              <div className="card-actions-header">
                <button className="btn" onClick={handleRefresh} title="Refresh">
                  <FiRefreshCw />
                </button>
                <button className="btn danger" onClick={handleClearAll} title="Clear All">
                  Clear
                </button>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="table-container">
              <table className="cert-table">
                <thead>
                  <tr>
                    <th>Certificate ID</th>
                    <th>Issued On</th>
                    <th>Recipient Name</th>
                    <th>Status</th>
                    <th className="actions-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="empty-state">
                        No certificates found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((cert) => (
                      <tr key={cert.id}>
                        <td className="id-cell">{cert.id}</td>
                        <td>{cert.issued}</td>
                        <td>{cert.name}</td>
                        <td>
                          <span className={`badge ${cert.status.toLowerCase()}`}>
                            {cert.status}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button
                            title="View"
                            onClick={() => handleView(cert)}
                            className="btn"
                          >
                            <FiEye />
                          </button>
                          <button
                            title="Remove"
                            onClick={() => handleRemove(cert.id)}
                            className="btn danger"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="mobile-cards">
              {filtered.length === 0 ? (
                <div className="empty-state-mobile">
                  No certificates found.
                </div>
              ) : (
                filtered.map((cert) => (
                  <div key={cert.id} className="cert-mobile-card">
                    <div className="card-top-section">
                      <div className="cert-id-mobile">{cert.id}</div>
                      <span className={`badge ${cert.status.toLowerCase()}`}>
                        {cert.status}
                      </span>
                    </div>

                    <div className="card-middle-section">
                      <div>
                        <div className="cert-recipient">{cert.name}</div>
                        <div className="cert-date">{cert.issued}</div>
                      </div>
                    </div>

                    <div className="card-action-buttons">
                      <button
                        onClick={() => handleView(cert)}
                        className="btn"
                      >
                        <FiEye /> View
                      </button>
                      <button
                        onClick={() => handleRemove(cert.id)}
                        className="btn danger"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <aside className="card verify-activity-card">
            <h3>Recent Activity</h3>

            <div className="activity-list">
              {certificates.length === 0 ? (
                <div className="activity-empty">
                  No activity yet. Add certificates to populate recent activity.
                </div>
              ) : (
                certificates.slice().reverse().slice(0, 6).map((c) => (
                  <div key={c.id} className="activity-item">
                    <div className="activity-info">
                      <div className="activity-name">{c.name}</div>
                      <div className="activity-date">{c.issued}</div>
                    </div>
                    <div className="activity-status">{c.status}</div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>

        {/* Add Modal */}
        {showAdd && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="modal-title">Add Certificate</h3>

              <div className="modal-form">
                <label className="form-group">
                  <small>Certificate ID</small>
                  <input
                    value={adding.id}
                    onChange={(e) => setAdding((s) => ({ ...s, id: e.target.value }))}
                    placeholder="CERT-ABC123"
                  />
                </label>

                <label className="form-group">
                  <small>Recipient Name</small>
                  <input
                    value={adding.name}
                    onChange={(e) => setAdding((s) => ({ ...s, name: e.target.value }))}
                    placeholder="Enter recipient name"
                  />
                </label>

                <div className="form-row">
                  <label className="form-group">
                    <small>Issued On</small>
                    <input
                      type="date"
                      value={adding.issued}
                      onChange={(e) => setAdding((s) => ({ ...s, issued: e.target.value }))}
                    />
                  </label>

                  <label className="form-group">
                    <small>Status</small>
                    <select
                      value={adding.status}
                      onChange={(e) => setAdding((s) => ({ ...s, status: e.target.value }))}
                    >
                      <option>Issued</option>
                      <option>Pending</option>
                      <option>Revoked</option>
                    </select>
                  </label>
                </div>

                <div className="modal-actions">
                  <button className="btn secondary" onClick={() => setShowAdd(false)}>
                    Cancel
                  </button>
                  <button className="btn primary" onClick={handleAddSave}>
                    Add Certificate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}