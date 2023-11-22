import { ObjectId } from "mongodb";
import fs from "node:fs";

class AccountService {
    constructor(client) {
        this.Account = client.db().collection("accounts");
        this.Account.createIndex({ email: 1 }, { unique: true });
    }

    extractAccountData(payload, imagePath) {
        const account = {
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            password: payload.password,
            address: payload.address,
            imagePath: imagePath,
            deleted: payload.delete,
        };

        Object.keys(account).forEach(
            (key) => account[key] === undefined && delete account[key]
        );
        return account;
    }

    async login(payload) {
        const account = {
            email: payload.email,
            password: payload.password,
        };
        // handler check
        const result = await this.Account.findOne(account);
        return result;
    }

    async create(payload, imagePath) {
        const account = this.extractAccountData(payload, imagePath);
        const result = await this.Account.findOneAndUpdate(
            account,
            { $set: { deleted: account.deleted === true } },
            { returnDocument: "after", upsert: true }
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.Account.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.Account.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractAccountData(payload);
        const result = await this.Account.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.Account.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        try {
            fs.unlink("./" + result.imagePath, (err) => {
                if (err) throw err;
                console.log('path/file.txt was deleted');
            });
        } catch (error) {
            console.log(error);
        };
        return result;
    }

    async deleteAll() {
        const alldata = await this.find({});
        const result = await this.Account.deleteMany({});
        alldata.forEach((element) => {
            fs.unlink("./" + element.imagePath, (err) => {
                if (err) throw err;
                console.log('path/file.txt was deleted');
            });
        });
        return result;
    }

}

export default AccountService;