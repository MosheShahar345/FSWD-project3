class AuthServer {
    handleRequest(endpoint, method, body, callback) {
        const data = JSON.parse(body);

        if (endpoint === "/auth/signin" && method === "POST") {
            this.signIn(data, callback);
        } else if (endpoint === "/auth/signup" && method === "POST") {
            this.signUp(data, callback);
        } else {
            callback({ success: false, error: "Invalid request" });
        }
    }
    
    signIn(data, callback) {
        const users = database.getUsers();
        const user = users.find(u => u.username === data.username && u.password === data.password);

        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
            callback({ success: true, message: "Login successful" });
        } else {
            callback({ success: false, error: "Invalid credentials" });
        }
    }

    signOut(callback) {
        localStorage.removeItem("currentUser");
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
    }
}

const authServer = new AuthServer();
