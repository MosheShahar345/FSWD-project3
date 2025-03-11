class Network {
    constructor() {
        this.delayMin = 1000; // 1 second minimum delay
        this.delayMax = 1500; // 3 seconds maximum delay
        this.dropRate = 0.1; // 10% chance of request failure
    }

    // Send a synchronous request to the server
    send_to_server(request) {
        console.log(`Network: Sending request to ${request.url}`);

        if (request.url.startsWith("/auth")) {
            authServer.handleRequest(request.url, request.method, request.body, this.responseHandler);
        } else if (request.url.startsWith("/reservations")) {
            reservationServer.handleRequest(request.url, request.method, request.body, this.responseHandler);
        } else {
            console.error("Network: Unknown endpoint");
        }
    }

    // Send an asynchronous request to the server
    send_to_server_async(request, callback) {
        console.log(`Network: Sending async request to ${request.url}`);

        setTimeout(() => {
            if (Math.random() < this.dropRate) {
                alert(`Network: Request to ${request.url} failed (simulated loss)`);
                callback({ success: false, error: "Network error. Try again." });
                return;
            }

            // Common request handler function
            const handleRequest = (server) => {
                server.handleRequest(request.url, request.method, request.body, (response = null) => {
                    this.simulateNetworkResponse(request.url, response, callback);
                });
            };

            // Route the request to the appropriate server
            if (request.url.startsWith("/auth")) {
                handleRequest(authServer);
            } else if (request.url.startsWith("/reservations")) {
                handleRequest(reservationServer);
            } else {
                callback({ success: false, error: "Unknown endpoint" });
            }
        }, this.getRandomDelay());
    }

    // Helper function to simulate packet loss and delay for response handling
    simulateNetworkResponse(url, response, callback) {
        setTimeout(() => {
            if (Math.random() < this.dropRate) {
                alert(`Network: Response lost for ${url}`);
                callback({ success: false, error: "Network error. Try again." });
            } else {
                callback(response);
            }
        }, this.getRandomDelay());
    }

    getRandomDelay() {
        return Math.floor(Math.random() * (this.delayMax - this.delayMin) + this.delayMin);
    }
}

const net = new Network();