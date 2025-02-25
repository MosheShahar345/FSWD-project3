function signInButtonHandler() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const fajax = new Fajax();
    fajax.open("POST", "/auth/signin", true);
    fajax.send(JSON.stringify({ username, password }), (response) => {
        if (response.success) {
            alert(response.message);
            app.loadPage("main-page-template");
            setTimeout(() => app.loadReservations(), 500);
        } else {
            alert(response.error);
        }
    });
}

