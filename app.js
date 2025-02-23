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
            // ✅ After loading the main page, check for reservations
            setTimeout(() => this.loadReservations(), 500);
        }
    }

    loadReservations() {
        const reservationTitle = document.getElementById("reservation-section-title");
    
        // ✅ Request reservations from the server
        network.sendRequest("/reservations/list", "GET", {}, (response) => {
            if (response.success && response.reservations.length > 0) {
                // ✅ Reservations exist → Show them
                reservationTitle.textContent = "Your Reservations";
                this.displayReservations(response.reservations);
            } else {
                // ❌ No reservations → Show form
                reservationTitle.textContent = "Make a Reservation";
                this.showReservationForm();
            }
        });
    }
}

const app = new SPA();
