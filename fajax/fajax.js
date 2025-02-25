class Fajax {
    constructor() {
        this.data = {};
    }

    open(method, url, isAsync = true, user = null, password = null) {
        this.data = {
            "method": method,
            "url": url,
            "isAsync": isAsync,
            "user": user,
            "password": password
        };
    }

    send(body = "", func = () => { }) {
        const net = new Network();
        const request = { ...this.data, body };

        if (this.data.isAsync) {
            net.send_to_server_async(request, func);
        } else {
            net.send_to_server(request);
        }
    }
}
