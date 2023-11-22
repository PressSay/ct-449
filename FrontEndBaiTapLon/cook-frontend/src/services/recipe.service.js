import createApiClient from "./api.multipart.service";

class RecipeService {
    constructor(baseUrl = "/api/recipes") {
        this.api = createApiClient(baseUrl);
    }
    async getAll() {
        return (await this.api.get("/")).data;
    }
    async getRecipeByName(name) {
        return (await this.api.get("/?name=" + name)).data;
    }
    async getGenre(_id_category) {
        return (await this.api.get("/?_id_category=" + _id_category)).data;
    }
    async getRandom() {
        return (await this.api.get("/?random=true")).data;
    }
    async getChosen() {
        return (await this.api.get("/?chosen=true")).data;
    }
    async getTrending() {
        return (await this.api.get("/?trending=true")).data;
    }
    async getPopular() {
        return (await this.api.get("/?popular=true")).data;
    }
    async getSlider() {
        return (await this.api.get("/?slider=true")).data;
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
export default new RecipeService();