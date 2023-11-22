import createApiClient from "./api.service";

class AuthService {
    constructor(baseUrl = "/api/auth") {
        this.api = createApiClient(baseUrl);
    }

    setToken(token) {
        this.api = createApiClient("/api/auth", token);
    }

    async auth() {
        return (await this.api.get("/")).data;
    }
    async login(data) {
        return (await this.api.post("/", data)).data;
    }
}
export default new AuthService();