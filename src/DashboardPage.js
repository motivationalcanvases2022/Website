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

        const apiBase = process.env.REACT_APP_CHATBOT_API_URL;

        if (!apiBase) {
          throw new Error(
            "REACT_APP_CHATBOT_API_URL saknas i Vercel environment variables."
          );
        }

        const res = await fetch(
          `${apiBase}/api/dashboard-summary?company=${company}`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error("Kunde inte läsa live dashboard-data.");
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Dashboard load error:", err);
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

  const fallbackPercent = `${((data.fallbackRate || 0) * 100).toFixed(1)}%`;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Dashboard – {data.company}</h1>
        <p style={styles.meta}>Live-data från chatboten</p>

        <div style={styles.grid}>
          <StatCard label="Totala meddelanden" value={data.totalMessages || 0} />
          <StatCard
            label="Bokningsintentioner"
            value={data.bookingIntentCount || 0}
          />
          <StatCard
            label="Fallback-rate"
            value={fallbackPercent}
          />
          <StatCard
            label="Toppfrågor"
            value={data.topQuestions?.length || 0}
          />
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Vanligaste frågor</h2>
          {data.topQuestions?.length ? (
            <ul style={styles.list}>
              {data.topQuestions.map((item, index) => (
                <li key={index} style={styles.listItem}>
                  {item.question} <strong>({item.count})</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p>Inga frågor hittades ännu.</p>
          )}
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Snabb sammanfattning</h2>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              Chatboten har tagit emot <strong>{data.totalMessages || 0}</strong>{" "}
              meddelanden.
            </li>
            <li style={styles.listItem}>
              <strong>{data.bookingIntentCount || 0}</strong> meddelanden har
              identifierats som bokningsintentioner.
            </li>
            <li style={styles.listItem}>
              Fallback-rate ligger på <strong>{fallbackPercent}</strong>.
            </li>
          </ul>
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
};