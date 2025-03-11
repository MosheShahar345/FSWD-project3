function signOutHandler() {
    
    const fajax = new FXMLHttpRequest();
    fajax.open("POST", "/auth/signout", true);
    fajax.send("", (response) => {
        if (response.success) {
            alert(response.message);
            app.updateMenuBar();
            app.loadPage("home-page");
        } else {
            alert(response.error);
        }
    });
}
