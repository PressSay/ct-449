import createApiClient from "./api.service";

class CategoryService {
    constructor(baseUrl = "/api/categories") {
        this.api = createApiClient(baseUrl);
    }
    async getAllRecipe() {
        return (await this.api.get("/recipe")).data;
    }
    async getAllProduct() { 
        return (await this.api.get('/product')).data;
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
export default new CategoryService();