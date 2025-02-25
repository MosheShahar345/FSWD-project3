function signOutHandler() {
    const fajax = new Fajax();
    fajax.open("POST", "/auth/signout", true);
    fajax.send("", (response) => {
        if (response.success) {
            alert(response.message);
            localStorage.removeItem("currentUser"); // Clear current user data
            app.loadPage("sign-in-template"); // Redirect to sign-in page
        } else {
            alert(response.error);
        }
    });
}