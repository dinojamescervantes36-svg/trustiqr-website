"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
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
import jsQR from "jsqr";

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

  // Certificates list starts empty — user adds their own entries
  const [certificates, setCertificates] = useState([]);

  // File upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);

  // Add certificate form state (manual entry)
  const [form, setForm] = useState({
    id: "",
    recipient: "",
    date: new Date().toISOString().slice(0, 10),
    status: "issued",
    summary: "",
  });

  // Camera / scan state
  const [cameraOpen, setCameraOpen] = useState(false);
  const [scannedImage, setScannedImage] = useState(null);
  const [decodedQR, setDecodedQR] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const addCertificate = (cert) => {
    setCertificates((p) => [...p, cert]);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submitForm = (e) => {
    e.preventDefault();
    const cert = {
      id: form.id || `manual-${Date.now()}`,
      recipient: form.recipient || "Unknown",
      date: form.date || new Date().toISOString().slice(0, 10),
      status: form.status || "issued",
      summary: form.summary || `Certificate ${form.id || ""}`.trim(),
    };
    addCertificate(cert);
    setForm({
      id: "",
      recipient: "",
      date: new Date().toISOString().slice(0, 10),
      status: "issued",
      summary: "",
    });
  };

  // derived chart data from user-provided certificates
  const overviewTotals = useMemo(() => {
    const totals = { issued: 0, pending: 0, fraud: 0 };
    certificates.forEach((c) => {
      if (c.status === "issued") totals.issued++;
      else if (c.status === "pending") totals.pending++;
      else if (c.status === "fraud") totals.fraud++;
    });
    return totals;
  }, [certificates]);

  const lineData = useMemo(() => {
    // last 14 days labels
    const map = {};
    const labels = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      labels.push(dateStr.slice(5));
      map[dateStr] = 0;
    }
    certificates.forEach((c) => {
      if (c.status === "issued" && map[c.date] !== undefined) map[c.date] += 1;
    });
    return {
      labels,
      datasets: [
        {
          label: "Issued (last 14 days)",
          data: Object.values(map),
          borderColor: "#1e8e3e",
          backgroundColor: "rgba(30,142,62,0.08)",
          tension: 0.3,
          fill: true,
        },
      ],
    };
  }, [certificates]);

  const doughnutData = useMemo(() => {
    return {
      labels: ["Issued", "Pending", "Fraud"],
      datasets: [
        {
          data: [overviewTotals.issued, overviewTotals.pending, overviewTotals.fraud],
          backgroundColor: ["#1e8e3e", "#3b82f6", "#ef4444"],
          borderWidth: 0,
        },
      ],
    };
  }, [overviewTotals]);

  // Auth + profile load
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
        ...snap.data(),
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  // File upload handlers
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadedFile(f);
    const reader = new FileReader();
    reader.onload = () => {
      setUploadPreview(reader.result);
      // auto-create a minimal certificate entry from the file
      const cert = {
        id: f.name || `file-${Date.now()}`,
        recipient: "",
        date: new Date().toISOString().slice(0, 10),
        status: "issued",
        summary: `Uploaded file: ${f.name}`,
      };
      addCertificate(cert);
    };
    reader.readAsDataURL(f);
  };

  // Camera handlers (safe guard added)
  const startCamera = useCallback(async () => {
    // Guard: navigator or mediaDevices may be undefined (insecure context or older browsers)
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      alert("Camera not available in this environment.");
      return;
    }
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") {
      alert(
        "Camera access is not available. Ensure you're on HTTPS or localhost and your browser supports camera access."
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOpen(true);
    } catch (err) {
      console.error("Camera error", err);
      alert("Unable to access camera. Make sure you granted permission and are on HTTPS/localhost.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    setCameraOpen(false);
  }, []);

  const capturePhoto = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setScannedImage(dataUrl);

    // decode QR using jsQR
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);
      if (code && code.data) {
        setDecodedQR(code.data);
        stopCamera();
        router.push(`/dashboard/verify?qr=${encodeURIComponent(code.data)}`);
        return;
      } else {
        alert("No QR code detected in the capture. Try again.");
      }
    } catch (err) {
      console.error("QR decode error", err);
    }

    stopCamera();
  }, [stopCamera, router]);

  // Loading guard placed after hooks (hook order fixed)
  if (loading) {
    return <div style={{ padding: 40 }}>Loading dashboard...</div>;
  }

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
          <h1>Welcome, {user?.name || user?.email || "User"}!</h1>
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Overview */}
        <div className="overview">
          <div className="card">
            <h3>Overview Analytics</h3>
            <div style={{ height: 160 }} className="chart-sm">
              <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
            </div>
            <div style={{ marginTop: 10 }}>
              <strong>Issued:</strong> {overviewTotals.issued} &nbsp;|&nbsp;
              <strong>Pending:</strong> {overviewTotals.pending}
            </div>
            {decodedQR && (
              <div style={{ marginTop: 8, color: "#064e3b" }}>
                <strong>Last scan:</strong> {decodedQR}
              </div>
            )}
          </div>

          <div className="card actions">
            <label className="primary" style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <FiUpload />
              Issue New Certificate (Upload)
              <input type="file" accept="image/*,application/pdf" style={{ display: "none" }} onChange={handleFileChange} />
            </label>

            <button
              className="secondary"
              onClick={() => {
                startCamera();
              }}
            >
              <FiCamera /> Scan to Verify
            </button>

            {uploadedFile && (
              <div style={{ marginTop: 10 }}>
                <strong>Selected:</strong> {uploadedFile.name}
                {uploadPreview && (
                  <div style={{ marginTop: 8 }}>
                    <img src={uploadPreview} alt="preview" style={{ maxWidth: 200 }} />
                  </div>
                )}
              </div>
            )}
            {scannedImage && (
              <div style={{ marginTop: 10 }}>
                <strong>Captured Image:</strong>
                <div style={{ marginTop: 8 }}>
                  <img src={scannedImage} alt="captured" style={{ maxWidth: 240 }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Manual add form */}
        <div style={{ margin: "16px 0" }} className="card">
          <h4>Add Certificate (manual)</h4>
          <form onSubmit={submitForm} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <input name="id" placeholder="Certificate ID" value={form.id} onChange={handleFormChange} />
            <input name="recipient" placeholder="Recipient name" value={form.recipient} onChange={handleFormChange} />
            <input type="date" name="date" value={form.date} onChange={handleFormChange} />
            <select name="status" value={form.status} onChange={handleFormChange}>
              <option value="issued">Issued</option>
              <option value="pending">Pending</option>
              <option value="fraud">Fraud</option>
            </select>
            <input name="summary" placeholder="Summary" value={form.summary} onChange={handleFormChange} style={{ gridColumn: "1 / -1" }} />
            <div style={{ gridColumn: "1 / -1", textAlign: "right" }}>
              <button type="submit" className="primary">Add Certificate</button>
            </div>
          </form>
        </div>

        {/* Middle */}
        <div className="grid">
          <div className="card">
            <h3>Issuance Trends</h3>
            <div style={{ height: 260 }} className="chart-md">
              <Line data={lineData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </div>

          <div className="card">
            <h3>Recent Activity</h3>
            <div style={{ maxHeight: 260, overflow: "auto" }}>
              {certificates
                .slice()
                .reverse()
                .slice(0, 10)
                .map((c) => (
                  <div key={c.id + (c.date || "")} style={{ padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    <div style={{ fontSize: 13, color: "#333" }}>{c.summary || c.recipient || c.id}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      {c.date || "—"} — <strong style={{ color: c.status === "issued" ? "#1e8e3e" : c.status === "pending" ? "#3b82f6" : "#ef4444" }}>{c.status}</strong>
                    </div>
                  </div>
                ))}
              {certificates.length === 0 && <div style={{ color: "#666", padding: 12 }}>No certificates yet — add one above.</div>}
            </div>
          </div>
        </div>
      </main>

      {/* Camera Modal */}
      {cameraOpen && (
        <div
          className="camera-modal"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
          }}
        >
          <div style={{ width: "92%", maxWidth: 720, background: "#fff", borderRadius: 8, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h4 style={{ margin: 0 }}>Scan QR / Capture</h4>
              <div>
                <button onClick={capturePhoto} className="primary" style={{ marginRight: 8 }}>
                  Capture
                </button>
                <button onClick={stopCamera} className="secondary">
                  Close
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <video ref={videoRef} style={{ width: "100%", borderRadius: 6, background: "#000" }} playsInline />
              </div>
              <div style={{ width: 240 }}>
                <canvas ref={canvasRef} style={{ width: "100%", borderRadius: 6, background: "#f6f6f6" }} />
                <div style={{ marginTop: 8 }}>
                  <small>Captured preview will appear here after you press Capture.</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}