import createApiClient from "./api.service";

class ReviewService {
    constructor(baseUrl = "/api/reviews") {
        this.api = createApiClient(baseUrl);
    }

    async getByRecipeId(id) {
        return (await this.api.get(`/?_id_recipe=${id}`)).data;
    }
    async getByProductId(id) { 
        return (await this.api.get(`/?_id_product=${id}`)).data;
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
    async getOne(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}
export default new ReviewService();