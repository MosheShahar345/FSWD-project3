class Database {
    constructor() {
        // Default database structure
        this.defaultDB = {
            users: [],
            reservations: []
        };

        // Load existing data or initialize if not present
        this.loadDB();
    }

    loadDB() {
        const storedDB = localStorage.getItem("db");
        if (!storedDB) {
            localStorage.setItem("db", JSON.stringify(this.defaultDB));
            this.db = this.defaultDB;
        } else {
            this.db = JSON.parse(storedDB);
        }
    }

    saveDB() {
        localStorage.setItem("db", JSON.stringify(this.db));
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("currentUser")) || null;
    }

    getUsers() {
        return this.db.users;
    }

    getReservations() {
        return this.db.reservations;
    }

    getUserReservations() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return [];

        return this.db.reservations.filter(reservation => reservation.username === currentUser.username);
    }

    addUser(user) {
        this.db.users.push(user);
        this.saveDB();
    }

    addReservation(reservation) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            console.warn("No user is logged in. Cannot add reservation.");
            return;
        }

        reservation.username = currentUser.username; // Ensure reservation is linked to the user
        this.db.reservations.push(reservation);
        this.saveDB();
    }

    updateUsers(users) {
        this.db.users = users;
        this.saveDB();
    }

    updateReservations(reservations) {
        this.db.reservations = reservations;
        this.saveDB();
    }
}

const database = new Database();
