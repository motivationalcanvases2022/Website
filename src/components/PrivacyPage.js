import { Link } from "react-router-dom";
import { getCompanyData } from "../data/companyLoader";

export default function PrivacyPage() {
  const company = getCompanyData();

  return (
    <main className="legal-page">
      <div className="legal-hero">
        <div className="container legal-container">
          <Link to="/" className="legal-back-link">
            ← Tillbaka till hemsidan
          </Link>

          <p className="legal-kicker">Juridisk information</p>
          <h1>Integritetspolicy</h1>
          <p className="legal-lead">
            Här förklarar vi hur {company.companyName} samlar in, använder,
            lagrar och skyddar personuppgifter när du använder vår webbplats,
            bokningsfunktion eller kontaktar oss.
          </p>

          <div className="legal-meta-grid">
            <div>
              <strong>Personuppgiftsansvarig</strong>
              <span>{company.companyName}</span>
            </div>
            <div>
              <strong>Senast uppdaterad</strong>
              <span>26 april 2026</span>
            </div>
            <div>
              <strong>Kontakt</strong>
              <span>{company.email || company.contactEmail || "Via kontaktformuläret"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container legal-content-card">
        <section>
          <h2>1. Vilka uppgifter vi samlar in</h2>
          <p>
            När du använder våra tjänster kan vi samla in personuppgifter som du
            själv lämnar till oss, exempelvis namn, telefonnummer, e-postadress,
            meddelande, adress, önskade bokningstider och annan information som
            behövs för att hantera din förfrågan.
          </p>
          <p>
            Vid användning av chatt eller bokningssystem kan även teknisk
            information behandlas, till exempel tidpunkt för kontakt, vald tjänst,
            bokningsstatus och meddelandehistorik.
          </p>
        </section>

        <section>
          <h2>2. Varför vi behandlar personuppgifter</h2>
          <p>Vi behandlar personuppgifter för att kunna:</p>
          <ul>
            <li>hantera bokningar och bokningsförfrågningar,</li>
            <li>svara på frågor och ge kundsupport,</li>
            <li>skicka bekräftelser, notifieringar och uppföljning,</li>
            <li>planera möten i kalender,</li>
            <li>förbättra webbplatsen och våra tjänster,</li>
            <li>förebygga missbruk, spam och tekniska problem.</li>
          </ul>
        </section>

        <section>
          <h2>3. Rättslig grund</h2>
          <p>
            Behandlingen sker vanligtvis för att kunna fullgöra ett avtal eller
            hantera åtgärder innan avtal, exempelvis när du skickar en
            bokningsförfrågan. Viss behandling sker också baserat på berättigat
            intresse, till exempel för att ge support, förbättra tjänsten och
            säkerställa funktionalitet.
          </p>
          <p>
            Om vi använder cookies eller liknande teknik som inte är strikt
            nödvändig, sker det baserat på ditt samtycke.
          </p>
        </section>

        <section>
          <h2>4. Tredjepartstjänster</h2>
          <p>
            För att kunna leverera webbplatsen och bokningsfunktionerna kan vi
            använda externa tjänsteleverantörer. Dessa används endast när det
            behövs för att driva tjänsten.
          </p>

          <div className="legal-table">
            <div>
              <strong>Supabase</strong>
              <span>Lagring av bokningsdata, chattloggar och teknisk data.</span>
            </div>
            <div>
              <strong>Google Calendar</strong>
              <span>Kalenderkontroll, tillgänglighet och skapande av bokningar.</span>
            </div>
            <div>
              <strong>Resend</strong>
              <span>Utskick av e-post, bekräftelser och notifieringar.</span>
            </div>
            <div>
              <strong>Vercel / Render</strong>
              <span>Hosting och drift av webbplats och backend.</span>
            </div>
          </div>
        </section>

        <section>
          <h2>5. Hur länge vi sparar uppgifter</h2>
          <p>
            Vi sparar personuppgifter så länge det behövs för att hantera din
            bokning, ge support och följa upp ärendet. Uppgifter kan därefter
            raderas, anonymiseras eller sparas under längre tid om det krävs för
            bokföring, säkerhet, tvist eller annan rättslig skyldighet.
          </p>
        </section>

        <section>
          <h2>6. Säkerhet</h2>
          <p>
            Vi arbetar med rimliga tekniska och organisatoriska säkerhetsåtgärder
            för att skydda personuppgifter mot obehörig åtkomst, förlust,
            ändring eller missbruk. Åtkomst till personuppgifter begränsas till
            personer och system som behöver uppgifterna för att leverera tjänsten.
          </p>
        </section>

        <section>
          <h2>7. Dina rättigheter</h2>
          <p>
            Du har rätt att begära information om vilka personuppgifter vi
            behandlar om dig. Du kan också begära rättelse, radering,
            begränsning av behandling eller invända mot viss behandling. I vissa
            fall kan du även ha rätt till dataportabilitet.
          </p>
          <p>
            Om behandlingen bygger på samtycke kan du när som helst återkalla
            samtycket.
          </p>
        </section>

        <section>
          <h2>8. Klagomål</h2>
          <p>
            Om du anser att vi behandlar dina personuppgifter felaktigt kan du
            kontakta oss. Du har även rätt att lämna klagomål till
            Integritetsskyddsmyndigheten.
          </p>
        </section>

        <section>
          <h2>9. Ändringar i policyn</h2>
          <p>
            Vi kan uppdatera denna integritetspolicy vid behov. Den senaste
            versionen finns alltid tillgänglig på denna sida.
          </p>
        </section>
      </div>
    </main>
  );
}