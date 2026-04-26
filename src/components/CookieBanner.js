import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");

    if (!consent) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 700);

      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie_consent", "all");
    setVisible(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem("cookie_consent", "necessary");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookieinformation">
      <div className="cookie-icon">✓</div>

      <div className="cookie-content">
        <div>
          <h3>Din integritet</h3>
          <p>
            Vi använder cookies för nödvändiga funktioner och, med ditt samtycke,
            för att förbättra upplevelsen. Läs mer i vår{" "}
            <a href="/cookies">cookiepolicy</a>.
          </p>
        </div>

        <div className="cookie-actions">
          <button className="btn btn-secondary" onClick={acceptNecessary}>
            Endast nödvändiga
          </button>

          <button className="btn btn-primary" onClick={acceptAll}>
            Acceptera alla
          </button>
        </div>
      </div>
    </div>
  );
}