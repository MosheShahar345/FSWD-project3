class SPA {
    constructor() {
        this.container = document.getElementById("container");
        this.initEventListeners();
        this.loadPage("home-page"); // Load home page by default
        this.updateMenuBar();
    }

    initEventListeners() {
        document.getElementById("sign-in-menu-button").addEventListener("click", () => this.loadPage("sign-in-template"));
        document.getElementById("sign-up-menu-button").addEventListener("click", () => this.loadPage("sign-up-template"));
        document.getElementById("sign-out-menu-button").addEventListener("click", signOutHandler);
    }

    updateMenuBar() {
        const signOutButton = document.getElementById("sign-out-menu-button");
        const signInButton = document.getElementById("sign-in-menu-button");
        const signUpButton =  document.getElementById("sign-up-menu-button");
        if (database.getCurrentUser()) {
            signOutButton.style.display = "block";
            signInButton.style.display = "none";
            signUpButton.style.display = "none";

        } else {
            signOutButton.style.display = "none";
            signInButton.style.display = "block";
            signUpButton.style.display = "block";
        }
    }

    loadPage(templateId) {
        const template = document.getElementById(templateId);
        if (template) {
            this.container.innerHTML = "";
            const clone = template.content.cloneNode(true);
            this.container.appendChild(clone);
            this.initDynamicEventListeners(templateId);
            this.updateMenuBar();
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

            const updateBtn = document.createElement("button");
            updateBtn.textContent = "Update";
            updateBtn.addEventListener("click", () => this.showUpdateForm(reservation));

            item.appendChild(updateBtn);
            list.appendChild(item);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => this.deleteReservation(reservation.id));

            item.appendChild(deleteBtn);
            list.appendChild(item);
        });

        reservationContent.appendChild(list);

        const addBtn = document.createElement("button");
        addBtn.textContent = "Add Reservation";
        addBtn.addEventListener("click", () => this.showReservationForm());
        reservationContent.appendChild(addBtn);
    }

    deleteReservation(id) {
        const fajax = new Fajax();
        fajax.open("DELETE", `/reservations/delete/${id}`, true);
        fajax.send("", (response) => {
            if (response.success) {
                alert(response.message);
                this.loadReservations();
            } else {
                alert(response.error);
            }
        });
    }

    showReservationForm() {
        this.updateMenuBar();
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

    showUpdateForm(reservation) {
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
            this.submitUpdateReservation(reservation.id);
        });

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

    submitUpdateReservation(id) {
        const date = document.getElementById("update-date").value;
        const time = document.getElementById("update-time").value;
        const guests = document.getElementById("update-guests").value;

        const fajax = new Fajax();
        fajax.open("PUT", `/reservations/update/${id}`, true);
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
