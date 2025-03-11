// ReservationServer class that handles reservation requests from the client using the provided database api.
class ReservationServer {
    
    // handleRequest method that handles the request based on the endpoint, method, body and callback.
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

    // createReservation method that creates a new reservation based on the provided data.
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

        let maxId = reservations.length > 0 ? Math.max(...reservations.map(r => r.id)) + 1: 1;

        let newReservation = {
            id: maxId,
            username: currentUser.username,
            date: data.date,
            time: data.time,
            guests: data.guests
        };

        database.addReservation(newReservation);
        callback({ success: true, message: "Reservation created successfully" });
    }

    // getReservationById method that retrieves a reservation based on the provided id.
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

    // listReservations method that retrieves all reservations for the current user.
    listReservations(callback) {
        let currentUser = database.getCurrentUser();
        if (!currentUser) {
            callback({ success: false, error: "User not signed in" });
            return;
        }

        let reservations = database.getUserReservations();
        callback({ success: true, reservations });
    }

    // updateReservation method that updates an existing reservation based on the provided id and data.
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

    // deleteReservation method that deletes a reservation based on the provided id.
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
