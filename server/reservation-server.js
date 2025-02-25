class ReservationServer {
    handleRequest(endpoint, method, body, callback) {
        const data = JSON.parse(body);

        if (endpoint === "/reservations/create" && method === "POST") {
            this.createReservation(data, callback);
        } else if (endpoint === "/reservations/list" && method === "GET") {
            this.listReservations(callback);
        } else {
            callback({ success: false, error: "Invalid request" });
        }
    }

    createReservation(data, callback) {
        let currentUser = database.getCurrentUser();
        if (!currentUser) {
            callback({ success: false, error: "User not signed in" });
            return;
        }

        let newReservation = {
            id: database.getReservations().length + 1,
            username: currentUser.username,
            date: data.date,
            time: data.time,
            guests: data.guests
        };

        database.addReservation(newReservation);
        callback({ success: true, message: "Reservation created successfully" });
    }

    listReservations(callback) {
        let currentUser = database.getCurrentUser();
        if (!currentUser) {
            callback({ success: false, error: "User not signed in" });
            return;
        }

        let reservations = database.getUserReservations();
        callback({ success: true, reservations });
    }
}

const reservationServer = new ReservationServer();
