// ✅ IMPORTANT: use backend service name inside Docker
const BASE_URL = "http://backend-service:8000"; 

// CREATE
async function createPatient() {
    try {
        const patient = {
            id: document.getElementById("id").value.trim(),
            name: document.getElementById("name").value.trim(),
            city: document.getElementById("city").value.trim(),
            age: parseInt(document.getElementById("age").value),
            gender: document.getElementById("gender").value.trim(),
            height: parseFloat(document.getElementById("height").value),
            weight: parseFloat(document.getElementById("weight").value),
        };

        // ✅ Validation
        if (
            !patient.id || !patient.name || !patient.city ||
            !patient.gender || isNaN(patient.age) ||
            isNaN(patient.height) || isNaN(patient.weight)
        ) {
            alert("Please fill all fields correctly!");
            return;
        }

        const res = await fetch(`${BASE_URL}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patient)
        });

        const data = await res.json();

        console.log("Response:", data);

        if (!res.ok) {
            alert(data.detail || "Error creating patient");
            return;
        }

        alert(data.message || "Patient created successfully");
        getPatients();

    } catch (err) {
        console.error(err);
        alert("Server not reachable");
    }
}


// READ
async function getPatients() {
    try {
        const res = await fetch(`${BASE_URL}/view`);
        const data = await res.json();

        const tbody = document.querySelector("#table tbody");
        tbody.innerHTML = "";

        data.forEach(p => {
            const row = `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.name}</td>
                    <td>${p.city}</td>
                    <td>${p.age}</td>
                    <td>${p.gender}</td>
                    <td>${p.height}</td>
                    <td>${p.weight}</td>
                    <td>${p.bmi}</td>
                    <td>${p.verdict}</td>
                    <td>
                        <button onclick="deletePatient('${p.id}')">Delete</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    } catch (err) {
        console.error(err);
        alert("Failed to load patients");
    }
}


// DELETE
async function deletePatient(id) {
    try {
        const res = await fetch(`${BASE_URL}/delete/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.detail || "Delete failed");
            return;
        }

        alert("Deleted successfully");
        getPatients();

    } catch (err) {
        console.error(err);
        alert("Error deleting patient");
    }
}