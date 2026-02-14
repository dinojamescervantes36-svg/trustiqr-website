"use client";

import Head from "next/head";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>TrustiQR - Home</title>
        <link rel="stylesheet" href="style.css" />
      </Head>

      {/* NAVBAR */}
      <nav className="navbar">
        <a className="logo">
          <img src="img/logo.png" alt="TrustiQR Logo" />
          TrustiQR
        </a>

        <div className="nav-right">
          <ul>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>

          <button className="btn" onClick={handleLoginClick}>
            Log in
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <h1>Simple & Secure Certificate Verification with QR Codes</h1>
          <p>
            Easily verify academic and training certificates by scanning secure QR codes.
          </p>

          <div className="hero-buttons">
            <a href="#features" className="btn-primary">
              Get Started
            </a>
            <a href="#contact" className="btn-secondary">
              Request a Demo
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features">
        <h2 className="features-title">Trusted Digital Verification</h2>

        <div className="feature-cards">
          <div className="feature-card">
            <img
              src="img1/Prevent Certificate Fraud.jpg"
              alt="Prevent Certificate Fraud"
            />
            <h3>Prevent Certificate Fraud</h3>
            <p>Ensure your certificates are authentic and secure.</p>
          </div>

          <div className="feature-card">
            <img
              src="img1/Instantly Verify QR Codes.jpg"
              alt="Instant QR Verification"
            />
            <h3>Instantly Verify QR Codes</h3>
            <p>Scan and verify QR codes instantly.</p>
          </div>

          <div className="feature-card">
            <img
              src="img1/Build Trust & Credibility.jpg"
              alt="Build Trust"
            />
            <h3>Build Trust & Credibility</h3>
            <p>Enhance your institution’s credibility.</p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about">
        <h2>About TrustiQR</h2>
        <p>
          TrustiQR provides secure and reliable digital certificate verification
          using QR code technology.
        </p>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact">
        <h2>Contact Us</h2>
        <p>Email: support@trustiQR.com</p>

        <div className="social-icons">
          <i className="fa-brands fa-facebook"></i>
          <i className="fa-brands fa-github"></i>
        </div>
      </section>
    </>
  );
}
