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
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [emailDrafts, setEmailDrafts] = useState([]);
  const [emailDraftsLoading, setEmailDraftsLoading] = useState(true);

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

        const company = "nordebergentrepenadab";

        const [summaryRes, bookingsRes, emailDraftsRes] = await Promise.all([
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
          fetch(`${apiBase}/api/email-drafts/${company}`, {
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
        const emailDraftsJson = await emailDraftsRes.json();

        setData(summaryJson);
        setBookings(bookingsJson.bookings || []);
        setEmailDrafts(emailDraftsJson.drafts || []);
        setEmailDraftsLoading(false);

      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message || "Något gick fel.");
      } finally {
        setLoading(false);
        setEmailDraftsLoading(false);
      }
    }

    loadData();
  }, []);

  async function fetchEmailDrafts() {
    try {
      setEmailDraftsLoading(true);

      const res = await fetch(
        "http://localhost:3001/api/email-drafts/nordebergentrepenadab"
      );

      const data = await res.json();

      if (data.success) {
        setEmailDrafts(data.drafts || []);
      }
    } catch (error) {
      console.error("Could not fetch email drafts:", error);
    } finally {
      setEmailDraftsLoading(false);
    }
  }

  async function updateEmailDraftStatus(id, status) {
    try {
      const apiBase = process.env.REACT_APP_CHATBOT_API_URL;

      console.log("PATCH URL:", `${apiBase}/api/email-drafts/${id}/status`);

      const res = await fetch(`${apiBase}/api/email-drafts/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const raw = await res.text();

      if (!res.ok) {
        throw new Error(raw);
      }

      const data = JSON.parse(raw);

      setEmailDrafts((prev) => prev.filter((draft) => draft.id !== id));
    } catch (error) {
      console.error("Email draft status error:", error);
      alert(error.message || "Något gick fel");
    }
  }

  async function sendEmailDraft(id) {
    try {
      const apiBase = process.env.REACT_APP_CHATBOT_API_URL;

      const res = await fetch(`${apiBase}/api/email-drafts/${id}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const raw = await res.text();

      if (!res.ok) {
        throw new Error(raw);
      }

      setEmailDrafts((prev) => prev.filter((draft) => draft.id !== id));
    } catch (error) {
      console.error("Send email draft error:", error);
      alert(error.message || "Kunde inte skicka mail");
    }
  }

  async function handleApprove(id, approvedTime) {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch(`https://chatbot-ondf.onrender.com/api/booking-requests/${id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          approved_time: approvedTime,
        }),
      });

      const raw = await res.text();
      console.log("APPROVE RAW RESPONSE:", raw);

      const data = JSON.parse(raw);

      if (!res.ok) throw new Error(data.error);

      alert("Bokning godkänd!");
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDecline(id) {
    try {
      const apiBase = process.env.REACT_APP_CHATBOT_API_URL;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch(`https://chatbot-ondf.onrender.com/api/booking-requests/${id}/decline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      alert("Bokning nekad!");
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  }

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

  const statusFilteredBookings =
    statusFilter === "all"
      ? bookings
      : bookings.filter((booking) => (booking.status || "confirmed") === statusFilter);

  const filteredBookings = statusFilteredBookings
    .filter((booking) => {
      const query = searchTerm.toLowerCase().trim();

      if (!query) return true;

      return (
        (booking.name || "").toLowerCase().includes(query) ||
        (booking.contact || "").toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const statusOrder = {
        pending: 0,
        confirmed: 1,
        declined: 2,
      };

      const aStatus = a.status || "confirmed";
      const bStatus = b.status || "confirmed";

      if (statusOrder[aStatus] !== statusOrder[bStatus]) {
        return statusOrder[aStatus] - statusOrder[bStatus];
      }

      return new Date(b.created_at) - new Date(a.created_at);
    });

  const pendingCount = bookings.filter(
    (booking) => (booking.status || "confirmed") === "pending"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => (booking.status || "confirmed") === "confirmed"
  ).length;

  const declinedCount = bookings.filter(
    (booking) => (booking.status || "confirmed") === "declined"
  ).length;

  function getStatusLabel(status) {
    if (status === "pending") return "Väntar";
    if (status === "confirmed") return "Bekräftad";
    if (status === "declined") return "Nekad";
    return "Bekräftad";
  }

  function getStatusStyle(status) {
    if (status === "confirmed") {
      return { color: "green", fontWeight: "bold" };
    }
    if (status === "pending") {
      return { color: "orange", fontWeight: "bold" };
    }
    if (status === "declined") {
      return { color: "red", fontWeight: "bold" };
    }
    return {};
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
          <StatCard
            label="Väntar"
            value={`🟠 ${pendingCount}`}
            sub="förfrågningar att hantera"
          />
          <StatCard
            label="Bekräftade"
            value={`🟢 ${confirmedCount}`}
            sub="godkända bokningar"
          />
          <StatCard
            label="Nekade"
            value={`🔴 ${declinedCount}`}
            sub="nekade förfrågningar"
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
          <div style={styles.filterBar}>
            <button onClick={() => setStatusFilter("all")} style={styles.filterButton}>
              Alla
            </button>
            <button onClick={() => setStatusFilter("pending")} style={styles.filterButton}>
              Väntar
            </button>
            <button onClick={() => setStatusFilter("confirmed")} style={styles.filterButton}>
              Bekräftade
            </button>
            <button onClick={() => setStatusFilter("declined")} style={styles.filterButton}>
              Nekade
            </button>
          </div>

          <input
            type="text"
            placeholder="Sök på namn eller kontakt"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />

          {filteredBookings.length ? (
            <div style={styles.bookingList}>
              {filteredBookings.map((booking) => (
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
                    <span style={getStatusStyle(booking.status)}>
                      {getStatusLabel(booking.status)}
                    </span>
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
                    <span style={styles.bookingLabel}>
                      {booking.status === "confirmed" ? "Bekräftad tid:" : "Önskade tider:"}
                    </span>

                    <div>
                      {booking.status === "confirmed" ? (
                        <strong>{booking.requested_time || "-"}</strong>
                      ) : booking.booking_mode === "approval" &&
                        Array.isArray(booking.requested_times) &&
                        booking.requested_times.length ? (
                        booking.requested_times.map((time, index) => (
                          <div key={index} style={{ marginBottom: 8 }}>
                            <div>{time}</div>

                            {booking.status === "pending" && (
                              <button
                                onClick={() => handleApprove(booking.id, time)}
                                style={{
                                  marginTop: 4,
                                  background: "green",
                                  color: "white",
                                  padding: "6px 10px",
                                  border: "none",
                                  borderRadius: 6,
                                }}
                              >
                                Godkänn denna tid
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <span>{booking.requested_time || "-"}</span>
                      )}
                    </div>
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

                  {booking.status === "pending" && (
                    <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                      <button
                        onClick={() => handleDecline(booking.id)}
                        style={{
                          background: "red",
                          color: "white",
                          padding: "6px 10px",
                          border: "none",
                          borderRadius: 6,
                        }}
                      >
                        Neka
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>Inga bokningsförfrågningar ännu.</p>
          )}
        </div>

        {/* 🔥 MAIL SECTION */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📬 AI Mail Drafts</h2>

          {emailDraftsLoading ? (
            <p>Laddar...</p>
          ) : emailDrafts.length === 0 ? (
            <p>Inga mail att hantera just nu.</p>
          ) : (
            <>
              <p style={{ color: "#64748b", marginBottom: 20 }}>
                {emailDrafts.length} mail väntar på granskning eller åtgärd.
              </p>

              <div style={styles.bookingList}>
                {emailDrafts.map((draft) => (
                  <div key={draft.id} style={styles.bookingCard}>
                    <div style={styles.bookingHeader}>
                      <strong>{draft.subject || "Inget ämne"}</strong>

                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: "999px",
                          fontWeight: 800,
                          fontSize: 13,
                          background:
                            draft.status === "needs_review" ? "#fef3c7" : "#e2e8f0",
                          color:
                            draft.status === "needs_review" ? "#92400e" : "#334155",
                        }}
                      >
                        {draft.status === "needs_review"
                          ? "Behöver granskning"
                          : "Väntar"}
                      </span>
                    </div>

                    <div style={styles.bookingRow}>
                      <span style={styles.bookingLabel}>Från:</span>
                      <span>{draft.from_email || "-"}</span>
                    </div>

                    <div style={styles.bookingRow}>
                      <span style={styles.bookingLabel}>Kundens mail:</span>
                      <span>{draft.incoming_body}</span>
                    </div>

                    <div style={{ marginTop: 14 }}>
                      <span style={styles.bookingLabel}>AI-svar:</span>
                      <div
                        style={{
                          marginTop: 8,
                          padding: 16,
                          borderRadius: 12,
                          background: "#f8fafc",
                          lineHeight: 1.6,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {draft.ai_reply}
                      </div>
                    </div>

                    <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                      <button
                        style={styles.approve}
                        onClick={() => sendEmailDraft(draft.id)}
                      >
                        Skicka
                      </button>

                      <button
                        style={styles.reject}
                        onClick={() =>
                          updateEmailDraftStatus(draft.id, "rejected")
                        }
                      >
                        Avvisa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
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
  filterBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },

  filterButton: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
  },
  searchInput: {
    width: "100%",
    maxWidth: "320px",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "16px",
  },
  filterButtonActive: {
    background: "#111",
    color: "#fff",
    border: "1px solid #111",
  },
  mapLink: {
    color: "#2563eb",
    textDecoration: "underline",
  },
};