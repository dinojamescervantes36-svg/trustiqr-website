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
} from "react-icons/fi";

export default function SettingsPage() {
  const router = useRouter();

  const [settings, setSettings] = useState({
    darkMode: false,
    emailAlerts: true,
    multiUser: true,
    roleAccess: false,
    securityLock: true,
  });

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
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
          <li onClick={() => router.push("/dashboard/templates")}>
            <FiLayers /> Manage Templates
          </li>
          <li onClick={() => router.push("/dashboard/users")}>
            <FiUsers /> User Accounts
          </li>
          <li className="active">
            <FiSettings /> Settings
          </li>
        </ul>
      </aside>

      {/* MAIN */}
      <main className="main">
        <div className="create-navbar">
          <h1>System Settings</h1>
        </div>

        {/* SETTINGS GRID */}
        <div className="settings-grid">

          {/* Appearance */}
          <div className="card settings-card">
            <h3>Application Appearance</h3>
            <div className="setting-row">
              <span>Light Theme</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={() => toggleSetting("darkMode")}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          {/* Notifications */}
          <div className="card settings-card">
            <h3>Notifications</h3>
            <div className="setting-row">
              <span>Email Alerts</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.emailAlerts}
                  onChange={() => toggleSetting("emailAlerts")}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          {/* Security */}
          <div className="card settings-card">
            <h3>Security & Access</h3>
            <div className="setting-row">
              <span>Security Lock</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.securityLock}
                  onChange={() => toggleSetting("securityLock")}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          {/* Roles */}
          <div className="card settings-card">
            <h3>User Permissions</h3>
            <div className="setting-row">
              <span>Multi User</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.multiUser}
                  onChange={() => toggleSetting("multiUser")}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-row">
              <span>Role Access</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.roleAccess}
                  onChange={() => toggleSetting("roleAccess")}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
