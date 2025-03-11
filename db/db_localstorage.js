// DB API for local storage database
class DB_API {
    constructor() {
        // Default database structure
        this.defaultDB = {
            users: [],
            reservations: []
        };

        // Load existing data or initialize if not present
        this.loadDB();
    }

    // Load database from local storage
    loadDB() {
        const storedDB = localStorage.getItem("db");
        if (!storedDB) {
            localStorage.setItem("db", JSON.stringify(this.defaultDB));
            this.db = this.defaultDB;
        } else {
            this.db = JSON.parse(storedDB);
        }
    }

    // Save database to local storage
    saveDB() {
        localStorage.setItem("db", JSON.stringify(this.db));
    }

    // Set the current user in local storage
    setCurrentUser(user){
        localStorage.setItem("currentUser", JSON.stringify(user));
    }

    // Get the current user from local storage
    getCurrentUser() {
        return JSON.parse(localStorage.getItem("currentUser")) || null;
    }

    // Get all users from the database
    getUsers() {
        return this.db.users;
    }

    // Get all reservations from the database
    getReservations() {
        return this.db.reservations;
    }

    // Get reservations for the current user
    getUserReservations() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return [];

        return this.db.reservations.filter(reservation => reservation.username === currentUser.username);
    }

    // Add a user to the database
    addUser(user) {
        this.db.users.push(user);
        this.saveDB();
    }

    // Add a reservation to the database
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

    // Update a reservation in the database
    updateUsers(users) {
        this.db.users = users;
        this.saveDB();
    }

    // Update a reservation in the database
    updateReservations(reservations) {
        this.db.reservations = reservations;
        this.saveDB();
    }

    // Delete the current user from local storage
    deleteCurrentUser(){
        localStorage.removeItem("currentUser");
    }
}

const database = new DB_API();
