function loadReservations() {
    const reservationTitle = document.getElementById("reservation-section-title");

    fajax.open("GET", "/reservations/list", true);
    fajax.send("", (response) => {
        if (response.success && response.reservations.length > 0) {
            reservationTitle.textContent = "Your Reservations";
            displayReservations(response.reservations);
            document.getElementById("return-button").style.display = "none";
        } else {
            reservationTitle.textContent = "Make a Reservation";
            showReservationForm(!response.reservations || response.reservations.length === 0);
        }
    });
}

function displayReservations(reservations) {
    const reservationContent = document.getElementById("reservation-content");
    reservationContent.innerHTML = "";

    const searchDiv = document.createElement("div");
    searchDiv.id = "search-container";
    searchDiv.innerHTML = `
        <input type="number" id="reservation-search" placeholder="Search by Reservation Number" />
        <button id="search-button">Search</button>
    `;
    reservationContent.appendChild(searchDiv);
    document.getElementById("search-button").addEventListener("click", () => searchReservation(reservations));

    const list = document.createElement("ul");
    reservations.forEach(reservation => {
        const item = document.createElement("li");
        item.textContent = `#${reservation.id}, 📅 Date: ${reservation.date}, 🕒 Time: ${reservation.time}, 👥 Guests: ${reservation.guests}`;

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

function showReservationForm(isFirstOrder) {
    app.updateMenuBar();

    if (!isFirstOrder) {
        returnButtonToMenu();
    }
    
    const reservationContent = document.getElementById("reservation-content");
    reservationContent.innerHTML = "";

    const reservationTitle = document.getElementById("reservation-section-title");
    reservationTitle.textContent = "Make a Reservation";

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
    returnButtonToMenu();

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

function searchReservation(reservations) {
    const searchValue = document.getElementById("reservation-search").value;
    if (!searchValue) {
        alert("Please enter a reservation number");
        return;
    }

    const filteredReservations = reservations.filter(r => r.id === parseInt(searchValue));

    if (filteredReservations.length === 0) {
        alert("Reservation not found");
        return;
    }
    
    // Filter the displayed reservations list based on the search value
    displayReservations(filteredReservations);
    
    const reservationContent = document.getElementById("reservation-content");
    const searchContainer = document.getElementById("search-container");
    
    searchContainer.innerHTML = `<button id="reset-button">See All Reservations</button>`;
    document.getElementById("reset-button").addEventListener("click", () => displayReservations(reservations));
    reservationContent.appendChild(searchDiv);
}

function returnButtonToMenu() {
    const returnButton = document.getElementById("return-button");
    returnButton.style.display = "block";
    returnButton.addEventListener("click", () => loadReservations());
}