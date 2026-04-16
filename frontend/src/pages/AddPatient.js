import { useState } from "react";
import { addPatient } from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import styles from "../styles/PatientForm.module.css";

function AddPatient() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: "",
    name: "",
    city: "",
    age: "",
    gender: "male",
    height: "",
    weight: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    addPatient({
      ...form,
      age: Number(form.age),
      height: Number(form.height),
      weight: Number(form.weight)
    })
      .then(() => {
        navigate("/");
      })
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
            <div className={styles.iconWrap}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
            </div>
            <div>
              <h1 className={styles.title}>Add Patient</h1>
              <p className={styles.subtitle}>Enter patient details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Patient ID</label>
                <input
                  className={styles.input}
                  name="id"
                  placeholder="e.g. P001"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Full Name</label>
                <input
                  className={styles.input}
                  name="name"
                  placeholder="e.g. John Doe"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>City</label>
                <input
                  className={styles.input}
                  name="city"
                  placeholder="e.g. Delhi"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Age</label>
                <input
                  className={styles.input}
                  name="age"
                  placeholder="e.g. 32"
                  type="number"
                  min="0"
                  max="150"
                  onChange={handleChange}
                  required
                />
              </div>
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

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Height <span className={styles.unit}>(cm)</span></label>
                <input
                  className={styles.input}
                  name="height"
                  placeholder="e.g. 175"
                  type="number"
                  step="0.1"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Weight <span className={styles.unit}>(kg)</span></label>
                <input
                  className={styles.input}
                  name="weight"
                  placeholder="e.g. 70"
                  type="number"
                  step="0.1"
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
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? (
                  <><span className={styles.btnSpinner}/> Adding…</>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Add Patient
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPatient;