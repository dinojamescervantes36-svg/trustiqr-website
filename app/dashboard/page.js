"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // 🔐 Load Auth + Firestore profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.replace("/");
        return;
      }

      const snap = await getDoc(doc(db, "users", firebaseUser.uid));

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        ...snap.data(), // name, institution, role, etc.
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading) return <div style={{ padding: 40 }}>Loading dashboard...</div>;

  // 📊 Chart data
  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Certificates Issued",
        data: [],
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
        data: [0, 0, 0],
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
          <li onClick={() => router.push("/dashboard")} className={pathname === "/dashboard" ? "active" : ""}>
            <FiHome /> Dashboard
          </li>

          <li onClick={() => router.push("/dashboard/create")} className={pathname === "/dashboard/create" ? "active" : ""}>
            <FiFilePlus /> Create Certificates
          </li>

          <li onClick={() => router.push("/dashboard/verify")} className={pathname === "/dashboard/verify" ? "active" : ""}>
            <FiCheckCircle /> Verify Certificate
          </li>

          <li onClick={() => router.push("/dashboard/templates")} className={pathname === "/dashboard/templates" ? "active" : ""}>
            <FiLayers /> Manage Templates
          </li>

          <li onClick={() => router.push("/dashboard/users")} className={pathname === "/dashboard/users" ? "active" : ""}>
            <FiUsers /> User Accounts
          </li>

          <li onClick={() => router.push("/dashboard/settings")} className={pathname === "/dashboard/settings" ? "active" : ""}>
            <FiSettings /> Settings
          </li>
        </ul>
      </aside>

      {/* Main */}
      <main className="main">
        <div className="topbar">
          <h1>Welcome, {user.name}!</h1>
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
            <button className="primary" onClick={() => router.push("/dashboard/create")}>
              <FiFilePlus /> Issue New Certificate
            </button>
            <button className="secondary" onClick={() => router.push("/dashboard/verify")}>
              <FiCamera /> Scan to Verify
            </button>
          </div>
        </div>

        {/* Middle */}
        <div className="grid">
          <div className="card">
            <h3>Issuance Trends</h3>
            <div className="chart-md">
              <Line data={lineData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="card">
            <h3>Recent Activity</h3>
            <p><FiAward /> Issued Degree Certificate</p>
            <p><FiCheckCircle /> Verified Course Completion</p>
            <p><FiUsers /> Employee ID Created</p>
          </div>
        </div>
      </main>
    </div>
  );
}
