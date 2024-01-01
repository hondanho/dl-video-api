"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const instagram_1 = require("../controllers/instagram");
const twitter_1 = require("../controllers/twitter");
const youtube_1 = require("../controllers/youtube");
const general_1 = require("../controllers/general");
const tiktok_1 = require("../controllers/tiktok");
const facebook_1 = require("../controllers/facebook");
const twitch_1 = require("../controllers/twitch");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.send("ok");
});
router.post('/api/gen/dl', general_1.getMetaGeneral);
router.post('/api/yt/dl', youtube_1.getMetaYoutue);
router.post('/api/tik/dl', tiktok_1.getMetaTiktok);
router.post('/api/fb/dl', facebook_1.getMetaFacebook);
router.post('/api/tw/dl', twitter_1.getMetaTwitter);
router.post('/api/twitch/dl', twitch_1.getMetaTwitch);
router.post('/api/ins/dl', instagram_1.getMetaInstagram);
router.post('/api/send-email', general_1.handlerSendMail);
exports.default = router;
