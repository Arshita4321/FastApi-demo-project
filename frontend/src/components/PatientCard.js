import styles from "../styles/PatientCard.module.css";

function getBmiCategory(bmi) {
  if (!bmi) return null;
  const val = parseFloat(bmi);
  if (val < 18.5) return { label: "Underweight", cls: "warning" };
  if (val < 25) return { label: "Normal", cls: "success" };
  if (val < 30) return { label: "Overweight", cls: "warning" };
  return { label: "Obese", cls: "danger" };
}

function getVerdictClass(verdict) {
  if (!verdict) return "";
  const v = verdict.toLowerCase();
  if (v.includes("healthy") || v.includes("normal")) return "success";
  if (v.includes("obese") || v.includes("critical")) return "danger";
  return "warning";
}

function PatientCard({ patient, onDelete }) {
  const bmiInfo = getBmiCategory(patient.bmi);
  const verdictCls = getVerdictClass(patient.verdict);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.avatar}>
          {patient.name?.charAt(0).toUpperCase()}
        </div>
        <div className={styles.headerInfo}>
          <h3 className={styles.name}>{patient.name}</h3>
          <span className={styles.id}>ID: {patient.id}</span>
        </div>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(patient.id)}
          title="Delete patient"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>

      <div className={styles.grid}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Age</span>
          <span className={styles.statVal}>{patient.age} <small>yrs</small></span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>City</span>
          <span className={styles.statVal}>{patient.city}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Gender</span>
          <span className={styles.statVal} style={{ textTransform: "capitalize" }}>{patient.gender}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>BMI</span>
          <span className={`${styles.statVal} ${styles.bmi} ${bmiInfo ? styles[bmiInfo.cls] : ""}`}>
            {patient.bmi || "—"}
            {bmiInfo && <span className={styles.bmiTag}>{bmiInfo.label}</span>}
          </span>
        </div>
      </div>

      {patient.verdict && (
        <div className={`${styles.verdict} ${styles[verdictCls + "Verdict"]}`}>
          <span className={styles.verdictDot} />
          {patient.verdict}
        </div>
      )}
    </div>
  );
}

export default PatientCard;