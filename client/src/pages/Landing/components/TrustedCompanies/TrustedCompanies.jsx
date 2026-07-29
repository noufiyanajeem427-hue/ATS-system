import "./TrustedCompanies.css";

function TrustedCompanies() {
  const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "IBM",
    "Infosys",
    "TCS",
  ];

  return (
    <section className="companies">

      <h2>Trusted by Leading Companies</h2>

      <p>
        Helping recruiters and organizations streamline hiring with AI.
      </p>

      <div className="company-container">
        {companies.map((company, index) => (
          <div className="company-card" key={index}>
            {company}
          </div>
        ))}
      </div>

    </section>
  );
}

export default TrustedCompanies;