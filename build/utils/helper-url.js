"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDomain = void 0;
function extractDomain(str) {
    const domainRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+)/;
    const match = str.match(domainRegex);
    if (match) {
        return match[1];
    }
    else {
        return null;
    }
}
exports.extractDomain = extractDomain;
