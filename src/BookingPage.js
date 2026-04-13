import { useEffect, useMemo, useState } from "react";

export default function BookingPage() {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    contact: "",
    message: "",
    address: "",
  });

  useEffect(() => {
    async function loadSlots() {
      try {
        setLoading(true);
        setError("");

        const apiBase = process.env.REACT_APP_CHATBOT_API_URL;

        if (!apiBase) {
          throw new Error("REACT_APP_CHATBOT_API_URL saknas i .env");
        }

        const res = await fetch(
          `${apiBase}/api/available-slots?company=kmcgroup&from=2026-04-14&to=2026-04-20`
        );

        if (!res.ok) {
          const raw = await res.text();
          throw new Error(raw || "Kunde inte hämta lediga tider");
        }

        const data = await res.json();
        setSlots(data.slots || []);
      } catch (err) {
        setError(err.message || "Något gick fel");
      } finally {
        setLoading(false);
      }
    }

    loadSlots();
  }, []);

  const groupedSlots = useMemo(() => {
    const groups = {};

    for (const slot of slots) {
      if (!groups[slot.date]) {
        groups[slot.date] = [];
      }
      groups[slot.date].push(slot);
    }

    return Object.entries(groups);
  }, [slots]);

  function formatDateLabel(dateString) {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString("sv-SE", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedSlot) {
      alert("Välj en tid först");
      return;
    }

    try {
      const apiBase = process.env.REACT_APP_CHATBOT_API_URL;

      const requestedTime = `${selectedSlot.date} ${selectedSlot.time}`;

      const res = await fetch(`${apiBase}/api/booking-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: "kmcgroup",
          name: form.name,
          contact: form.contact,
          message: form.message,
          address: form.address,
          requested_time: requestedTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Kunde inte skapa bokning");
      }

      alert("Bokning skapad!");
      window.location.reload();
    } catch (err) {
      alert(err.message || "Något gick fel");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Boka tid</h1>
        <p style={styles.subtitle}>
          Välj en ledig tid och fyll i dina uppgifter.
        </p>

        {loading && <p>Laddar lediga tider...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!loading && !error && (
          <div style={styles.layout}>
            <div style={styles.calendarPanel}>
              {groupedSlots.map(([date, daySlots]) => (
                <div key={date} style={styles.dayCard}>
                  <h2 style={styles.dayTitle}>{formatDateLabel(date)}</h2>

                  <div style={styles.slotGrid}>
                    {daySlots.map((slot, i) => {
                      const isSelected = selectedSlot?.start === slot.start;

                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedSlot(slot)}
                          style={{
                            ...styles.slotButton,
                            ...(isSelected ? styles.slotButtonSelected : {}),
                          }}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.formPanel}>
              <div style={styles.formCard}>
                <h2 style={styles.formTitle}>Din bokning</h2>

                <p style={styles.selectedInfo}>
                  {selectedSlot
                    ? `Vald tid: ${formatDateLabel(selectedSlot.date)} kl ${selectedSlot.time}`
                    : "Välj först en tid i schemat."}
                </p>

                <form onSubmit={handleSubmit} style={styles.form}>
                  <input
                    style={styles.input}
                    placeholder="Namn"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    required
                  />

                  <input
                    style={styles.input}
                    placeholder="Telefon eller e-post"
                    value={form.contact}
                    onChange={(e) =>
                      setForm({ ...form, contact: e.target.value })
                    }
                    required
                  />

                  <textarea
                    style={styles.textarea}
                    placeholder="Vad behöver du hjälp med?"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    required
                  />

                  <input
                    style={styles.input}
                    placeholder="Adress"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  />

                  <button
                    type="submit"
                    style={styles.submitButton}
                    disabled={!selectedSlot}
                  >
                    Bekräfta bokning
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f7fb",
    padding: "40px 20px",
    fontFamily: "system-ui, sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    fontSize: "48px",
    marginBottom: "12px",
  },
  subtitle: {
    fontSize: "20px",
    color: "#6b7280",
    marginBottom: "32px",
  },
  error: {
    color: "#b91c1c",
    fontWeight: "600",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1.4fr 0.9fr",
    gap: "24px",
    alignItems: "start",
  },
  calendarPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  dayCard: {
    background: "#fff",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },
  dayTitle: {
    margin: "0 0 16px 0",
    fontSize: "22px",
    textTransform: "capitalize",
  },
  slotGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },
  slotButton: {
    padding: "12px 18px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    background: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    minWidth: "88px",
  },
  slotButtonSelected: {
    background: "#111827",
    color: "#fff",
    border: "1px solid #111827",
  },
  formPanel: {
    position: "sticky",
    top: "24px",
  },
  formCard: {
    background: "#fff",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },
  formTitle: {
    marginTop: 0,
    marginBottom: "12px",
    fontSize: "28px",
  },
  selectedInfo: {
    color: "#374151",
    marginBottom: "20px",
    minHeight: "48px",
  },
  form: {
    display: "grid",
    gap: "12px",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
  },
  textarea: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    minHeight: "120px",
    resize: "vertical",
  },
  submitButton: {
    padding: "14px 18px",
    borderRadius: "12px",
    border: "none",
    background: "#111827",
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "4px",
  },
};