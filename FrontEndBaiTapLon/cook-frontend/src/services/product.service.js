import createApiClient from "./api.multipart.service";

class ProductService {
    constructor(baseUrl = "/api/products") {
        this.api = createApiClient(baseUrl);
    }
    async getAllByCategory(id) {
        return (await this.api.get(`/?_id_category=${id}`)).data;
    }
    async getProductByName(name) {
        return (await this.api.get("/?name=" + name)).data;
    }
    async getAll() {
        return (await this.api.get("/")).data;
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
        return (await this.api.post(`/${id}`, data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}
export default new ProductService();