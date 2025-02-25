class AuthServer {
    handleRequest(endpoint, method, body, callback) {
        
        if (endpoint === "/auth/signin" && method === "POST" && body) {
            const data = JSON.parse(body);
            this.signIn(data, callback);
        } else if (endpoint === "/auth/signup" && method === "POST" && body) {
            const data = JSON.parse(body);
            this.signUp(data, callback);
        } else if (endpoint === "/auth/signout" && method === "POST") {
            this.signOut(callback);
        } else {
            callback({ success: false, error: "Invalid request" });
        }
    }
    
    signIn(data, callback) {
        const users = database.getUsers();
        const user = users.find(u => u.username === data.username && u.password === data.password);

        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user)); // TODI
            callback({ success: true, message: "Login successful" });
        } else {
            callback({ success: false, error: "Invalid credentials" });
        }
    }

    signOut(callback) {
        localStorage.removeItem("currentUser"); // TODI
        callback({ success: true, message: "Signed out successfully" });
    }

    signUp(data, callback) {
        let users = database.getUsers();
        
        if (users.find(u => u.username === data.username)) {
            callback({ success: false, error: "Username taken" });
            return;
        }

        database.addUser(data);
        callback({ success: true, message: "Registration successful" });
        this.signIn(data, () => {}); // Automatically sign in after registration
    }
}

const authServer = new AuthServer();
