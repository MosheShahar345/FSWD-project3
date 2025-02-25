class SPA {
    constructor() {
        this.container = document.getElementById("container");
        this.initEventListeners();
        this.loadPage("home-page"); // Load home page by default
    }

    initEventListeners() {
        document.getElementById("sign-in-menu-button").addEventListener("click", () => this.loadPage("sign-in-template"));
        document.getElementById("sign-up-menu-button").addEventListener("click", () => this.loadPage("sign-up-template"));
    }

    loadPage(templateId) {
        const template = document.getElementById(templateId);
        if (template) {
            this.container.innerHTML = "";
            const clone = template.content.cloneNode(true);
            this.container.appendChild(clone);
            this.initDynamicEventListeners(templateId);
        }
    }

    initDynamicEventListeners(templateId) {
        if (templateId === "sign-in-template") {
            document.querySelector("#container button").addEventListener("click", signInButtonHandler);
        } else if (templateId === "sign-up-template") {
            document.querySelector("#container form").addEventListener("submit", signUpSubmitHandler);
        } else if (templateId === "main-page-template") {
            setTimeout(() => this.loadReservations(), 500);
        }
    }

    loadReservations() {
        const reservationTitle = document.getElementById("reservation-section-title");

        const fajax = new Fajax();
        fajax.open("GET", "/reservations/list", true);
        fajax.send("", (response) => {
            if (response.success && response.reservations.length > 0) {
                reservationTitle.textContent = "Your Reservations";
                this.displayReservations(response.reservations);
            } else {
                reservationTitle.textContent = "Make a Reservation";
                this.showReservationForm();
            }
        });
    }

    displayReservations(reservations) {
        const reservationContent = document.getElementById("reservation-content");
        reservationContent.innerHTML = "";

        const list = document.createElement("ul");
        reservations.forEach(reservation => {
            const item = document.createElement("li");
            item.textContent = `📅 Date: ${reservation.date}, 🕒 Time: ${reservation.time}, 👥 Guests: ${reservation.guests}`;
            list.appendChild(item);
        });

        reservationContent.appendChild(list);
    }

    showReservationForm() {
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

        form.addEventListener("submit", this.submitReservation.bind(this));
        reservationContent.appendChild(form);
    }

    submitReservation(event) {
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
                this.loadReservations();
            } else {
                alert(response.error);
            }
        });
    }
}

const app = new SPA();
