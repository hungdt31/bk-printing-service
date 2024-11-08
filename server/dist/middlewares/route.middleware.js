"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundRoute = void 0;
const notFoundRoute = (req, res, next) => {
    res.status(404).send({
        status: 404,
        message: `Cannot ${req.method} ${req.url}`,
    });
};
exports.notFoundRoute = notFoundRoute;
