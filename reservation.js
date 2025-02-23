function checkReservations() {
    network.sendRequest("/reservations/list", "GET", {}, (response) => {
        if (response.success && response.reservations.length > 0) {
            // ✅ Reservations exist → Show them
            displayReservations(response.reservations);
        } else {
            // ❌ No reservations → Show form
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
    event.preventDefault(); // Prevent form submission

    const date = document.getElementById("res-date").value;
    const time = document.getElementById("res-time").value;
    const guests = document.getElementById("res-guests").value;

    if (!date || !time || !guests) {
        alert("Please fill in all fields.");
        return;
    }

    // ✅ Send reservation request
    network.sendRequest("/reservations/create", "POST", { date, time, guests }, (response) => {
        if (response.success) {
            alert(response.message);

            // ✅ Refresh reservations after saving
            checkReservations();
        } else {
            alert(response.error);
        }
    });
}


