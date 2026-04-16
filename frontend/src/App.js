import { BrowserRouter, Routes, Route } from "react-router-dom";


import Patients from "./pages/Patients";
import AddPatient from "./pages/AddPatient";
import EditPatient from "./pages/EditPatient";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Patients />} />
        <Route path="/add" element={<AddPatient />} />
        <Route path="/edit/:id" element={<EditPatient />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;