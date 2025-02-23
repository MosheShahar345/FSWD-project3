class Network {
    constructor() {
        this.delayMin = 1000; // 1 second minimum delay
        this.delayMax = 3000; // 3 seconds maximum delay
        this.dropRate = 0.1; // 10% chance of request failure
    }

    sendRequest(endpoint, method, data, callback) {
        console.log(`Network: Sending ${method} request to ${endpoint}`);
        
        setTimeout(() => {
            if (Math.random() < this.dropRate) {
                console.warn(`Network: Request to ${endpoint} failed (simulated loss)`);
                callback({ success: false, error: "Network error. Try again." });
                return;
            }

            // Simulating network passing the request to the appropriate server
            if (endpoint.startsWith("/auth")) {
                authServer.handleRequest(endpoint, method, data, callback);
            } else if (endpoint.startsWith("/reservations")) {
                reservationServer.handleRequest(endpoint, method, data, callback);
            } else {
                callback({ success: false, error: "Unknown endpoint" });
            }
        }, this.getRandomDelay());
    }

    getRandomDelay() {
        return Math.floor(Math.random() * (this.delayMax - this.delayMin) + this.delayMin);
    }
}

const network = new Network();
