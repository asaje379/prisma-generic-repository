"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyObject = void 0;
function stringifyObject(data) {
    const result = {};
    for (const item in data) {
        result[item] = String(data[item]);
    }
    return result;
}
exports.stringifyObject = stringifyObject;
//# sourceMappingURL=helpers.js.map