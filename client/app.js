class App {
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
            setTimeout(() => loadReservations(), 500);
        }
    }
}

const app = new App();
