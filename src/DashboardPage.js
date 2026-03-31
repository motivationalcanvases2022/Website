import { useEffect, useMemo, useState } from "react";

function getCompanyFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("company") || "kmcgroup";
}

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
  const company = useMemo(() => getCompanyFromUrl(), []);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const apiBase = process.env.REACT_APP_CHATBOT_API_URL;

      const res = await fetch(
        `${apiBase}/api/dashboard-summary?company=${company}`,
        { cache: "no-store" }
      );

      const json = await res.json();
      setData(json);
      setLoading(false);
    }

    loadData();
  }, [company]);

  if (loading) return <div style={styles.page}>Laddar...</div>;
  if (!data) return <div style={styles.page}>Ingen data</div>;

  const fallbackPercent = ((data.fallbackRate || 0) * 100).toFixed(1);

  // 🔥 säljmagi
  const estimatedBookings = data.bookingIntentCount || 0;
  const missed = Math.round((data.totalMessages || 0) * data.fallbackRate);
  const timeSaved = Math.round((data.totalMessages || 0) * 2); // 2 min/chat

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>📊 AI Dashboard</h1>
        <p style={styles.subtitle}>
          Så här presterar din chatbot just nu
        </p>

        {/* 🔥 KPI SECTION */}
        <div style={styles.grid}>
          <StatCard
            label="Potentiella bokningar"
            value={`🔥 ${estimatedBookings}`}
            sub="kunder redo att boka"
          />
          <StatCard
            label="Konversationer"
            value={`💬 ${data.totalMessages}`}
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

        {/* 🧠 INSIGHTS */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🧠 Insights</h2>

          <ul style={styles.list}>
            <li>
              🔥 {estimatedBookings} personer visade bokningsintresse
            </li>
            <li>
              💬 Vanligaste frågan:{" "}
              <strong>
                {data.topQuestions?.[0]?.question || "Ingen data ännu"}
              </strong>
            </li>
            <li>
              ⚠️ {fallbackPercent}% av konversationerna kunde förbättras
            </li>
          </ul>
        </div>

        {/* ❓ TOP QUESTIONS */}
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
  title: {
    fontSize: "36px",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#6b7280",
    marginBottom: "30px",
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
};