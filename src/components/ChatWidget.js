import { useEffect, useRef, useState } from "react";
import { getCompanyData } from "../data/companyLoader";

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : "https://chatbot-ondf.onrender.com";

const CHAT_API_URL = `${API_BASE}/api/chat`;
const BOOKING_API_URL = `${API_BASE}/api/booking-request`;

function isBookingMessage(text = "") {
  const value = text.toLowerCase();
  return (
    value.includes("boka") ||
    value.includes("bokning") ||
    value.includes("tid") ||
    value.includes("möte") ||
    value.includes("offert")
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [bookingMode, setBookingMode] = useState(false);
  const [bookingStep, setBookingStep] = useState(null);
  const [bookingData, setBookingData] = useState({
    name: "",
    contact: "",
    message: "",
    requested_time: "",
  });

  const messagesEndRef = useRef(null);
  const companyData = getCompanyData();

  const params = new URLSearchParams(window.location.search);
  const company = params.get("company") || "kmcgroup";

  const currentConfig = companyData.chatbot || {
    name: "Assistant",
    color: companyData.theme?.primary || "#2563eb",
    welcome: "Hej! Hur kan jag hjälpa dig idag?",
  };

  useEffect(() => {
    setMessages([{ role: "bot", text: currentConfig.welcome }]);
    setBookingMode(false);
    setBookingStep(null);
    setBookingData({
      name: "",
      contact: "",
      message: "",
      requested_time: "",
    });
  }, [company, currentConfig.welcome]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const resetBooking = () => {
    setBookingMode(false);
    setBookingStep(null);
    setBookingData({
      name: "",
      contact: "",
      message: "",
      requested_time: "",
    });
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { role: "user", text: trimmed };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");

    // Starta bokningsflöde
    if (!bookingMode && isBookingMessage(trimmed)) {
      setMessages([
        ...nextMessages,
        {
          role: "bot",
          text: "Toppen! Vad heter du?",
        },
      ]);
      setBookingMode(true);
      setBookingStep("name");
      return;
    }

    // Bokningssteg 1: namn
    if (bookingMode && bookingStep === "name") {
      setBookingData((prev) => ({ ...prev, name: trimmed }));
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Tack! Vad har du för telefonnummer eller email?",
        },
      ]);
      setBookingStep("contact");
      return;
    }

    // Bokningssteg 2: kontakt
    if (bookingMode && bookingStep === "contact") {
      setBookingData((prev) => ({ ...prev, contact: trimmed }));
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Perfekt. Vad vill du ha hjälp med?",
        },
      ]);
      setBookingStep("message");
      return;
    }

    // Bokningssteg 3: vad kunden vill ha hjälp med
    if (bookingMode && bookingStep === "message") {
      setBookingData((prev) => ({ ...prev, message: trimmed }));
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Bra. Vilken dag eller tid passar dig bäst?",
        },
      ]);
      setBookingStep("requested_time");
      return;
    }

    // Bokningssteg 4: önskad tid -> skicka till backend
    if (bookingMode && bookingStep === "requested_time") {
      const finalBookingData = {
        ...bookingData,
        requested_time: trimmed,
      };

      try {
        const res = await fetch(BOOKING_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company,
            name: finalBookingData.name,
            contact: finalBookingData.contact,
            message: finalBookingData.message,
            requested_time: finalBookingData.requested_time,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Kunde inte skicka bokningsförfrågan.");
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "Tack! Din bokningsförfrågan är skickad. Vi kontaktar dig så snart som möjligt.",
          },
        ]);

        resetBooking();
        return;
      } catch (err) {
        console.error("Booking request error:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text:
              err.message ||
              "Det gick inte att skicka bokningsförfrågan just nu.",
          },
        ]);
        resetBooking();
        return;
      }
    }

    // Vanlig AI-chat
    const historyForApi = nextMessages.map((m) => ({
      role: m.role === "bot" ? "assistant" : "user",
      content: m.text,
    }));

    try {
      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          history: historyForApi,
          company,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.reply || "No reply." },
      ]);
    } catch (err) {
      console.error("ChatWidget error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: err.message || "Error connecting to AI." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{ ...styles.bubble, background: currentConfig.color }}
      >
        💬
      </button>

      {open && (
        <div style={styles.chatBox}>
          <div style={{ ...styles.header, background: currentConfig.color }}>
            {currentConfig.name}
          </div>

          <div style={styles.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  ...styles.messageRow,
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    ...styles.messageBubble,
                    background:
                      m.role === "user" ? currentConfig.color : "#e5e7eb",
                    color: m.role === "user" ? "#ffffff" : "#111827",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.inputRow}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something..."
              style={styles.input}
            />
            <button
              onClick={sendMessage}
              style={{ ...styles.sendBtn, background: currentConfig.color }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  bubble: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    color: "white",
    fontSize: "24px",
    border: "none",
    cursor: "pointer",
    zIndex: 9999,
  },
  chatBox: {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "320px",
    height: "420px",
    maxWidth: "calc(100vw - 24px)",
    maxHeight: "calc(100vh - 120px)",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 9999,
  },
  header: {
    color: "white",
    padding: "12px 16px",
    fontWeight: "bold",
    fontSize: "16px",
  },
  messages: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  messageRow: {
    display: "flex",
    width: "100%",
  },
  messageBubble: {
    padding: "10px 12px",
    borderRadius: "10px",
    maxWidth: "80%",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontSize: "15px",
    lineHeight: "1.5",
  },
  inputRow: {
    display: "flex",
    borderTop: "1px solid #eee",
    alignItems: "stretch",
  },
  input: {
    flex: 1,
    padding: "14px 12px",
    border: "none",
    outline: "none",
    fontSize: "16px",
    lineHeight: "1.4",
    minWidth: 0,
  },
  sendBtn: {
    padding: "0 16px",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    minWidth: "72px",
  },
};