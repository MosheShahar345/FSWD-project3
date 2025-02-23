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

    getUsers() {
        return this.db.users;
    }

    getReservations() {
        return this.db.reservations;
    }

    addUser(user) {
        this.db.users.push(user);
        this.saveDB();
    }

    addReservation(reservation) {
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
