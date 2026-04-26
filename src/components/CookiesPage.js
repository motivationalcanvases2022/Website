import { Link } from "react-router-dom";
import { getCompanyData } from "../data/companyLoader";

export default function CookiesPage() {
  const company = getCompanyData();

  return (
    <main className="legal-page">
      <div className="legal-hero">
        <div className="container legal-container">
          <Link to="/" className="legal-back-link">
            ← Tillbaka till hemsidan
          </Link>

          <p className="legal-kicker">Cookies och liknande teknik</p>
          <h1>Cookiepolicy</h1>
          <p className="legal-lead">
            Denna policy beskriver hur {company.companyName} använder cookies
            och liknande teknik på webbplatsen.
          </p>

          <div className="legal-meta-grid">
            <div>
              <strong>Webbplats</strong>
              <span>{company.companyName}</span>
            </div>
            <div>
              <strong>Senast uppdaterad</strong>
              <span>26 april 2026</span>
            </div>
            <div>
              <strong>Inställningar</strong>
              <span>Du kan hantera cookies i din webbläsare.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container legal-content-card">
        <section>
          <h2>1. Vad är cookies?</h2>
          <p>
            Cookies är små textfiler som sparas i din webbläsare eller på din
            enhet när du besöker en webbplats. De används för att webbplatsen
            ska fungera, komma ihåg vissa val eller förbättra upplevelsen.
          </p>
        </section>

        <section>
          <h2>2. Vilka typer av cookies vi använder</h2>

          <div className="legal-table">
            <div>
              <strong>Nödvändiga cookies</strong>
              <span>
                Krävs för grundläggande funktioner som navigation, säkerhet,
                bokningsflöde och inloggning.
              </span>
            </div>
            <div>
              <strong>Funktionella cookies</strong>
              <span>
                Kan användas för att komma ihåg val och förbättra upplevelsen.
              </span>
            </div>
            <div>
              <strong>Analyscookies</strong>
              <span>
                Kan användas för att förstå hur webbplatsen används. Dessa
                används endast om de är aktiverade och tillåtna.
              </span>
            </div>
            <div>
              <strong>Tredjepartscookies</strong>
              <span>
                Kan förekomma via externa tjänster som används för bokning,
                hosting, kalender eller kommunikation.
              </span>
            </div>
          </div>
        </section>

        <section>
          <h2>3. Varför vi använder cookies</h2>
          <p>Cookies kan användas för att:</p>
          <ul>
            <li>säkerställa att webbplatsen fungerar korrekt,</li>
            <li>hantera boknings- och kontaktfunktioner,</li>
            <li>förbättra användarupplevelsen,</li>
            <li>skydda mot spam, missbruk och tekniska problem,</li>
            <li>förstå och förbättra webbplatsens prestanda.</li>
          </ul>
        </section>

        <section>
          <h2>4. Samtycke</h2>
          <p>
            Cookies som är nödvändiga för att webbplatsen ska fungera kan
            användas utan samtycke. För andra cookies, exempelvis analys eller
            marknadsföring, ska samtycke normalt hämtas in innan de används.
          </p>
          <p>
            Du kan när som helst ändra eller återkalla ditt samtycke genom att
            rensa cookies i webbläsaren eller ändra dina webbläsarinställningar.
          </p>
        </section>

        <section>
          <h2>5. Så kan du blockera cookies</h2>
          <p>
            Du kan blockera eller radera cookies i din webbläsares inställningar.
            Observera att vissa funktioner, till exempel bokning, chatt eller
            inloggning, kan fungera sämre om nödvändiga cookies blockeras.
          </p>
        </section>

        <section>
          <h2>6. Tredjepartstjänster</h2>
          <p>
            Webbplatsen kan använda externa tjänster för drift, bokning,
            kalenderfunktioner och e-postkommunikation. Dessa tjänster kan i
            vissa fall använda egna cookies eller liknande teknik.
          </p>
        </section>

        <section>
          <h2>7. Ändringar</h2>
          <p>
            Vi kan uppdatera denna cookiepolicy vid behov. Den senaste versionen
            finns alltid på denna sida.
          </p>
        </section>
      </div>
    </main>
  );
}