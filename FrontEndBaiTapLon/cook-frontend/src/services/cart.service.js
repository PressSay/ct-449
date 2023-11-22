import createApiClient from "./api.service";

class CartService {
    constructor(baseUrl = "/api/carts") {
        this.api = createApiClient(baseUrl);
    }
    async getAll(_id_account = "", paid = "") {
        return (_id_account != "") ? (await this.api.get(`/?_id_account=${_id_account}`)).data : (paid == "normal") ?
            (await this.api.get(`/?paid=normal`)).data : (paid == "paid") ?
                (await this.api.get(`/?paid=paid`)).data : (await this.api.get("/")).data;
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
    async deleteAll() {
        return (await this.api.delete("/")).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}
export default new CartService();