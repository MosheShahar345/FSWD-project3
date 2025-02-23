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
        const currentUser = database.getCurrentUser();
        if (!currentUser) {
            callback({ success: false, error: "User not signed in" });
            return;
        }

        let reservations = database.getReservations();
        const newReservation = {
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
        const reservations = database.getUserReservations();
        callback({ success: true, reservations });
    }
}

const reservationServer = new ReservationServer();
