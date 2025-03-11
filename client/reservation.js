// Load the reservations page and handle reservation creation, updating, and deletion
function loadReservations() {
    const reservationTitle = document.getElementById("reservation-section-title");

    const fajax = new FXMLHttpRequest();
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

// Display the reservations list and handle reservation creation, updating, and deletion
function displayReservations(reservations) {
    
    const reservationContent = document.getElementById("reservation-content");
    reservationContent.innerHTML = "";

    // Display the search bar
    const searchDiv = document.createElement("div");
    searchDiv.id = "search-container";
    searchDiv.innerHTML = `
        <input type="number" id="reservation-search" placeholder="Search by Reservation Number" />
        <button id="search-button">Search</button>
    `;
    reservationContent.appendChild(searchDiv);
    document.getElementById("search-button").addEventListener("click", () => searchReservation(reservations));

    // Display the reservations list
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

    // Display the add reservation button
    const addBtn = document.createElement("button");
    addBtn.textContent = "Add Reservation";
    addBtn.addEventListener("click", () => showReservationForm(true));
    reservationContent.appendChild(addBtn);
}

// Delete a reservation based on the reservation id
function deleteReservation(id) {
    const fajax = new FXMLHttpRequest();
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

// Show the reservation form for creating a new reservation
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

// Show the reservation form for updating an existing reservation
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

// Submit a new reservation to the server
function submitReservation(event) {
    event.preventDefault(); 

    const date = document.getElementById("res-date").value;
    const time = document.getElementById("res-time").value;
    const guests = document.getElementById("res-guests").value;

    if (!date || !time || !guests) {
        alert("Please fill in all fields.");
        return;
    }

    const fajax = new FXMLHttpRequest();
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

// Submit an updated reservation to the server
function submitUpdateReservation(id) {
    const date = document.getElementById("update-date").value;
    const time = document.getElementById("update-time").value;
    const guests = document.getElementById("update-guests").value;

    const fajax = new FXMLHttpRequest();
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

// Search for a reservation based on the reservation number
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
}

// A return button helper for returning to the reservations menu
function returnButtonToMenu() {
    const returnButton = document.getElementById("return-button");
    returnButton.style.display = "block";
    returnButton.addEventListener("click", () => loadReservations());
}