import { Link, useLocation } from "react-router-dom";
import styles from "../styles/Navbar.module.css";

function Navbar() {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>⚕</span>
          <span className={styles.brandName}>MediTrack</span>
        </div>

        <div className={styles.links}>
          <Link
            to="/"
            className={`${styles.link} ${location.pathname === "/" ? styles.active : ""}`}
          >
            <span className={styles.linkIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </span>
            Patients
          </Link>

          <Link
            to="/add"
            className={`${styles.link} ${location.pathname === "/add" ? styles.active : ""}`}
          >
            <span className={styles.linkIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </span>
            Add Patient
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;