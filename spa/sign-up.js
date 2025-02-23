function signUpSubmitHandler(event) {
    event.preventDefault();

    const username = document.getElementById("uname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("psw").value;
    const repeatPassword = document.getElementById("re-password").value;

    if (password !== repeatPassword) {
        alert("Passwords do not match!");
        return;
    }

    // ✅ Send request through network
    network.sendRequest("/auth/signup", "POST", { username, email, password }, (response) => {
        if (response.success) {
            alert(response.message);
            app.loadPage("main-page-template");

            // ✅ Check for reservations after signing up
            setTimeout(() => {
                checkReservations();
            }, 500);
        } else {
            alert(response.error);
        }
    });
}
