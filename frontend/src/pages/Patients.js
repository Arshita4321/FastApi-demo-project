import { useEffect, useState } from "react";
import { getPatients, deletePatient } from "../services/api";
import PatientCard from "../components/PatientCard";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Patients.module.css";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchData = () => {
    setLoading(true);
    getPatients()
      .then(res => {
        setPatients(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this patient?")) return;
    deletePatient(id)
      .then(() => fetchData())
      .catch(err => console.error(err));
  };

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase()) ||
    String(p.id).includes(search)
  );

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>Patients</h1>
            <p className={styles.subtitle}>
              {patients.length} registered patient{patients.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button className={styles.addBtn} onClick={() => navigate("/add")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Patient
          </button>
        </div>

        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search by name, city, or ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <span>Loading patients…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🔍</span>
            <p>No patients found</p>
            {search && <small>Try a different search term</small>}
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((p) => (
              <div key={p.id} className={styles.cardWrap}>
                <PatientCard patient={p} onDelete={handleDelete} />
                <button
                  className={styles.editBtn}
                  onClick={() => navigate(`/edit/${p.id}`)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit Patient
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Patients;