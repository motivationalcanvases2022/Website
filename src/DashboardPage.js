import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function StatCard({ label, value, sub }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardValue}>{value}</div>
      <div style={styles.cardLabel}>{label}</div>
      {sub && <div style={styles.cardSub}>{sub}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const apiBase = process.env.REACT_APP_CHATBOT_API_URL;

        if (!apiBase) {
          throw new Error("REACT_APP_CHATBOT_API_URL saknas i Website/.env");
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          throw new Error("Ingen aktiv inloggning hittades.");
        }

        const headers = {
          Authorization: `Bearer ${session.access_token}`,
        };

        const company = "kmcgroup";

        const [summaryRes, bookingsRes] = await Promise.all([
          fetch(`${apiBase}/api/dashboard-summary?company=${company}`, {
            method: "GET",
            headers,
            cache: "no-store",
          }),
          fetch(`${apiBase}/api/booking-requests?company=${company}`, {
            method: "GET",
            headers,
            cache: "no-store",
          }),
        ]);

        if (!summaryRes.ok) {
          const raw = await summaryRes.text();
          throw new Error(
            `Kunde inte läsa dashboard summary. Status: ${summaryRes.status}. ${raw}`
          );
        }

        if (!bookingsRes.ok) {
          const raw = await bookingsRes.text();
          throw new Error(
            `Kunde inte läsa bokningsförfrågningar. Status: ${bookingsRes.status}. ${raw}`
          );
        }

        const summaryJson = await summaryRes.json();
        const bookingsJson = await bookingsRes.json();

        setData(summaryJson);
        setBookings(bookingsJson.bookings || []);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message || "Något gick fel.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/dashboard/login";
  }

  if (loading) return <div style={styles.page}>Laddar...</div>;
  if (error) return <div style={styles.page}>Fel: {error}</div>;
  if (!data) return <div style={styles.page}>Ingen data</div>;

  const fallbackPercent = ((data.fallbackRate || 0) * 100).toFixed(1);
  const estimatedBookings = data.bookingIntentCount || 0;
  const missed = Math.round((data.totalMessages || 0) * (data.fallbackRate || 0));
  const timeSaved = Math.round((data.totalMessages || 0) * 2);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.title}>📊 AI Dashboard</h1>
            <p style={styles.subtitle}>Så här presterar din chatbot just nu</p>
          </div>

          <button onClick={handleLogout} style={styles.logoutButton}>
            Logga ut
          </button>
        </div>

        <div style={styles.grid}>
          <StatCard
            label="Potentiella bokningar"
            value={`🔥 ${estimatedBookings}`}
            sub="kunder redo att boka"
          />
          <StatCard
            label="Konversationer"
            value={`💬 ${data.totalMessages || 0}`}
            sub="totalt antal chats"
          />
          <StatCard
            label="Missade möjligheter"
            value={`⚠️ ${missed}`}
            sub={`${fallbackPercent}% fallback`}
          />
          <StatCard
            label="Sparad tid"
            value={`⏱️ ${timeSaved} min`}
            sub="automatiserad support"
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "40px 20px",
    fontFamily: "system-ui",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  title: {
    fontSize: "36px",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#6b7280",
    marginBottom: "0",
  },
  logoutButton: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: "600",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "30px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  },
  cardValue: {
    fontSize: "32px",
    fontWeight: "700",
  },
  cardLabel: {
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "6px",
  },
  cardSub: {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "4px",
  },
};