import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updatePatient } from "../services/api";
import axios from "axios";
import Navbar from "../components/Navbar";
import styles from "../styles/PatientForm.module.css";

function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:8000/patients/${id}`)
      .then(res => {
        setForm(res.data);
        setFetching(false);
      })
      .catch(err => {
        console.error(err);
        setFetching(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    updatePatient(id, form)
      .then(() => navigate("/"))
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.container}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <div className={`${styles.iconWrap} ${styles.editIcon}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <div>
              <h1 className={styles.title}>Edit Patient</h1>
              <p className={styles.subtitle}>Update information for patient <b>#{id}</b></p>
            </div>
          </div>

          {fetching ? (
            <div className={styles.fetchingState}>
              <div className={styles.spinner} />
              <span>Loading patient data…</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Full Name</label>
                  <input
                    className={styles.input}
                    name="name"
                    value={form.name || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>City</label>
                  <input
                    className={styles.input}
                    name="city"
                    value={form.city || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Age</label>
                  <input
                    className={styles.input}
                    name="age"
                    type="number"
                    min="0"
                    max="150"
                    value={form.age || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Gender</label>
                  <div className={styles.genderGroup}>
                    {["male", "female", "others"].map(g => (
                      <label
                        key={g}
                        className={`${styles.genderOption} ${form.gender === g ? styles.genderSelected : ""}`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={form.gender === g}
                          onChange={handleChange}
                          hidden
                        />
                        <span>{g.charAt(0).toUpperCase() + g.slice(1)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Height <span className={styles.unit}>(cm)</span></label>
                  <input
                    className={styles.input}
                    name="height"
                    type="number"
                    step="0.1"
                    value={form.height || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Weight <span className={styles.unit}>(kg)</span></label>
                  <input
                    className={styles.input}
                    name="weight"
                    type="number"
                    step="0.1"
                    value={form.weight || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => navigate("/")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${styles.submitBtn} ${styles.updateBtn}`}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className={styles.btnSpinner}/> Saving…</>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditPatient;