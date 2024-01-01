import express from 'express';
import { getMetaInstagram } from '../controllers/instagram';
import { getMetaTwitter } from '../controllers/twitter';
import { getMetaYoutue } from '../controllers/youtube';
import { getMetaGeneral, handlerSendMail } from '../controllers/general';
import { getMetaTiktok } from '../controllers/tiktok';
import { getMetaFacebook } from '../controllers/facebook';
import { getMetaTwitch } from '../controllers/twitch';

const router = express.Router();

router.get('/', (req, res) => {
  res.send("ok");
});
router.post('/api/gen/dl', getMetaGeneral);
router.post('/api/yt/dl', getMetaYoutue);
router.post('/api/tik/dl', getMetaTiktok);
router.post('/api/fb/dl', getMetaFacebook);
router.post('/api/tw/dl', getMetaTwitter);

router.post('/api/twitch/dl', getMetaTwitch);
router.post('/api/ins/dl', getMetaInstagram);
router.post('/api/send-email', handlerSendMail);


export default router;