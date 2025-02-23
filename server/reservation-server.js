class ReservationServer {
    handleRequest(endpoint, method, data, callback) {
        if (endpoint === "/reservations/create" && method === "POST") {
            this.createReservation(data, callback);
        } else if (endpoint === "/reservations/list" && method === "GET") {
            this.listReservations(callback);
        } else {
            callback({ success: false, error: "Invalid request" });
        }
    }

    createReservation(data, callback) {
        let currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
            callback({ success: false, error: "User not signed in" });
            return;
        }

        let reservations = database.getReservations();
        const newReservation = {
            id: reservations.length + 1,
            username: currentUser.username,
            date: data.date,
            time: data.time,
            guests: data.guests
        };

        database.addReservation(newReservation);
        callback({ success: true, message: "Reservation created successfully" });
    }

    listReservations(callback) {
        let currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
            callback({ success: false, error: "User not signed in" });
            return;
        }

        let reservations = database.getReservations();
        let userReservations = reservations.filter(r => r.username === currentUser.username);
        callback({ success: true, reservations: userReservations });
    }
}

const reservationServer = new ReservationServer();
