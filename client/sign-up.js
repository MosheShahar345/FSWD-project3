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

    const fajax = new Fajax();
    fajax.open("POST", "/auth/signup", true);
    fajax.send(JSON.stringify({ username, email, password }), (response) => {
        if (response.success) {
            alert(response.message);
            app.loadPage("main-page-template");
        } else {
            alert(response.error);
        }
    });
}
