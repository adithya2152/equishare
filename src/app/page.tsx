import React from 'react';
import Link from 'next/link';
import "@/app/styles/main.css"

export default function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">Equishare</div>
        <nav className="nav-buttons">
          <Link href="/login" className="nav-button">Login</Link>
          <Link href={"/register"} className="nav-button register-button">Register</Link>
        </nav>
      </header>
      <main className="home-main">
        <h1 className="main-title">Welcome to Equishare</h1>
        <p className="main-subtitle">Your ultimate expense tracker</p>
        <section className="content-section">
          <h2 className="section-title">Why Choose Equishare?</h2>
          <p className="section-content">
            Equishare is designed to help you manage and track your expenses effortlessly. 
            With our user-friendly interface and powerful features, you can keep an eye on your finances, 
            set budgets, and achieve your financial goals.
          </p>
        </section>
        <section className="content-section">
          <h2 className="section-title">Features</h2>
          <ul className="feature-list">
            <li className="feature-item">Real-time expense tracking</li>
            <li className="feature-item">Customizable categories</li>
            <li className="feature-item">Monthly and yearly reports</li>
            <li className="feature-item">Secure and private</li>
          </ul>
        </section>
        <section className="content-section">
          <h2 className="section-title">Get Started Today</h2>
          <p className="section-content">
            Join Equishare now and take control of your finances. Sign up for free and start tracking your expenses easily!
          </p>
        </section>
      </main>
    </div>
  );
}
