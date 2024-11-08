"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
exports.corsOptions = {
    origin: function (origin, callback) {
        return callback(null, true);
    },
    // Some legacy browsers (IE11, various SmartTVs) choke on 204
    optionsSuccessStatus: 200,
    // CORS sẽ cho phép nhận cookies từ request
    credentials: true,
};
