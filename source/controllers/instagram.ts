import { Request, Response, NextFunction } from 'express';
import youtubedl from 'youtube-dl-exec'
import { extractDomain } from '../utils/helper-url';
import { Format } from '../models';
import { getYoutubeResult, sortYoutubeResult } from '../utils';

const getFormatVideo = (data: any[]): Format[] => {
    const formats = data.map(function(fm: any) {
        const format: Format = {
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

    formats.sort(sortYoutubeResult);
    return formats.reduce(getYoutubeResult, []);
}

export const getMetaInstagram = async (req: Request, res: Response, next: NextFunction) => {
    const domain = extractDomain(req.body.postUrl);
    youtubedl(req.body.postUrl?.toString () ?? '', {
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
    }).then((result: any) => {
        res.send(result);
        return;
    })
    .catch(ex => {
        console.log(ex)
        res.send(500)
    })
};

export default { getMetaInstagram };
