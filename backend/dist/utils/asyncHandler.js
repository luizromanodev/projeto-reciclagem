"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Wrapper para lidar com erros em funções assíncronas do Express
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.default = asyncHandler;
