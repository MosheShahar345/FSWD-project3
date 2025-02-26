class ReservationServer {
    handleRequest(endpoint, method, body, callback) {
        
        if (endpoint === "/reservations/create" && method === "POST" && body) {
            const data = JSON.parse(body);
            this.createReservation(data, callback);
        } else if (endpoint === "/reservations/list" && method === "GET") {
            this.listReservations(callback);
        } else if (endpoint.startsWith("/reservations/update/") && method === "PUT") {
            const id = parseInt(endpoint.split("/").pop());
            this.updateReservation(id, JSON.parse(body), callback);
        } else if (endpoint.startsWith("/reservations/delete/") && method === "DELETE") {
            const id = parseInt(endpoint.split("/").pop());
            this.deleteReservation(id, callback);
        } else if (endpoint.startsWith("/reservations/") && method === "GET") {
            const id = parseInt(endpoint.split("/").pop());
            this.getReservationById(id, callback);
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

        let reservations = database.getReservations();
        let conflict = reservations.some(r => 
            r.date === data.date && r.time === data.time
        );

        if (conflict) {
            callback({ success: false, error: "Time slot already booked!" });
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

    getReservationById(id, callback) {
        let currentUser = database.getCurrentUser();
        let reservation = database.getReservations().find(r => r.id === id);

        if (!reservation) {
            callback({ success: false, error: "Reservation not found" });
            return;
        }

        if (reservation.username !== currentUser.username) {
            callback({ success: false, error: "This reservation does not belong to the current user" });
            return;
        }

        callback({ success: true, reservation });
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

    updateReservation(id, newData, callback) {
        let reservations = database.getReservations();
        let reservationIndex = reservations.findIndex(r => r.id === id);

        if (reservationIndex === -1) {
            callback({ success: false, error: "Reservation not found" });
            return;
        }

        let conflict = reservations.some(r => 
            r.id !== id && r.date === newData.date && r.time === newData.time
        );

        if (conflict) {
            callback({ success: false, error: "Time slot already booked!" });
            return;
        }

        reservations[reservationIndex] = { ...reservations[reservationIndex], ...newData };
        database.updateReservations(reservations);

        callback({ success: true, message: "Reservation updated successfully" });
    }

    deleteReservation(id, callback) {
        let reservations = database.getReservations();
        const updatedReservations = reservations.filter(r => r.id !== id);

        if (reservations.length === updatedReservations.length) {
            callback({ success: false, error: "Reservation not found" });
            return;
        }

        database.updateReservations(updatedReservations);
        callback({ success: true, message: "Reservation deleted successfully" });
    }
}

const reservationServer = new ReservationServer();
