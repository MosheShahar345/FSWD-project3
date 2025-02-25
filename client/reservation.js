function checkReservations() {
    const fajax = new Fajax();
    fajax.open("GET", "/reservations/list", true);
    fajax.send("", (response) => {
        if (response.success && response.reservations.length > 0) {
            displayReservations(response.reservations);
        } else {
            showReservationForm();
        }
    });
}

function displayReservations(reservations) {
    const container = document.getElementById("main-page-div");
    container.innerHTML = ""; // Clear previous content

    const heading = document.createElement("h2");
    heading.textContent = "Your Reservations";
    container.appendChild(heading);

    const list = document.createElement("ul");
    reservations.forEach(reservation => {
        const item = document.createElement("li");
        item.textContent = `📅 Date: ${reservation.date}, 🕒 Time: ${reservation.time}, 👥 Guests: ${reservation.guests}`;
        list.appendChild(item);
    });

    container.appendChild(list);
}

function showReservationForm() {
    const container = document.getElementById("main-page-div");
    container.innerHTML = ""; // Clear previous content

    const heading = document.createElement("h2");
    heading.textContent = "Make a Reservation";
    container.appendChild(heading);

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

    form.addEventListener("submit", this.submitReservation.bind(this));
    container.appendChild(form);
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
            checkReservations(); // Refresh reservations
        } else {
            alert(response.error);
        }
    });
}


