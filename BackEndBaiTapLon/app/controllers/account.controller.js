import ApiError from "../api-error.js";
import MongoDB from "../utils/mongodb.util.js";
import AccountService from "../services/account.service.js";
import Jwt  from "../utils/jwt.util.js";

const accounts = {

    user: async (req, res, next) => {
        const jwtAuth = new Jwt();
        const response = jwtAuth.authenticateToken(req);
        if (response != 200) {
            return res.status(response).send({ message: "Unauthorized" });
        }

        try {
            const accountService = new AccountService(MongoDB.client);
            const document = await accountService.find({ email: req.user.email });
            if (document == []) {
                return next(new ApiError(404, "Account not found"));
            }
            return res.send(document[0]);
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    `Error retrieving contact with id=${req.params.id}`
                )
            );
        }
    },

    login: async (req, res, next) => {
        if (!req.body?.email) {
            return next(new ApiError(400, "Email can not be empty"));
        } else if (!req.body?.password) {
            return next(new ApiError(400, "Password can not be empty"));
        }

        try {
            const accountService = new AccountService(MongoDB.client);
            const document = await accountService.login(req.body);
            if (!document) {
                return next(new ApiError(404, "Account not found"));
            }
            const jwtAuth = new Jwt("secret");
            const token = jwtAuth.generateAccessToken({ email: document.email });
            document.token = token;
            return res.send(document);
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    `Error retrieving contact with id=${req.params.id}`
                )
            );
        }
    },

    create: async (req, res, next) => {
        if (!req.body?.name) {
            return next(new ApiError(400, "Name can not be empty"));
        } else if (!req.body?.email) {
            return next(new ApiError(400, "Email can not be empty"));
        } else if (!req.body?.password) {
            return next(new ApiError(400, "Password can not be empty"));
        } else if (!req.body?.phone) {
            return next(new ApiError(400, "Phone can not be empty"));
        }

        const imagePath =(req.file) ? req.file.path : "public/uploads/default-avatar.jpg";
        try {
            const accountService = new AccountService(MongoDB.client);
            const document = await accountService.create(req.body, imagePath);
            const jwtAuth = new Jwt("secret");
            const token = jwtAuth.generateAccessToken({ email: document.email });
            document.token = token;
            return res.send(document);
        } catch (error) {
            return next(
                new ApiError(500, "An Error occurred while creating the account")
            );
        }
    },

    findAll: async (req, res, next) => {
        let documents = [];
        const jwtAuth = new Jwt();
        const response = jwtAuth.authenticateToken(req);
        if (response != 200) {
            return res.status(response).send({ message: "Unauthorized" });
        }

        try {
            const accountService = new AccountService(MongoDB.client);
            const { name } = req.query;
            if (name) {
                documents = await accountService.findByName(name);
            } else {
                documents = await accountService.find({});
            }
        } catch (error) {
            return next(
                new ApiError(500, "An error occurred while retrieving account")
            );
        }

        return res.send(documents);
    },

    findOne: async (req, res, next) => {
        try {
            const accountService = new AccountService(MongoDB.client);
            const document = await accountService.findById(req.params.id);
            if (!document) {
                return next(new ApiError(404, "Account not found"));
            }
            return res.send(document);
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    `Error retrieving account with id=${req.params.id}`
                )
            );
        }
    },

    update: async (req, res, next) => {
        if (Object.keys(req.body).length == 0) {
            return next(new ApiError(400, "Data to update can not be empty"));
        }
    
        try {
            const accountService = new AccountService(MongoDB.client);
            const document = await accountService.update(req.params.id, req.body);
            if (!document) {
                return next(new ApiError(404, "Account not found"));
            }
            return res.send({ message: "Account was updated successfully" });
        } catch (error) {
            return next(
                new ApiError(500, `Error updating account with id=${req.params.id}`)
            );
        }
        // res.send({ message: "update handler" });
    },

    delete:  async (req, res, next) => {
        try {
            const accountService = new AccountService(MongoDB.client);
            const document = await accountService.delete(req.params.id);
            if (!document) {
                return next(new ApiError(404, "Account not found"));
            }
            return res.send({ message: "Accout was delete successfully" });
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    `Could not delete Account with id=${req.params.id}`
                )
            );
        }
    },

    deleteAll: async (req, res, next) => {
        try {
            const accountService = new AccountService(MongoDB.client);
            const deletedCount = await accountService.deleteAll();
            return res.send({
                message: `${deletedCount} accounts were deleted successfully`,
            });
        } catch (error) {
            return next(
                new ApiError(500, "An error occurred while removing all accounts")
            );
        }
    }
};

export default accounts;