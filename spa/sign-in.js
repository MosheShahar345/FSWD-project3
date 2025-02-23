function signInButtonHandler() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    network.sendRequest("/auth/signin", "POST", { username, password }, (response) => {
        if (response.success) {
            alert(response.message);
            app.loadPage("main-page-template");
            
            // Fetch reservations after login
            network.sendRequest("/reservations/list", "GET", {}, (res) => {
                if (res.success) {
                    displayReservations(res.reservations);
                } else {
                    alert(res.error);
                }
            });
        } else {
            alert(response.error);
        }
    });
}

function displayReservations(reservations) {
    const container = document.getElementById("main-page-div");
    const list = document.createElement("ul");
    reservations.forEach(reservation => {
        const item = document.createElement("li");
        item.textContent = `Date: ${reservation.date}, Time: ${reservation.time}, Guests: ${reservation.guests}`;
        list.appendChild(item);
    });
    container.appendChild(list);
}
