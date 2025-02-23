function signInButtonHandler() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    network.sendRequest("/auth/signin", "POST", { username, password }, (response) => {
        if (response.success) {
            alert(response.message);
            app.loadPage("main-page-template");

            // ✅ Check for reservations after login
            setTimeout(() => {
                checkReservations();
            }, 500);
        } else {
            alert(response.error);
        }
    });
}

