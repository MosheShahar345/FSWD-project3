class SPA {
    constructor() {
        this.container = document.getElementById("container");
        this.initEventListeners();
        this.loadPage("main-page-template"); // Load home page by default
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
            document.getElementById("sign-out").addEventListener("click", signOutHandler);
        }
    }
}

const app = new SPA();
