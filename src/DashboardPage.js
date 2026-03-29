import { useEffect, useMemo, useState } from "react";

function getCompanyFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("company") || "kmcgroup";
}

function StatCard({ label, value }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardLabel}>{label}</div>
      <div style={styles.cardValue}>{value}</div>
    </div>
  );
}

export default function DashboardPage() {
  const company = useMemo(() => getCompanyFromUrl(), []);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`/dashboard-data/${company}.json`);
        if (!res.ok) {
          throw new Error("Kunde inte läsa dashboard-data.");
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message || "Något gick fel.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [company]);

  if (loading) {
    return <div style={styles.page}>Laddar dashboard...</div>;
  }

  if (error) {
    return <div style={styles.page}>Fel: {error}</div>;
  }

  if (!data) {
    return <div style={styles.page}>Ingen data hittades.</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Dashboard – {data.company}</h1>
        <p style={styles.meta}>
          Genererad: {new Date(data.generatedAt).toLocaleString()}
        </p>

        <div style={styles.grid}>
          <StatCard label="Totala meddelanden" value={data.totalMessages} />
          <StatCard label="Bokningsintentioner" value={data.bookingCount} />
          <StatCard label="Fallbacks" value={data.fallbackCount} />
          <StatCard label="Fallback-rate" value={`${data.fallbackRate}%`} />
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Business insights</h2>
          <ul style={styles.list}>
            {data.insights?.map((item, index) => (
              <li key={index} style={styles.listItem}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Vanligaste frågor</h2>
          {data.topQuestions?.length ? (
            <ul style={styles.list}>
              {data.topQuestions.map((item, index) => (
                <li key={index} style={styles.listItem}>
                  {item.original} <strong>({item.count})</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p>Inga frågor hittades ännu.</p>
          )}
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Senaste meddelanden</h2>
          {data.latestMessages?.length ? (
            <div style={styles.messageList}>
              {data.latestMessages.map((item, index) => (
                <div key={index} style={styles.messageCard}>
                  <div style={styles.messageTopRow}>
                    <span style={styles.timestamp}>
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                    <span style={styles.badges}>
                      {item.bookingDetected ? "📅 Booking" : "💬 General"}{" "}
                      {item.fallback ? "⚠️ Fallback" : "✅ OK"}
                    </span>
                  </div>

                  <div style={styles.messageBlock}>
                    <div style={styles.messageLabel}>Fråga</div>
                    <div>{item.userMessage}</div>
                  </div>

                  <div style={styles.messageBlock}>
                    <div style={styles.messageLabel}>Svar</div>
                    <div>{item.botResponse}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Inga meddelanden hittades ännu.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f7f8",
    padding: "32px 16px",
    color: "#111827",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  title: {
    fontSize: "32px",
    marginBottom: "8px",
  },
  meta: {
    color: "#6b7280",
    marginBottom: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  card: {
    background: "white",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  },
  cardLabel: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "8px",
  },
  cardValue: {
    fontSize: "30px",
    fontWeight: "700",
  },
  section: {
    background: "white",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
    marginBottom: "20px",
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: "14px",
  },
  list: {
    margin: 0,
    paddingLeft: "20px",
  },
  listItem: {
    marginBottom: "10px",
    lineHeight: 1.5,
  },
  messageList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  messageCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "14px",
    background: "#fafafa",
  },
  messageTopRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  timestamp: {
    color: "#6b7280",
    fontSize: "14px",
  },
  badges: {
    fontSize: "14px",
    fontWeight: "600",
  },
  messageBlock: {
    marginBottom: "10px",
    lineHeight: 1.5,
  },
  messageLabel: {
    fontWeight: "700",
    marginBottom: "4px",
  },
};