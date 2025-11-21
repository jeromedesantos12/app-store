"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExist = isExist;
const client_1 = require("../connections/client");
const error_1 = require("../utils/error");
function isExist(modelName, deleted) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const name = modelName.charAt(0).toUpperCase() + modelName.slice(1);
            const model = yield client_1.prisma[modelName].findUnique({
                where: { id },
            });
            if (model === null) {
                throw (0, error_1.appError)(`${name} Not Found!`, 404);
            }
            if (deleted === false && model && model.deletedAt !== null) {
                throw (0, error_1.appError)(`${name} has been deleted!!`, 404);
            }
            if (deleted === true && model && model.deletedAt === null) {
                throw (0, error_1.appError)(`${name} still exist!!`, 404);
            }
            req.model = model;
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
