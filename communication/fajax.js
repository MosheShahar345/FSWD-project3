// FXMLHttpRequest class to represent an XMLHttpRequest object
class FXMLHttpRequest {
    constructor() {
        this.data = {};
    }

    // Initialize the XMLHttpRequest object
    open(method, url, isAsync = true, user = null, password = null) {
        this.data = {
            "method": method,
            "url": url,
            "isAsync": isAsync,
            "user": user,
            "password": password
        };
    }

    // Send the XMLHttpRequest object using the provided body and callback function
    send(body = "", func = () => { }) {
        const request = { ...this.data, body };

        if (this.data.isAsync) {
            net.send_to_server_async(request, func);
        } else {
            net.send_to_server(request);
        }
    }
}

const fajax = new FXMLHttpRequest();
