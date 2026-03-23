import { useEffect, useRef, useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  const params = new URLSearchParams(window.location.search);
  const company = params.get("company") || "dentist";

  const chatConfig = {
    dentist: {
      name: "Dental Assistant",
      color: "#2bb3c0",
      welcome: "Hej! Jag är klinikens assistent. Hur kan jag hjälpa dig idag?"
    },
    gym: {
      name: "Gym Assistant",
      color: "#ff4d4d",
      welcome: "Hej! Jag är gymmets assistent. Hur kan jag hjälpa dig idag?"
    },
    restaurant: {
      name: "Restaurant Assistant",
      color: "#c0392b",
      welcome: "Hej! Jag är restaurangens assistent. Hur kan jag hjälpa dig idag?"
    }
  };

  const currentConfig = chatConfig[company] || chatConfig.dentist;

  useEffect(() => {
    setMessages([{ role: "bot", text: currentConfig.welcome }]);
  }, [company]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage,
          history: [],
          company
        })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.reply || "No reply." }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error connecting to AI." }
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
                  ...styles.message,
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  background: m.role === "user" ? currentConfig.color : "#e5e7eb",
                  color: m.role === "user" ? "white" : "black"
                }}
              >
                {m.text}
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
            <button onClick={sendMessage} style={{ ...styles.sendBtn, background: currentConfig.color }}>
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
    zIndex: 9999
  },
  chatBox: {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "320px",
    height: "420px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 9999
  },
  header: {
    color: "white",
    padding: "12px 16px",
    fontWeight: "bold"
  },
  messages: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  message: {
    padding: "8px 12px",
    borderRadius: "10px",
    maxWidth: "80%",
    whiteSpace: "pre-wrap"
  },
  inputRow: {
    display: "flex",
    borderTop: "1px solid #eee"
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "none",
    outline: "none"
  },
  sendBtn: {
    padding: "10px 14px",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};