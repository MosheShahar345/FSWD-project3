document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reservation-form");
    
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            const date = document.getElementById("res-date").value;
            const time = document.getElementById("res-time").value;
            const guests = document.getElementById("res-guests").value;

            network.sendRequest("/reservations/create", "POST", { date, time, guests }, (response) => {
                if (response.success) {
                    alert(response.message);
                    app.loadPage("main-page-template"); // Reload page to update reservation list
                } else {
                    alert(response.error);
                }
            });
        });
    }
});
