import { useState, useEffect, useRef } from "react";

const MAROON = "#6B1B2A";
const MAROON_DARK = "#4A1018";
const MAROON_LIGHT = "#8B2535";
const WHITE = "#FFFFFF";
const OFF_WHITE = "#FAF8F8";
const LIGHT_GRAY = "#F3F0F0";
const BORDER = "#E0D8D8";
const TEXT_MUTED = "#8A7070";

const INITIAL_DATA = {
  users: [
    { id: "u1", name: "Ayoola Akinlawon", email: "ahmedakinlawon06@gmail.com", role: "superadmin", orgId: null, password: "admin123", major: "Senior Accounting" }
  ],
  orgs: [
    { id: "org1", name: "Pre-Alumni Association", adminId: "u1", description: "AAMU Pre-Alumni Association — preparing future alumni for lifelong engagement." }
  ],
  events: [
    { id: "ev1", orgId: "org1", name: "Fall Kickoff Meeting", date: "2025-09-05", type: "event", description: "Welcome back meeting for all members.", createdBy: "u1" },
    { id: "ev2", orgId: "org1", name: "Community Garden Cleanup", date: "2025-09-12", type: "volunteer", description: "2-hour volunteer cleanup in partnership with Huntsville Parks.", hours: 2, createdBy: "u1" }
  ],
  logs: [],
  nextId: 100
};

function loadData() {
  try {
    const raw = localStorage.getItem("aamu_rso_data");
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_DATA;
}
function saveData(d) {
  try { localStorage.setItem("aamu_rso_data", JSON.stringify(d)); } catch {}
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: ${OFF_WHITE}; color: #1a1a1a; min-height: 100vh; }
.dark body { background: #0f0a0b; color: #f0ecec; }

/* NAV */
.nav { background: ${MAROON}; color: ${WHITE}; padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; height: 64px; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 8px rgba(107,27,42,0.25); }
.nav-logo { display: flex; align-items: center; gap: 12px; font-size: 18px; font-weight: 700; font-family: 'Playfair Display', serif; color: ${WHITE}; }
.nav-logo img { width: 36px; height: 36px; border-radius: 6px; }
.nav-links { display: flex; gap: 6px; align-items: center; }
.nav-link { color: rgba(255,255,255,0.82); background: none; border: none; cursor: pointer; padding: 8px 14px; border-radius: 8px; font-size: 14px; font-weight: 500; transition: all 0.18s; }
.nav-link:hover, .nav-link.active { color: ${WHITE}; background: rgba(255,255,255,0.14); }
.nav-btn { background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.28); color: ${WHITE}; padding: 7px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.18s; }
.nav-btn:hover { background: rgba(255,255,255,0.24); }
.nav-right { display: flex; align-items: center; gap: 10px; }

/* HERO */
.hero { background: linear-gradient(135deg, ${MAROON_DARK} 0%, ${MAROON} 60%, ${MAROON_LIGHT} 100%); color: ${WHITE}; padding: 90px 2rem 80px; text-align: center; position: relative; overflow: hidden; }
.hero::before { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
.hero-content { position: relative; max-width: 720px; margin: 0 auto; }
.hero-badge { display: inline-block; background: rgba(255,255,255,0.16); border: 1px solid rgba(255,255,255,0.28); border-radius: 20px; padding: 5px 16px; font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 20px; }
.hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 700; line-height: 1.2; margin-bottom: 20px; }
.hero p { font-size: 17px; line-height: 1.7; color: rgba(255,255,255,0.82); max-width: 560px; margin: 0 auto 36px; }
.hero-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.btn-primary { background: ${WHITE}; color: ${MAROON}; border: none; padding: 13px 28px; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.18s; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.18); }
.btn-outline { background: transparent; color: ${WHITE}; border: 2px solid rgba(255,255,255,0.55); padding: 13px 28px; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.18s; }
.btn-outline:hover { border-color: ${WHITE}; background: rgba(255,255,255,0.1); }

/* SECTIONS */
.section { padding: 72px 2rem; max-width: 1100px; margin: 0 auto; }
.section-title { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: ${MAROON}; margin-bottom: 10px; }
.section-sub { color: ${TEXT_MUTED}; font-size: 16px; margin-bottom: 44px; max-width: 560px; }

/* CARDS */
.card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 22px; }
.card { background: ${WHITE}; border: 1px solid ${BORDER}; border-radius: 14px; padding: 28px; transition: all 0.2s; }
.card:hover { box-shadow: 0 6px 24px rgba(107,27,42,0.1); transform: translateY(-3px); }
.card-icon { width: 48px; height: 48px; border-radius: 12px; background: #FAF0F2; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; font-size: 22px; }
.card h3 { font-size: 17px; font-weight: 700; margin-bottom: 8px; color: #1a1a1a; }
.card p { font-size: 14px; color: ${TEXT_MUTED}; line-height: 1.65; }

/* STATS ROW */
.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 18px; margin-bottom: 48px; }
.stat-card { background: ${WHITE}; border: 1px solid ${BORDER}; border-radius: 12px; padding: 20px 22px; text-align: center; }
.stat-num { font-size: 2rem; font-weight: 700; color: ${MAROON}; }
.stat-label { font-size: 13px; color: ${TEXT_MUTED}; margin-top: 4px; }

/* FORMS */
.form-wrap { background: ${WHITE}; border: 1px solid ${BORDER}; border-radius: 16px; padding: 36px; max-width: 520px; margin: 0 auto; }
.form-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; color: ${MAROON}; margin-bottom: 6px; }
.form-sub { font-size: 14px; color: ${TEXT_MUTED}; margin-bottom: 28px; }
.form-group { margin-bottom: 18px; }
.form-group label { display: block; font-size: 13px; font-weight: 600; color: #444; margin-bottom: 7px; }
.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 11px 14px; border: 1.5px solid ${BORDER}; border-radius: 9px; font-size: 14px; font-family: 'Inter', sans-serif; transition: border 0.18s; outline: none; background: ${OFF_WHITE}; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: ${MAROON}; background: ${WHITE}; }
.form-group textarea { resize: vertical; min-height: 100px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.btn-full { width: 100%; background: ${MAROON}; color: ${WHITE}; border: none; padding: 13px; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.18s; margin-top: 8px; }
.btn-full:hover { background: ${MAROON_DARK}; transform: translateY(-1px); }
.form-switch { text-align: center; margin-top: 18px; font-size: 14px; color: ${TEXT_MUTED}; }
.form-switch a { color: ${MAROON}; cursor: pointer; font-weight: 600; text-decoration: none; }
.form-switch a:hover { text-decoration: underline; }
.error-msg { background: #FEF2F2; border: 1px solid #FECACA; color: #991B1B; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
.success-msg { background: #F0FDF4; border: 1px solid #BBF7D0; color: #166534; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }

/* TABLE */
.table-wrap { background: ${WHITE}; border: 1px solid ${BORDER}; border-radius: 14px; overflow: hidden; }
table { width: 100%; border-collapse: collapse; }
thead { background: #FAF0F2; }
th { text-align: left; padding: 14px 18px; font-size: 12px; font-weight: 700; color: ${MAROON}; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid ${BORDER}; }
td { padding: 14px 18px; font-size: 14px; border-bottom: 1px solid ${LIGHT_GRAY}; vertical-align: middle; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: #FAF8F8; }

/* BADGES */
.badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.badge-event { background: #EFF6FF; color: #1D4ED8; }
.badge-volunteer { background: #F0FDF4; color: #15803D; }
.badge-present { background: #F0FDF4; color: #15803D; }
.badge-superadmin { background: #FAF0F2; color: ${MAROON}; }
.badge-orgadmin { background: #FEF9C3; color: #92400E; }
.badge-student { background: #F1F5F9; color: #475569; }

/* TABS */
.tabs { display: flex; gap: 4px; background: ${LIGHT_GRAY}; padding: 5px; border-radius: 11px; margin-bottom: 28px; }
.tab { flex: 1; padding: 9px 16px; border: none; border-radius: 8px; background: none; cursor: pointer; font-size: 14px; font-weight: 500; color: ${TEXT_MUTED}; transition: all 0.18s; text-align: center; }
.tab.active { background: ${WHITE}; color: ${MAROON}; font-weight: 700; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }

/* DASHBOARD NAV */
.dash-nav { background: ${WHITE}; border-right: 1px solid ${BORDER}; width: 220px; min-height: calc(100vh - 64px); padding: 24px 14px; position: fixed; left: 0; top: 64px; }
.dash-main { margin-left: 220px; padding: 36px 40px; min-height: calc(100vh - 64px); }
.dash-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 9px; cursor: pointer; font-size: 14px; font-weight: 500; color: #555; transition: all 0.18s; margin-bottom: 2px; border: none; background: none; width: 100%; text-align: left; }
.dash-nav-item:hover { background: #FAF0F2; color: ${MAROON}; }
.dash-nav-item.active { background: #FAF0F2; color: ${MAROON}; font-weight: 700; }
.dash-nav-section { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: ${TEXT_MUTED}; padding: 12px 14px 6px; }

/* MISC */
.page-title { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 700; color: ${MAROON}; margin-bottom: 6px; }
.page-sub { font-size: 15px; color: ${TEXT_MUTED}; margin-bottom: 32px; }
.btn-sm { padding: 7px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.18s; }
.btn-maroon { background: ${MAROON}; color: ${WHITE}; }
.btn-maroon:hover { background: ${MAROON_DARK}; }
.btn-ghost { background: ${LIGHT_GRAY}; color: #444; }
.btn-ghost:hover { background: ${BORDER}; }
.btn-danger { background: #FEF2F2; color: #991B1B; }
.btn-danger:hover { background: #FECACA; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: ${WHITE}; border-radius: 16px; padding: 32px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; }
.modal-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; color: ${MAROON}; margin-bottom: 22px; }
.checkin-card { background: ${WHITE}; border: 1px solid ${BORDER}; border-radius: 12px; padding: 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
.checkin-card:hover { border-color: ${MAROON_LIGHT}; }
.upload-area { border: 2px dashed ${BORDER}; border-radius: 10px; padding: 28px; text-align: center; cursor: pointer; transition: all 0.18s; }
.upload-area:hover { border-color: ${MAROON}; background: #FAF0F2; }
.upload-area p { font-size: 14px; color: ${TEXT_MUTED}; margin-top: 8px; }
.contact-info { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-bottom: 1px solid ${LIGHT_GRAY}; }
.contact-info:last-child { border-bottom: none; }
.contact-icon { width: 38px; height: 38px; border-radius: 10px; background: #FAF0F2; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.role-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: #FAF0F2; color: ${MAROON}; }
@media (max-width: 768px) {
  .dash-nav { display: none; }
  .dash-main { margin-left: 0; padding: 20px; }
  .form-row { grid-template-columns: 1fr; }
  .hero h1 { font-size: 1.8rem; }
}
`;

// ===================== COMPONENTS =====================

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div className="modal-title" style={{ margin: 0 }}>{title}</div>
          <button onClick={onClose} className="btn-sm btn-ghost" style={{ fontSize: 18, padding: "4px 10px" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Navbar({ page, setPage, user, onLogout, onLogin }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="nav">
      <div className="nav-logo">
        <img src="/api/placeholder/36/36" alt="AAMU" style={{ background: WHITE, padding: 2 }} />
        RSO Tracker
      </div>
      <div className="nav-links" style={{ display: "flex" }}>
        {["home", "about", "services", "contact"].map(p => (
          <button key={p} className={`nav-link ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
        {user && (
          <button className={`nav-link ${page === "dashboard" ? "active" : ""}`} onClick={() => setPage("dashboard")}>
            Dashboard
          </button>
        )}
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>Hi, {user.name.split(" ")[0]}</span>
            <button className="nav-btn" onClick={onLogout}>Sign out</button>
          </>
        ) : (
          <>
            <button className="nav-btn" onClick={() => onLogin("login")}>Sign in</button>
            <button className="nav-btn" style={{ background: WHITE, color: MAROON }} onClick={() => onLogin("signup")}>Join</button>
          </>
        )}
      </div>
    </nav>
  );
}

// ===================== PAGES =====================

function HomePage({ setPage, user, onLogin }) {
  return (
    <div>
      <div className="hero">
        <div className="hero-content">
          <div className="hero-badge">Alabama A&M University</div>
          <h1>Track Every Meeting.<br />Log Every Hour.</h1>
          <p>The official attendance and volunteer experience platform for AAMU Registered Student Organizations — built to help you prove your involvement.</p>
          <div className="hero-btns">
            {user ? (
              <button className="btn-primary" onClick={() => setPage("dashboard")}>Go to Dashboard →</button>
            ) : (
              <>
                <button className="btn-primary" onClick={() => onLogin("signup")}>Get Started Free</button>
                <button className="btn-outline" onClick={() => setPage("about")}>Learn More</button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="section">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-title" style={{ textAlign: "center" }}>Why RSO Tracker?</div>
          <p className="section-sub" style={{ textAlign: "center", margin: "0 auto" }}>
            Everything your organization needs to track participation and build a verifiable record of service.
          </p>
        </div>
        <div className="card-grid">
          {[
            { icon: "📋", title: "Event Attendance", desc: "Members check in to events in seconds. Admins get a full attendance log instantly." },
            { icon: "🤝", title: "Volunteer Logging", desc: "Track volunteer hours with optional proof uploads. Build a portfolio of service." },
            { icon: "📊", title: "Org Analytics", desc: "See participation trends, top contributors, and total hours at a glance." },
            { icon: "🔒", title: "Role-Based Access", desc: "Super admin, org admin, and student roles — each with the right level of control." },
            { icon: "📁", title: "Proof of Participation", desc: "Upload images from events. Your involvement is documented and downloadable." },
            { icon: "🏫", title: "Built for AAMU", desc: "Designed specifically for Pre-Alumni Association and future AAMU student orgs." }
          ].map((f, i) => (
            <div className="card" key={i}>
              <div className="card-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: MAROON, color: WHITE, padding: "64px 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", fontWeight: 700, marginBottom: 14 }}>
            Start with Pre-Alumni Association
          </div>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
            We're launching with AAMU's Pre-Alumni Association as our pilot organization. Join now to be part of the first class of tracked members.
          </p>
          {!user && <button className="btn-primary" onClick={() => onLogin("signup")}>Create Your Account</button>}
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="section" style={{ maxWidth: 820 }}>
      <div className="section-title">About RSO Tracker</div>
      <p className="section-sub">Built for Alabama A&M student organizations — by a student who understands the need.</p>

      <div style={{ display: "grid", gap: 32 }}>
        <div className="card" style={{ padding: "32px 36px" }}>
          <h3 style={{ fontSize: 20, marginBottom: 14 }}>The Problem We're Solving</h3>
          <p style={{ lineHeight: 1.8, color: "#444" }}>Student organizations at AAMU have no easy way to track who attended events, how many volunteer hours members logged, or to produce verifiable proof of participation — whether for scholarships, resumes, or award nominations. RSO Tracker fixes that.</p>
        </div>

        <div className="card" style={{ padding: "32px 36px" }}>
          <h3 style={{ fontSize: 20, marginBottom: 14 }}>How It Works</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginTop: 10 }}>
            {[["1. Sign Up", "Students create an account with their name and AAMU email."],
              ["2. Join an Org", "Admins add members to their registered student organization."],
              ["3. Check In", "Attend events and log volunteer hours directly from your dashboard."],
              ["4. Build Your Record", "Download your full participation history anytime."]
            ].map(([t, d]) => (
              <div key={t} style={{ padding: 16, background: OFF_WHITE, borderRadius: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: MAROON, marginBottom: 6 }}>{t}</div>
                <div style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: "32px 36px" }}>
          <h3 style={{ fontSize: 20, marginBottom: 14 }}>Our Vision</h3>
          <p style={{ lineHeight: 1.8, color: "#444" }}>We're starting with the Pre-Alumni Association as a pilot. The goal is to scale this to every RSO on AAMU's campus — giving every student organization a free, professional platform to manage participation and prove their members' dedication.</p>
        </div>
      </div>
    </div>
  );
}

function ServicesPage() {
  return (
    <div className="section">
      <div className="section-title">What RSO Tracker Offers</div>
      <p className="section-sub">Every feature you need to run a well-documented student organization.</p>

      <div style={{ display: "grid", gap: 24 }}>
        {[
          { icon: "📋", title: "Event Attendance Tracking", for: "Students & Admins", points: ["Self check-in by students", "Admin check-in on behalf of members", "Real-time attendance view", "Downloadable attendance sheets"] },
          { icon: "🤝", title: "Volunteer Hour Logging", for: "Students", points: ["Log hours for any volunteer activity", "Add event name, date, and description", "Upload photo proof of participation", "Hours aggregate to a total in your profile"] },
          { icon: "👥", title: "Organization Management", for: "Org Admins", points: ["Manage your org's member roster", "Create and schedule events", "View all logs for your org", "Export records for reports"] },
          { icon: "🛡️", title: "Super Admin Panel", for: "Platform Admin", points: ["Manage all organizations on the platform", "Add or remove org admins", "Full visibility across all orgs", "Platform-wide analytics"] },
          { icon: "📁", title: "Proof Uploads", for: "All Users", points: ["Upload photos from events", "Attached to your personal log", "Stored securely per submission", "Accessible from your profile anytime"] },
          { icon: "📬", title: "Contact & Support", for: "Everyone", points: ["Direct contact with platform admin", "Submit questions or issues", "Fast response from the team", "Feature requests welcome"] }
        ].map((s) => (
          <div className="card" key={s.title} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "start" }}>
            <div style={{ fontSize: 32 }}>{s.icon}</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <h3 style={{ margin: 0 }}>{s.title}</h3>
                <span style={{ fontSize: 11, background: "#FAF0F2", color: MAROON, padding: "2px 10px", borderRadius: 20, fontWeight: 700 }}>{s.for}</span>
              </div>
              <ul style={{ paddingLeft: 18, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "4px 16px" }}>
                {s.points.map(pt => <li key={pt} style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>{pt}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactPage({ data, setData }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSend(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  }

  return (
    <div className="section" style={{ maxWidth: 900, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
      <div>
        <div className="section-title">Get in Touch</div>
        <p style={{ color: TEXT_MUTED, fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
          Have questions about RSO Tracker, want to add your organization, or need support? Reach out directly.
        </p>
        <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${LIGHT_GRAY}` }}>
            <div style={{ width: 52, height: 52, borderRadius: 50, background: "#FAF0F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>👤</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Ayoola Akinlawon</div>
              <div style={{ fontSize: 13, color: TEXT_MUTED }}>Senior Accounting Major · Platform Creator</div>
            </div>
          </div>
          {[
            { icon: "✉️", label: "Email", value: "ahmedakinlawon06@gmail.com" },
            { icon: "🏫", label: "University", value: "Alabama A&M University" },
            { icon: "🏢", label: "Organization", value: "Pre-Alumni Association" }
          ].map(c => (
            <div className="contact-info" key={c.label}>
              <div className="contact-icon">{c.icon}</div>
              <div>
                <div style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600 }}>{c.label}</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{c.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="form-wrap" style={{ margin: 0 }}>
          <div className="form-title">Send a Message</div>
          <div className="form-sub">We'll get back to you within 24 hours.</div>
          {sent && <div className="success-msg">✓ Message sent! We'll be in touch soon.</div>}
          <form onSubmit={handleSend}>
            <div className="form-row">
              <div className="form-group">
                <label>Your Name</label>
                <input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input placeholder="What's this about?" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea placeholder="Tell us what you need..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            </div>
            <button type="submit" className="btn-full">Send Message →</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ===================== AUTH =====================

function AuthPage({ mode, onAuth, onSwitch }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", major: "", orgCode: "" });
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    onAuth(mode, form, setError);
  }

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div className="form-wrap" style={{ width: "100%" }}>
        <div className="form-title">{mode === "login" ? "Welcome back" : "Create your account"}</div>
        <div className="form-sub">
          {mode === "login" ? "Sign in to access your RSO dashboard." : "Join your AAMU student organization today."}
        </div>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Major / Year</label>
                <input placeholder="e.g. Junior Biology" value={form.major} onChange={e => setForm({ ...form, major: e.target.value })} />
              </div>
            </>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn-full">{mode === "login" ? "Sign In →" : "Create Account →"}</button>
        </form>
        <div className="form-switch">
          {mode === "login" ? (
            <>Don't have an account? <a onClick={() => onSwitch("signup")}>Sign up</a></>
          ) : (
            <>Already have an account? <a onClick={() => onSwitch("login")}>Sign in</a></>
          )}
        </div>
      </div>
    </div>
  );
}

// ===================== DASHBOARD =====================

function Dashboard({ user, data, setData }) {
  const [section, setSection] = useState("overview");
  const isSuperAdmin = user.role === "superadmin";
  const isAdmin = user.role === "orgadmin" || isSuperAdmin;
  const userOrg = data.orgs.find(o => o.id === user.orgId || isSuperAdmin ? o : null);
  const myOrg = isSuperAdmin ? data.orgs[0] : data.orgs.find(o => o.id === user.orgId);

  const myLogs = data.logs.filter(l => l.userId === user.id);
  const totalVolHours = myLogs.filter(l => l.type === "volunteer").reduce((s, l) => s + (l.hours || 0), 0);
  const totalEvents = myLogs.filter(l => l.type === "event").length;

  const navItems = [
    { key: "overview", icon: "🏠", label: "Overview" },
    { key: "checkin", icon: "✅", label: "Check In" },
    { key: "my-logs", icon: "📋", label: "My Logs" },
    ...(isAdmin ? [
      { key: "events", icon: "📅", label: "Manage Events", section: "Admin" },
      { key: "members", icon: "👥", label: "Members" },
      { key: "all-logs", icon: "📊", label: "All Logs" }
    ] : []),
    ...(isSuperAdmin ? [
      { key: "orgs", icon: "🏢", label: "Organizations", section: "Super Admin" },
      { key: "users", icon: "🔑", label: "All Users" }
    ] : [])
  ];

  return (
    <div style={{ display: "flex" }}>
      <nav className="dash-nav">
        <div style={{ padding: "0 14px 16px", borderBottom: `1px solid ${BORDER}`, marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: MAROON }}>{user.name}</div>
          <div className="badge badge-superadmin" style={{ marginTop: 5 }}>{user.role === "superadmin" ? "Super Admin" : user.role === "orgadmin" ? "Org Admin" : "Member"}</div>
        </div>
        {navItems.map((item, i) => {
          const prev = navItems[i - 1];
          const showSection = item.section && (!prev || prev.section !== item.section);
          return (
            <div key={item.key}>
              {showSection && <div className="dash-nav-section">{item.section}</div>}
              <button className={`dash-nav-item ${section === item.key ? "active" : ""}`} onClick={() => setSection(item.key)}>
                <span>{item.icon}</span> {item.label}
              </button>
            </div>
          );
        })}
      </nav>

      <main className="dash-main">
        {section === "overview" && <DashOverview user={user} data={data} myLogs={myLogs} totalVolHours={totalVolHours} totalEvents={totalEvents} myOrg={myOrg} setSection={setSection} />}
        {section === "checkin" && <CheckIn user={user} data={data} setData={setData} myOrg={myOrg} />}
        {section === "my-logs" && <MyLogs user={user} data={data} setData={setData} myLogs={myLogs} />}
        {section === "events" && isAdmin && <ManageEvents user={user} data={data} setData={setData} myOrg={myOrg} />}
        {section === "members" && isAdmin && <Members user={user} data={data} setData={setData} myOrg={myOrg} />}
        {section === "all-logs" && isAdmin && <AllLogs user={user} data={data} myOrg={myOrg} />}
        {section === "orgs" && isSuperAdmin && <ManageOrgs user={user} data={data} setData={setData} />}
        {section === "users" && isSuperAdmin && <AllUsers user={user} data={data} setData={setData} />}
      </main>
    </div>
  );
}

function DashOverview({ user, data, myLogs, totalVolHours, totalEvents, myOrg, setSection }) {
  const upcomingEvents = data.events
    .filter(e => e.orgId === (myOrg?.id))
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <div>
      <div className="page-title">Good to see you, {user.name.split(" ")[0]} 👋</div>
      <div className="page-sub">{myOrg?.name || "AAMU RSO Tracker"} · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>

      <div className="stats-row">
        <div className="stat-card"><div className="stat-num">{totalEvents}</div><div className="stat-label">Events Attended</div></div>
        <div className="stat-card"><div className="stat-num">{totalVolHours}</div><div className="stat-label">Volunteer Hours</div></div>
        <div className="stat-card"><div className="stat-num">{myLogs.length}</div><div className="stat-label">Total Log Entries</div></div>
        {user.role === "superadmin" && <div className="stat-card"><div className="stat-num">{data.orgs.length}</div><div className="stat-label">Organizations</div></div>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Upcoming Events</div>
          {upcomingEvents.length === 0 ? (
            <div className="card" style={{ textAlign: "center", color: TEXT_MUTED, fontSize: 14, padding: 28 }}>No upcoming events yet.</div>
          ) : upcomingEvents.map(ev => (
            <div className="checkin-card" key={ev.id}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{ev.name}</div>
                <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 3 }}>{new Date(ev.date + "T12:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · <span className={`badge badge-${ev.type}`}>{ev.type}</span></div>
              </div>
              <button className="btn-sm btn-maroon" onClick={() => setSection("checkin")}>Check In</button>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Recent Activity</div>
          {myLogs.length === 0 ? (
            <div className="card" style={{ textAlign: "center", color: TEXT_MUTED, fontSize: 14, padding: 28 }}>No activity yet. Check into your first event!</div>
          ) : myLogs.slice(-4).reverse().map(log => {
            const ev = data.events.find(e => e.id === log.eventId);
            return (
              <div key={log.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: "#FAF0F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{log.type === "volunteer" ? "🤝" : "✅"}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{ev?.name || log.note || "Log entry"}</div>
                  <div style={{ fontSize: 12, color: TEXT_MUTED }}>{new Date(log.createdAt).toLocaleDateString()} {log.hours ? `· ${log.hours} hrs` : ""}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CheckIn({ user, data, setData, myOrg }) {
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(null);
  const [proof, setProof] = useState(null);
  const [note, setNote] = useState("");

  const orgEvents = data.events.filter(e => e.orgId === myOrg?.id);
  const myLogIds = data.logs.filter(l => l.userId === user.id).map(l => l.eventId);

  function doCheckIn(ev) {
    const newLog = {
      id: `log_${Date.now()}`,
      userId: user.id,
      eventId: ev.id,
      orgId: ev.orgId,
      type: ev.type,
      hours: ev.hours || 0,
      note,
      proofName: proof?.name || null,
      createdAt: new Date().toISOString()
    };
    const updated = { ...data, logs: [...data.logs, newLog] };
    setData(updated);
    saveData(updated);
    setShowModal(null);
    setNote("");
    setProof(null);
    setSuccess(`✓ Checked in to "${ev.name}" successfully!`);
    setTimeout(() => setSuccess(""), 4000);
  }

  return (
    <div>
      <div className="page-title">Check In</div>
      <div className="page-sub">Select an event to log your attendance or volunteer hours.</div>
      {success && <div className="success-msg">{success}</div>}
      {orgEvents.length === 0 ? (
        <div className="card" style={{ textAlign: "center", color: TEXT_MUTED, padding: 40 }}>No events available yet. Check back soon.</div>
      ) : orgEvents.map(ev => {
        const alreadyIn = myLogIds.includes(ev.id);
        return (
          <div className="checkin-card" key={ev.id}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{ev.name}</div>
              <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 4 }}>
                {new Date(ev.date + "T12:00").toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })}
                {" · "}<span className={`badge badge-${ev.type}`}>{ev.type}</span>
                {ev.hours ? ` · ${ev.hours} volunteer hrs` : ""}
              </div>
              {ev.description && <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>{ev.description}</div>}
            </div>
            {alreadyIn ? (
              <span style={{ fontSize: 13, color: "#15803D", fontWeight: 600 }}>✓ Logged</span>
            ) : (
              <button className="btn-sm btn-maroon" onClick={() => setShowModal(ev)}>Check In</button>
            )}
          </div>
        );
      })}

      {showModal && (
        <Modal title={`Check In: ${showModal.name}`} onClose={() => setShowModal(null)}>
          <div style={{ marginBottom: 18, padding: 14, background: OFF_WHITE, borderRadius: 10, fontSize: 14, color: "#555" }}>
            <strong>{showModal.type === "volunteer" ? "Volunteer Event" : "Attendance Event"}</strong>
            {showModal.hours ? ` · ${showModal.hours} hours` : ""}
            <br />{showModal.description}
          </div>
          <div className="form-group">
            <label>Add a Note (optional)</label>
            <textarea placeholder="What did you do? What did you learn?" value={note} onChange={e => setNote(e.target.value)} style={{ minHeight: 80 }} />
          </div>
          <div className="form-group">
            <label>Upload Proof (optional)</label>
            <div className="upload-area" onClick={() => document.getElementById("proof-input").click()}>
              <div style={{ fontSize: 28 }}>📎</div>
              <p>{proof ? `✓ ${proof.name}` : "Click to upload a photo or document"}</p>
              <input id="proof-input" type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={e => setProof(e.target.files[0])} />
            </div>
          </div>
          <button className="btn-full" onClick={() => doCheckIn(showModal)}>Confirm Check In →</button>
        </Modal>
      )}
    </div>
  );
}

function MyLogs({ user, data, myLogs }) {
  const totalHours = myLogs.filter(l => l.type === "volunteer").reduce((s, l) => s + (l.hours || 0), 0);

  return (
    <div>
      <div className="page-title">My Participation Log</div>
      <div className="page-sub">Your complete record of events attended and volunteer hours logged.</div>
      <div className="stats-row" style={{ maxWidth: 500 }}>
        <div className="stat-card"><div className="stat-num">{myLogs.filter(l => l.type === "event").length}</div><div className="stat-label">Events</div></div>
        <div className="stat-card"><div className="stat-num">{myLogs.filter(l => l.type === "volunteer").length}</div><div className="stat-label">Volunteer Entries</div></div>
        <div className="stat-card"><div className="stat-num">{totalHours}</div><div className="stat-label">Total Hours</div></div>
      </div>
      {myLogs.length === 0 ? (
        <div className="card" style={{ textAlign: "center", color: TEXT_MUTED, padding: 40 }}>No logs yet. Check into your first event to get started.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Event</th><th>Type</th><th>Hours</th><th>Date</th><th>Note</th><th>Proof</th></tr></thead>
            <tbody>
              {[...myLogs].reverse().map(log => {
                const ev = data.events.find(e => e.id === log.eventId);
                return (
                  <tr key={log.id}>
                    <td style={{ fontWeight: 500 }}>{ev?.name || "—"}</td>
                    <td><span className={`badge badge-${log.type}`}>{log.type}</span></td>
                    <td>{log.hours || "—"}</td>
                    <td>{new Date(log.createdAt).toLocaleDateString()}</td>
                    <td style={{ color: TEXT_MUTED, maxWidth: 180 }}>{log.note || "—"}</td>
                    <td>{log.proofName ? <span style={{ color: MAROON, fontSize: 13, fontWeight: 600 }}>📎 {log.proofName}</span> : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ManageEvents({ user, data, setData, myOrg }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", date: "", type: "event", hours: "", description: "" });

  const orgEvents = data.events.filter(e => e.orgId === myOrg?.id);

  function addEvent(e) {
    e.preventDefault();
    const newEv = {
      id: `ev_${Date.now()}`,
      orgId: myOrg.id,
      name: form.name,
      date: form.date,
      type: form.type,
      hours: form.type === "volunteer" ? Number(form.hours) : 0,
      description: form.description,
      createdBy: user.id
    };
    const updated = { ...data, events: [...data.events, newEv] };
    setData(updated);
    saveData(updated);
    setShowModal(false);
    setForm({ name: "", date: "", type: "event", hours: "", description: "" });
  }

  function deleteEvent(id) {
    const updated = { ...data, events: data.events.filter(e => e.id !== id), logs: data.logs.filter(l => l.eventId !== id) };
    setData(updated);
    saveData(updated);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div className="page-title">Manage Events</div>
        <button className="btn-sm btn-maroon" onClick={() => setShowModal(true)}>+ New Event</button>
      </div>
      <div className="page-sub">Create and manage events for {myOrg?.name}.</div>

      {orgEvents.length === 0 ? (
        <div className="card" style={{ textAlign: "center", color: TEXT_MUTED, padding: 40 }}>No events yet. Create your first one.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Date</th><th>Type</th><th>Hours</th><th>Attendees</th><th></th></tr></thead>
            <tbody>
              {orgEvents.map(ev => (
                <tr key={ev.id}>
                  <td style={{ fontWeight: 500 }}>{ev.name}</td>
                  <td>{new Date(ev.date + "T12:00").toLocaleDateString()}</td>
                  <td><span className={`badge badge-${ev.type}`}>{ev.type}</span></td>
                  <td>{ev.hours || "—"}</td>
                  <td>{data.logs.filter(l => l.eventId === ev.id).length}</td>
                  <td><button className="btn-sm btn-danger" onClick={() => deleteEvent(ev.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal title="Create New Event" onClose={() => setShowModal(false)}>
          <form onSubmit={addEvent}>
            <div className="form-group"><label>Event Name</label><input placeholder="e.g. Fall General Meeting" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="form-row">
              <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required /></div>
              <div className="form-group">
                <label>Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="event">Attendance Event</option>
                  <option value="volunteer">Volunteer Activity</option>
                </select>
              </div>
            </div>
            {form.type === "volunteer" && <div className="form-group"><label>Volunteer Hours</label><input type="number" min="0.5" step="0.5" placeholder="e.g. 2" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} /></div>}
            <div className="form-group"><label>Description</label><textarea placeholder="Brief description of the event..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <button type="submit" className="btn-full">Create Event →</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Members({ user, data, setData, myOrg }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "student", major: "" });
  const [error, setError] = useState("");

  const members = data.users.filter(u => u.orgId === myOrg?.id || (user.role === "superadmin" && u.role !== "superadmin"));

  function addMember(e) {
    e.preventDefault();
    setError("");
    if (data.users.find(u => u.email === form.email)) { setError("A user with that email already exists."); return; }
    const newUser = { id: `u_${Date.now()}`, name: form.name, email: form.email, role: form.role, orgId: myOrg.id, password: "changeme123", major: form.major };
    const updated = { ...data, users: [...data.users, newUser] };
    setData(updated);
    saveData(updated);
    setShowModal(false);
    setForm({ name: "", email: "", role: "student", major: "" });
  }

  function removeMember(id) {
    const updated = { ...data, users: data.users.filter(u => u.id !== id) };
    setData(updated);
    saveData(updated);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div className="page-title">Members</div>
        <button className="btn-sm btn-maroon" onClick={() => setShowModal(true)}>+ Add Member</button>
      </div>
      <div className="page-sub">Manage members of {myOrg?.name}.</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Major</th><th>Logs</th><th></th></tr></thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id}>
                <td style={{ fontWeight: 500 }}>{m.name}</td>
                <td style={{ color: TEXT_MUTED }}>{m.email}</td>
                <td><span className={`badge badge-${m.role}`}>{m.role}</span></td>
                <td style={{ color: TEXT_MUTED }}>{m.major || "—"}</td>
                <td>{data.logs.filter(l => l.userId === m.id).length}</td>
                <td>{m.id !== user.id && <button className="btn-sm btn-danger" onClick={() => removeMember(m.id)}>Remove</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Add Member" onClose={() => setShowModal(false)}>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={addMember}>
            <div className="form-group"><label>Full Name</label><input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="form-group"><label>Email</label><input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
            <div className="form-group"><label>Major / Year</label><input placeholder="e.g. Junior Biology" value={form.major} onChange={e => setForm({ ...form, major: e.target.value })} /></div>
            <div className="form-group">
              <label>Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="student">Student Member</option>
                <option value="orgadmin">Org Admin</option>
              </select>
            </div>
            <div style={{ padding: "10px 14px", background: "#FEF9C3", borderRadius: 8, fontSize: 13, color: "#92400E", marginBottom: 16 }}>
              Default password will be <strong>changeme123</strong> — ask them to update it after first login.
            </div>
            <button type="submit" className="btn-full">Add Member →</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function AllLogs({ data, myOrg }) {
  const orgLogs = data.logs.filter(l => l.orgId === myOrg?.id);
  return (
    <div>
      <div className="page-title">All Logs</div>
      <div className="page-sub">Complete participation record for {myOrg?.name}.</div>
      <div className="stats-row" style={{ maxWidth: 500 }}>
        <div className="stat-card"><div className="stat-num">{orgLogs.length}</div><div className="stat-label">Total Entries</div></div>
        <div className="stat-card"><div className="stat-num">{orgLogs.filter(l => l.type === "volunteer").reduce((s, l) => s + (l.hours || 0), 0)}</div><div className="stat-label">Volunteer Hours</div></div>
      </div>
      {orgLogs.length === 0 ? (
        <div className="card" style={{ textAlign: "center", color: TEXT_MUTED, padding: 40 }}>No participation logged yet.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Member</th><th>Event</th><th>Type</th><th>Hours</th><th>Date</th><th>Proof</th></tr></thead>
            <tbody>
              {[...orgLogs].reverse().map(log => {
                const member = data.users.find(u => u.id === log.userId);
                const ev = data.events.find(e => e.id === log.eventId);
                return (
                  <tr key={log.id}>
                    <td style={{ fontWeight: 500 }}>{member?.name || "—"}</td>
                    <td>{ev?.name || "—"}</td>
                    <td><span className={`badge badge-${log.type}`}>{log.type}</span></td>
                    <td>{log.hours || "—"}</td>
                    <td>{new Date(log.createdAt).toLocaleDateString()}</td>
                    <td>{log.proofName ? <span style={{ color: MAROON, fontSize: 13 }}>📎</span> : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ManageOrgs({ user, data, setData }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", adminEmail: "" });
  const [error, setError] = useState("");

  function addOrg(e) {
    e.preventDefault();
    setError("");
    const admin = data.users.find(u => u.email === form.adminEmail);
    if (!admin) { setError("No user found with that email."); return; }
    const newOrg = { id: `org_${Date.now()}`, name: form.name, description: form.description, adminId: admin.id };
    const updatedUsers = data.users.map(u => u.id === admin.id ? { ...u, role: "orgadmin", orgId: newOrg.id } : u);
    const updated = { ...data, orgs: [...data.orgs, newOrg], users: updatedUsers };
    setData(updated);
    saveData(updated);
    setShowModal(false);
    setForm({ name: "", description: "", adminEmail: "" });
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div className="page-title">Organizations</div>
        <button className="btn-sm btn-maroon" onClick={() => setShowModal(true)}>+ Add Org</button>
      </div>
      <div className="page-sub">All RSOs on the platform.</div>
      <div className="card-grid">
        {data.orgs.map(org => {
          const admin = data.users.find(u => u.id === org.adminId);
          const memberCount = data.users.filter(u => u.orgId === org.id).length;
          const logCount = data.logs.filter(l => l.orgId === org.id).length;
          return (
            <div className="card" key={org.id}>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{org.name}</div>
              <div style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 14 }}>{org.description}</div>
              <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#555" }}>
                <span>👥 {memberCount} members</span>
                <span>📋 {logCount} logs</span>
              </div>
              {admin && <div style={{ marginTop: 10, fontSize: 12, color: TEXT_MUTED }}>Admin: {admin.name}</div>}
            </div>
          );
        })}
      </div>

      {showModal && (
        <Modal title="Add Organization" onClose={() => setShowModal(false)}>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={addOrg}>
            <div className="form-group"><label>Organization Name</label><input placeholder="e.g. NSBE Chapter" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="form-group"><label>Description</label><textarea placeholder="Brief description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div className="form-group"><label>Org Admin Email (existing user)</label><input type="email" placeholder="orgadmin@email.com" value={form.adminEmail} onChange={e => setForm({ ...form, adminEmail: e.target.value })} required /></div>
            <button type="submit" className="btn-full">Create Organization →</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function AllUsers({ user, data, setData }) {
  return (
    <div>
      <div className="page-title">All Users</div>
      <div className="page-sub">Everyone registered on the platform.</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Organization</th><th>Major</th></tr></thead>
          <tbody>
            {data.users.map(u => {
              const org = data.orgs.find(o => o.id === u.orgId);
              return (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500 }}>{u.name}</td>
                  <td style={{ color: TEXT_MUTED }}>{u.email}</td>
                  <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                  <td>{org?.name || "—"}</td>
                  <td style={{ color: TEXT_MUTED }}>{u.major || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===================== APP ROOT =====================

export default function App() {
  const [data, setData] = useState(loadData);
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState(null);

  function handleAuth(mode, form, setError) {
    if (mode === "login") {
      const found = data.users.find(u => u.email === form.email && u.password === form.password);
      if (!found) { setError("Incorrect email or password."); return; }
      setUser(found);
      setAuthMode(null);
      setPage("dashboard");
    } else {
      if (!form.name || !form.email || !form.password) { setError("Please fill in all required fields."); return; }
      if (data.users.find(u => u.email === form.email)) { setError("An account with that email already exists."); return; }
      const newUser = {
        id: `u_${Date.now()}`, name: form.name, email: form.email,
        password: form.password, role: "student", orgId: data.orgs[0]?.id || null, major: form.major || ""
      };
      const updated = { ...data, users: [...data.users, newUser] };
      setData(updated);
      saveData(updated);
      setUser(newUser);
      setAuthMode(null);
      setPage("dashboard");
    }
  }

  function handleLogout() {
    setUser(null);
    setPage("home");
  }

  function handleLoginTrigger(mode) {
    setAuthMode(mode);
    setPage("auth");
  }

  return (
    <>
      <style>{css}</style>
      <Navbar page={page} setPage={setPage} user={user} onLogout={handleLogout} onLogin={handleLoginTrigger} />
      {page === "home" && <HomePage setPage={setPage} user={user} onLogin={handleLoginTrigger} />}
      {page === "about" && <AboutPage />}
      {page === "services" && <ServicesPage />}
      {page === "contact" && <ContactPage data={data} setData={setData} />}
      {page === "auth" && <AuthPage mode={authMode || "login"} onAuth={handleAuth} onSwitch={setAuthMode} />}
      {page === "dashboard" && user && <Dashboard user={user} data={data} setData={setData} />}
      {page === "dashboard" && !user && <AuthPage mode="login" onAuth={handleAuth} onSwitch={setAuthMode} />}
    </>
  );
}
