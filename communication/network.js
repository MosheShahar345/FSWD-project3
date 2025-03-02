class Network {
    constructor() {
        this.delayMin = 1000; // 1 second minimum delay
        this.delayMax = 3000; // 3 seconds maximum delay
        this.dropRate = 0.1; // 10% chance of request failure
    }

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

    send_to_server_async(request, callback) {
        console.log(`Network: Sending async request to ${request.url}`);

        setTimeout(() => {
            if (Math.random() < this.dropRate) {
                console.warn(`Network: Request to ${request.url} failed (simulated loss)`);
                callback({ success: false, error: "Network error. Try again." });
                return;
            }

            if (request.url.startsWith("/auth")) {
                authServer.handleRequest(request.url, request.method, request.body, callback);
            } else if (request.url.startsWith("/reservations")) {
                reservationServer.handleRequest(request.url, request.method, request.body, callback);
            } else {
                callback({ success: false, error: "Unknown endpoint" });
            }
        }, this.getRandomDelay());
    }

    getRandomDelay() {
        return Math.floor(Math.random() * (this.delayMax - this.delayMin) + this.delayMin);
    }
}