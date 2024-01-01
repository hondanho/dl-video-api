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
exports.getMetaTwitch = void 0;
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
            quality: fm.height
        };
        format.type = 'video_yes_audio';
        return format;
    });
    formats.sort(utils_1.sortQuality);
    return (0, utils_1.getVideoSlice)(formats, 2);
};
const getMetaTwitch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const domain = (0, helper_url_1.extractDomain)(req.body.postUrl);
    console.log(domain);
    (0, youtube_dl_exec_1.default)((_b = (_a = req.body.postUrl) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '', {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        ignoreErrors: true,
        preferFreeFormats: true,
        flatPlaylist: true,
        quiet: true,
        skipDownload: true,
        geoBypass: true,
        addHeader: [`referer:${domain}`, 'user-agent:googlebot'],
        // Add additional options to speed up the download
        socketTimeout: 5000, // Set socket timeout to 5 seconds
        retries: 3, // Retry up to 3 times if the download fails
        callHome: true, // Disable contacting the youtube-dl server
        noPart: true, // Disable downloading video in parts
        noCacheDir: true, // Disable caching downloaded files
        noPlaylist: true, // Disable downloading playlists
        noMtime: true,
    }).then((result) => {
        // res.send(result)
        // return result;
        const resultFilter = result.formats.filter((x) => x.format_note !== 'storyboard' &&
            x.format_note !== 'Default');
        const formats = getFormatVideo(resultFilter);
        const output = {
            thumb: result.thumbnail,
            channel: result.creator,
            meta: {
                duration: result.duration_string,
                source: result.original_url,
                title: result.fulltitle,
                tags: result.tags,
                desc: result.description,
                uploader: result.uploader
            },
            view_count: result.view_count,
            formats
        };
        res.send(output);
    })
        .catch(ex => res.send(500));
});
exports.getMetaTwitch = getMetaTwitch;
exports.default = { getMetaTwitch: exports.getMetaTwitch };
