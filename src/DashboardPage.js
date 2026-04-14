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
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw new Error("Kunde inte läsa session.");
        }

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

  function getStatusLabel(status) {
    if (status === "pending") return "Väntar";
    if (status === "confirmed") return "Bekräftad";
    if (status === "declined") return "Nekad";
    return "Bekräftad";
  }

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

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🧠 Insights</h2>

          <ul style={styles.list}>
            <li>🔥 {estimatedBookings} personer visade bokningsintresse</li>
            <li>
              💬 Vanligaste frågan:{" "}
              <strong>
                {data.topQuestions?.[0]?.question || "Ingen data ännu"}
              </strong>
            </li>
            <li>⚠️ {fallbackPercent}% av konversationerna kunde förbättras</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>❓ Vanligaste frågor</h2>

          {data.topQuestions?.length ? (
            <ul style={styles.list}>
              {data.topQuestions.map((q, i) => (
                <li key={i} style={styles.listItem}>
                  {q.question} <strong>({q.count})</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p>Inga frågor ännu</p>
          )}
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📩 Bokningsförfrågningar</h2>

          {bookings.length ? (
            <div style={styles.bookingList}>
              {bookings.map((booking) => (
                <div key={booking.id} style={styles.bookingCard}>
                  <div style={styles.bookingHeader}>
                    <strong>{booking.name || "Ingen angiven"}</strong>
                    <span style={styles.bookingDate}>
                      {booking.created_at
                        ? new Date(booking.created_at).toLocaleString()
                        : ""}
                    </span>
                  </div>

                  <div style={styles.bookingRow}>
                    <span style={styles.bookingLabel}>Status:</span>
                    <span>{getStatusLabel(booking.status)}</span>
                  </div>

                  <div style={styles.bookingRow}>
                    <span style={styles.bookingLabel}>Kontakt:</span>
                    <span>{booking.contact || "-"}</span>
                  </div>

                  <div style={styles.bookingRow}>
                    <span style={styles.bookingLabel}>Tjänst / behov:</span>
                    <span>{booking.message || "-"}</span>
                  </div>

                  <div style={styles.bookingRow}>
                    <span style={styles.bookingLabel}>Önskad tid:</span>
                    <span>{booking.requested_time || "-"}</span>
                  </div>

                  {booking.address && booking.address.trim() !== "" && (
                    <div style={styles.bookingRow}>
                      <span style={styles.bookingLabel}>Adress:</span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          booking.address
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.mapLink}
                      >
                        {booking.address}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>Inga bokningsförfrågningar ännu.</p>
          )}
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
  section: {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    marginBottom: "12px",
  },
  list: {
    paddingLeft: "20px",
  },
  listItem: {
    marginBottom: "8px",
  },
  bookingList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  bookingCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "16px",
    background: "#fafafa",
  },
  bookingHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  bookingDate: {
    fontSize: "13px",
    color: "#6b7280",
  },
  bookingRow: {
    marginBottom: "8px",
    lineHeight: 1.5,
  },
  bookingLabel: {
    fontWeight: "600",
    marginRight: "6px",
  },
  mapLink: {
    color: "#2563eb",
    textDecoration: "underline",
  },
};