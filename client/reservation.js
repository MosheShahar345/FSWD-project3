function loadReservations() {
    const reservationTitle = document.getElementById("reservation-section-title");

    const fajax = new Fajax();
    fajax.open("GET", "/reservations/list", true);
    fajax.send("", (response) => {
        if (response.success && response.reservations.length > 0) {
            reservationTitle.textContent = "Your Reservations";
            displayReservations(response.reservations);
        } else {
            reservationTitle.textContent = "Make a Reservation";
            showReservationForm();
        }
    });
}

function displayReservations(reservations) {
    const reservationContent = document.getElementById("reservation-content");
    reservationContent.innerHTML = "";

    const list = document.createElement("ul");
    reservations.forEach(reservation => {
        const item = document.createElement("li");
        item.textContent = `📅 Date: ${reservation.date}, 🕒 Time: ${reservation.time}, 👥 Guests: ${reservation.guests}`;

        const updateBtn = document.createElement("button");
        updateBtn.textContent = "Update";
        updateBtn.addEventListener("click", () => showUpdateForm(reservation));

        item.appendChild(updateBtn);
        list.appendChild(item);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteReservation(reservation.id));

        item.appendChild(deleteBtn);
        list.appendChild(item);
    });

    reservationContent.appendChild(list);

    const addBtn = document.createElement("button");
    addBtn.textContent = "Add Reservation";
    addBtn.addEventListener("click", () => showReservationForm());
    reservationContent.appendChild(addBtn);
}

function deleteReservation(id) {
    const fajax = new Fajax();
    fajax.open("DELETE", `/reservations/delete/${id}`, true);
    fajax.send("", (response) => {
        if (response.success) {
            alert(response.message);
            loadReservations();
        } else {
            alert(response.error);
        }
    });
}

function showReservationForm() {
    app.updateMenuBar();
    const reservationContent = document.getElementById("reservation-content");
    reservationContent.innerHTML = "";

    const form = document.createElement("form");
    form.id = "reservation-form";

    form.innerHTML = `
        <label>Date:</label>
        <input type="date" id="res-date" required><br>

        <label>Time:</label>
        <input type="time" id="res-time" required><br>

        <label>Guests:</label>
        <input type="number" id="res-guests" min="1" required><br>

        <button type="submit">Reserve</button>
    `;
    form.addEventListener("submit", submitReservation.bind(this));
    reservationContent.appendChild(form);
}

function showUpdateForm(reservation) {
    const reservationContent = document.getElementById("reservation-content");
    reservationContent.innerHTML = "";

    const form = document.createElement("form");
    form.id = "update-form";

    form.innerHTML = `
        <label>Date:</label>
        <input type="date" id="update-date" value="${reservation.date}" required><br>

        <label>Time:</label>
        <input type="time" id="update-time" value="${reservation.time}" required><br>

        <label>Guests:</label>
        <input type="number" id="update-guests" value="${reservation.guests}" min="1" required><br>

        <button type="submit">Update</button>
    `;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitUpdateReservation(reservation.id);
    });

    reservationContent.appendChild(form);
}

function submitReservation(event) {
    event.preventDefault(); 

    const date = document.getElementById("res-date").value;
    const time = document.getElementById("res-time").value;
    const guests = document.getElementById("res-guests").value;

    if (!date || !time || !guests) {
        alert("Please fill in all fields.");
        return;
    }

    const fajax = new Fajax();
    fajax.open("POST", "/reservations/create", true);
    fajax.send(JSON.stringify({ date, time, guests }), (response) => {
        if (response.success) {
            alert(response.message);
            loadReservations();
        } else {
            alert(response.error);
        }
    });
}

function submitUpdateReservation(id) {
    const date = document.getElementById("update-date").value;
    const time = document.getElementById("update-time").value;
    const guests = document.getElementById("update-guests").value;

    const fajax = new Fajax();
    fajax.open("PUT", `/reservations/update/${id}`, true);
    fajax.send(JSON.stringify({ date, time, guests }), (response) => {
        if (response.success) {
            alert(response.message);
            loadReservations();
        } else {
            alert(response.error);
        }
    });
}