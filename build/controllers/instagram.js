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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetaInstagram = void 0;
const youtube_dl_exec_1 = __importDefault(require("youtube-dl-exec"));
const helper_url_1 = require("../utils/helper-url");
const utils_1 = require("../utils");
const getFormatVideo = (data) => {
    const formats = data.map(function (fm) {
        const format = {
            url: fm.url,
            audio: false,
            video: false,
            type: 'audio',
            name: '',
            quality: fm.format_note.replace(/\D/g, ''),
        };
        if (fm.asr) {
            format.audio = true;
        }
        if (fm.resolution !== 'audio only') {
            format.video = true;
        }
        if (format.audio && format.video) {
            format.type = 'video_yes_audio';
        }
        else if (format.audio && !format.video) {
            format.type = 'audio';
        }
        else if (!format.audio && format.video) {
            format.type = 'video_no_audio';
        }
        return format;
    });
    formats.sort(utils_1.sortYoutubeResult);
    return formats.reduce(utils_1.getYoutubeResult, []);
};
const getMetaInstagram = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const domain = (0, helper_url_1.extractDomain)(req.body.postUrl);
    (0, youtube_dl_exec_1.default)((_b = (_a = req.body.postUrl) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '', {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        ignoreErrors: true,
        preferFreeFormats: true,
        skipDownload: true,
        geoBypass: true,
        verbose: true,
        addHeader: [
            `referer:${domain}`,
            'user-agent:googlebot'
        ]
    }).then((result) => {
        res.send(result);
        return;
    })
        .catch(ex => {
        console.log(ex);
        res.send(500);
    });
});
exports.getMetaInstagram = getMetaInstagram;
exports.default = { getMetaInstagram: exports.getMetaInstagram };
