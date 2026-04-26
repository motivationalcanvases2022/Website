import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCompanyData } from "./data/companyLoader";
import BookingWeekCalendar from "./components/BookingWeekCalendar";

export default function BookingPage() {
  const [slots, setSlots] = useState([]);
  const company = getCompanyData();

  const bookingMode = company?.booking?.mode || "direct";
  const isApprovalMode = bookingMode === "approval";

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);

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

        const today = new Date();
        const from = today.toISOString().split("T")[0];

        const future = new Date();
        future.setDate(today.getDate() + 21);
        const to = future.toISOString().split("T")[0];

        const url = `https://chatbot-ondf.onrender.com/api/available-slots?company=kmcgroup&from=${from}&to=${to}`;

        const res = await fetch(url);

        if (!res.ok) {
          const raw = await res.text();
          throw new Error(raw || "Kunde inte hämta lediga tider");
        }

        const data = await res.json();
        setSlots(data.slots || []);
      } catch (err) {
        console.error("BOOKING LOAD ERROR:", err);
        setError(err.message || "Något gick fel");
      } finally {
        setLoading(false);
      }
    }

    loadSlots();
  }, []);

  function formatDateLabel(dateString) {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("sv-SE", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }

  function handleSlotSelect(slot) {
    if (isApprovalMode) {
      const exists = selectedSlots.some((s) => s.start === slot.start);

      if (exists) {
        setSelectedSlots(selectedSlots.filter((s) => s.start !== slot.start));
        return;
      }

      if (selectedSlots.length >= 3) {
        alert("Du kan välja max 3 tider.");
        return;
      }

      setSelectedSlots([...selectedSlots, slot]);
      return;
    }

    setSelectedSlot(slot);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isApprovalMode) {
      if (selectedSlots.length === 0) {
        alert("Välj minst en tid först");
        return;
      }
    } else {
      if (!selectedSlot) {
        alert("Välj en tid först");
        return;
      }
    }

    try {
      const requestedTime = selectedSlot
        ? `${selectedSlot.date} ${selectedSlot.time}`
        : null;

      const requestedTimes = selectedSlots.map(
        (slot) => `${slot.date} ${slot.time}`
      );

      const res = await fetch(
        "https://chatbot-ondf.onrender.com/api/booking-request",
        {
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
            requested_times: isApprovalMode ? requestedTimes : undefined,
          }),
        }
      );

      const raw = await res.text();
      console.log("BOOKING RAW RESPONSE:", raw);

      let data;

      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(`Backend returned non-JSON: ${raw.slice(0, 200)}`);
      }

      if (!res.ok) {
        throw new Error(data.error || "Kunde inte skapa bokning");
      }

      alert(
        data.message ||
          (isApprovalMode ? "Bokningsförfrågan skickad!" : "Bokning skapad!")
      );

      window.location.reload();
    } catch (err) {
      alert(err.message || "Något gick fel");
    }
  }

  const submitDisabled = isApprovalMode
    ? selectedSlots.length === 0
    : !selectedSlot;

  const isFormValid =
    form.name.trim() &&
    form.contact.trim() &&
    form.message.trim() &&
    (isApprovalMode ? selectedSlots.length > 0 : selectedSlot);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/" style={styles.backLink}>
          ← Tillbaka till hemsidan
        </Link>

        <h1 className="booking-page-title" style={styles.title}>
          {isApprovalMode ? "Skicka bokningsförfrågan" : "Boka tid"}
        </h1>

        <p style={styles.subtitle}>
          {isApprovalMode
            ? "Välj upp till 3 tider och fyll i dina uppgifter. Vi återkommer efter att förfrågan har granskats."
            : "Välj en ledig tid och fyll i dina uppgifter."}
        </p>

        {loading && <p>Laddar lediga tider...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!loading && !error && (
          <div className="booking-page-layout" style={styles.layout}>
            <div className="booking-calendar-panel" style={styles.calendarPanel}>
              <BookingWeekCalendar
                slots={slots}
                isApprovalMode={isApprovalMode}
                selectedSlot={selectedSlot}
                selectedSlots={selectedSlots}
                onSelectSlot={handleSlotSelect}
              />
            </div>

            <div className="booking-form-panel" style={styles.formPanel}>
              <div style={styles.formCard}>
                <h2 style={styles.formTitle}>
                  {isApprovalMode ? "Din förfrågan" : "Din bokning"}
                </h2>

                <p style={styles.selectedInfo}>
                  {isApprovalMode ? (
                    selectedSlots.length ? (
                      <>
                        Valda tider:
                        <br />
                        {selectedSlots.map((slot) => (
                          <span key={slot.start}>
                            {formatDateLabel(slot.date)} kl {slot.time}
                            <br />
                          </span>
                        ))}
                      </>
                    ) : (
                      "Välj upp till 3 önskade tider i kalendern."
                    )
                  ) : selectedSlot ? (
                    `Vald tid: ${formatDateLabel(selectedSlot.date)} kl ${
                      selectedSlot.time
                    }`
                  ) : (
                    "Välj först en tid i kalendern."
                  )}
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
                    placeholder={
                      isApprovalMode
                        ? "Beskriv vad du behöver hjälp med"
                        : "Vad behöver du hjälp med?"
                    }
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

                  <button className="booking-submit-btn"
                    type="submit"
                    style={{
                      ...styles.submitButton,
                      opacity: isFormValid ? 1 : 0.5,
                      cursor: isFormValid ? "pointer" : "not-allowed",
                    }}
                    disabled={!isFormValid}
                  >
                    {isApprovalMode
                      ? "Skicka bokningsförfrågan"
                      : "Bekräfta bokning"}
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
    padding: "80px 20px 40px",
    fontFamily: "system-ui, sans-serif",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  backLink: {
    display: "inline-block",
    marginBottom: "20px",
    textDecoration: "none",
    color: "#111827",
    fontWeight: "600",
    padding: "10px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    background: "#fff",
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
    gridTemplateColumns: "1.7fr 0.9fr",
    gap: "24px",
    alignItems: "start",
  },
  calendarPanel: {
    minWidth: 0,
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
  submitButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
};