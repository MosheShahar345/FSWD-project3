// AuthServer class that handles authentication requests from the client using the provided database api.
class AuthServer {

    // handleRequest method that handles the request based on the endpoint, method, body and callback.
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
    
    // signIn method that checks if the user exists in the database and sets the current user if successful.
    signIn(data, callback) {
        const users = database.getUsers();
        const user = users.find(u => u.username === data.username && u.password === data.password);

        if (user) {
            database.setCurrentUser(user);
            callback({ success: true, message: "Login successful" });
        } else {
            callback({ success: false, error: "Invalid credentials" });
        }
    }

    // signOut method that deletes the current user from the database.
    signOut(callback) {
        database.deleteCurrentUser();
        callback({ success: true, message: "Signed out successfully" });
    }

    // signUp method that checks if the username is taken and adds the user to the database if successful.
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
