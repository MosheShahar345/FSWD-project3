// Purpose: Main entry point for the client-side application
class App {
    constructor() {
        this.container = document.getElementById("container");
        this.initEventListeners();
        this.loadPage("home-page"); // Load home page by default
        this.updateMenuBar();
    }

    // Initialize event listeners for the menu bar
    initEventListeners() {
        document.getElementById("sign-in-menu-button").addEventListener("click", () => this.loadPage("sign-in-template"));
        document.getElementById("sign-up-menu-button").addEventListener("click", () => this.loadPage("sign-up-template"));
        document.getElementById("sign-out-menu-button").addEventListener("click", signOutHandler);
    }

    // Update the menu bar based on the current user
    updateMenuBar() {
        const signOutButton = document.getElementById("sign-out-menu-button");
        const signInButton = document.getElementById("sign-in-menu-button");
        const signUpButton =  document.getElementById("sign-up-menu-button");
        const returnButton = document.getElementById("return-button");
        if (database.getCurrentUser()) {
            signOutButton.style.display = "block";
            signInButton.style.display = "none";
            signUpButton.style.display = "none";
        } else {
            signOutButton.style.display = "none";
            signInButton.style.display = "block";
            signUpButton.style.display = "block";
        }
        returnButton.style.display = "none";
    }

    // Load a page based on the template id
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

    // Initialize dynamic event listeners according to the template id
    initDynamicEventListeners(templateId) {
        if (templateId === "sign-in-template") {
            document.querySelector("#container button").addEventListener("click", signInButtonHandler);
        } else if (templateId === "sign-up-template") {
            document.querySelector("#container form").addEventListener("submit", signUpSubmitHandler);
        } else if (templateId === "main-page-template") {
            setTimeout(() => loadReservations(), 500);
        }
    }
}

const app = new App();
