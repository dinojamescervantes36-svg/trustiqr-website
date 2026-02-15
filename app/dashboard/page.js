"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Doughnut } from "react-chartjs-2";

import {
  FiHome,
  FiFilePlus,
  FiCheckCircle,
  FiUsers,
  FiLayers,
  FiSettings,
  FiUpload,
  FiCamera,
  FiActivity,
  FiAward,
} from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push("/");
      else setUser(currentUser);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (!user) return <div style={{ padding: 40 }}>Loading...</div>;

  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Certificates Issued",
        data: [10, 20, 15, 25, 18, 30],
        borderColor: "#1e8e3e",
        backgroundColor: "rgba(30,142,62,0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const doughnutData = {
    labels: ["Issued", "Pending", "Fraud"],
    datasets: [
      {
        data: [1245, 87, 3],
        backgroundColor: ["#1e8e3e", "#3b82f6", "#ef4444"],
        borderWidth: 0,
      },
    ],
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
          <li
            onClick={() => router.push("/dashboard")}
            className={pathname === "/dashboard" ? "active" : ""}
            style={{ cursor: "pointer" }}
          >
            <FiHome /> Dashboard
          </li>

          <li
            onClick={() => router.push("/dashboard/create")}
            className={pathname === "/dashboard/create" ? "active" : ""}
            style={{ cursor: "pointer" }}
          >
            <FiFilePlus /> Create Certificates
          </li>

          <li
            onClick={() => router.push("/dashboard/verify")}
            className={pathname === "/dashboard/verify" ? "active" : ""}
            style={{ cursor: "pointer" }}
          >
            <FiCheckCircle /> Verify Certificate
          </li>

          <li
            onClick={() => router.push("/dashboard/templates")}
            className={pathname === "/dashboard/templates" ? "active" : ""}
            style={{ cursor: "pointer" }}
          >
            <FiLayers /> Manage Templates
          </li>

          <li
            onClick={() => router.push("/dashboard/users")}
            className={pathname === "/dashboard/users" ? "active" : ""}
            style={{ cursor: "pointer" }}
          >
            <FiUsers /> User Accounts
          </li>

          <li
            onClick={() => router.push("/dashboard/settings")}
            className={pathname === "/dashboard/settings" ? "active" : ""}
            style={{ cursor: "pointer" }}
          >
            <FiSettings /> Settings
          </li>
        </ul>
      </aside>

      {/* Main */}
      <main className="main">
        <div className="topbar">
          <h1>Welcome, {user.email}</h1>
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Overview */}
        <div className="overview">
          <div className="card">
            <h3>Overview Analytics</h3>
            <div className="chart-sm">
              <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="card actions">
            <button
              className="primary"
              onClick={() => router.push("/dashboard/create")}
            >
              <FiFilePlus /> Issue New Certificate
            </button>
            <button
              className="secondary"
              onClick={() => router.push("/dashboard/verify")}
            >
              <FiCamera /> Scan to Verify
            </button>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid">
          <div className="card">
            <h3>Issuance Trends</h3>
            <div className="chart-md">
              <Line data={lineData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="card">
            <h3>Recent Activity</h3>
            <div className="activity">
              <p><FiAward /> Issued Degree Certificate</p>
              <p><FiCheckCircle /> Verified Course Completion</p>
              <p><FiUsers /> Employee ID Created</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom-grid">
          <div className="card">
            <h3>Quick Verify</h3>
            <div className="verify-box">
              <FiUpload size={22} />
              <p>Drag & Drop PDF or Click to Upload</p>
            </div>
            <button
              className="secondary"
              onClick={() => router.push("/dashboard/verify")}
            >
              <FiCamera /> Scan QR Code
            </button>
          </div>

          <div className="card">
            <h3>Certificate Templates</h3>
            <div className="templates">
              <div className="template">
                <FiAward size={28} />
                <p>Academic Degree</p>
              </div>
              <div className="template">
                <FiAward size={28} />
                <p>Course Completion</p>
              </div>
              <div className="template">
                <FiAward size={28} />
                <p>Employee ID</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}