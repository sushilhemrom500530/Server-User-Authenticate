"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (err) {
            res.status(400).json({
                message: 'Validation error',
                errors: err.errors || err.message,
            });
        }
    };
};
exports.validate = validate;
