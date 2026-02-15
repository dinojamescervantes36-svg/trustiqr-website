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
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

export default function ManageTemplates() {
  const router = useRouter();

  const [templates, setTemplates] = useState([
    { id: 1, name: "Academic Degree" },
    { id: 2, name: "Course Completion" },
    { id: 3, name: "Employee ID" },
  ]);

  const handleEdit = (id) => {
    alert(`Edit template with ID: ${id}`);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this template?")) {
      setTemplates(templates.filter((t) => t.id !== id));
    }
  };

  const handleAddNew = () => {
    const name = prompt("Enter new template name:");
    if (name) {
      const newTemplate = {
        id: templates.length ? templates[templates.length - 1].id + 1 : 1,
        name,
      };
      setTemplates([...templates, newTemplate]);
    }
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
          <li onClick={() => router.push("/dashboard/create")}>
            <FiFilePlus /> Create New Certificates
          </li>
          <li onClick={() => router.push("/dashboard/verify")}>
            <FiCheckCircle /> Verify Certificate
          </li>
          <li className="active">
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
        <div className="create-navbar">
          <div className="create-navbar-left">
            <h1>Manage Certificate Templates</h1>
          </div>

          <div className="create-navbar-right">
            <button className="primary small-btn" onClick={handleAddNew}>
              Add New Template
            </button>
          </div>
        </div>

        <div className="template-grid">
          {templates.map((template) => (
            <div key={template.id} className="card template-card">
              <h3>{template.name}</h3>
              <div className="template-actions">
                <button onClick={() => handleEdit(template.id)}>
                  <FiEdit /> Edit
                </button>
                <button onClick={() => handleDelete(template.id)}>
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
          {templates.length === 0 && <p>No templates available.</p>}
        </div>
      </main>
    </div>
  );
}
