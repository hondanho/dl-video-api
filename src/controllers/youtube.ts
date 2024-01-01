import { Request, Response, NextFunction } from 'express';
import youtubedl from 'youtube-dl-exec'
import { extractDomain } from '../utils/helper-url';
import { Format, VideoInfo } from '../models';
import { getYoutubeResult, sortYoutubeResult } from '../utils';

const getFormatVideo = (data: any[]): Format[] => {
    const formats = data.map(function(fm: any) {
        const format: Format = {
            url: fm.url + '&title=downloadvideoonline',
            audio: false,
            video: false,
            type: 'audio',
            name: '',
            quality: Number(fm.format_note.replace(/\D/g, ''))
        };
        if (fm.resolution == 'audio only' || fm.resolution == '176x144' || fm.asr != null) {
            format.audio = true;
        }
        if (fm.resolution !== 'audio only' && fm.resolution !== '176x144') {
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

export const getMetaYoutue = async (req: Request, res: Response, next: NextFunction) => {
    const domain = extractDomain(req.body.postUrl);
    youtubedl(req.body.postUrl?.toString () ?? '', {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        ignoreErrors: true,
        preferFreeFormats: true,
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
    }).then((result: any) => {
        const resultFilter = result.formats.filter((x: any) => 
            x.format_note &&
            x.format_note !== 'storyboard' &&
            x.format_note !== 'Default'
        );
        const formats = getFormatVideo(resultFilter);
        const output: VideoInfo = {
            thumb: result.thumbnail,
            channel: result.channel,
            meta: {
                duration: result.duration_string,
                source: result.original_url,
                title: result.fulltitle,
                tags: result.tags,
                desc: result.description
            },
            view_count: result.view_count,
            formats
        };
        res.send(output)
    })
    .catch(ex => {
        console.log(ex);
        res.send(500)
    })
};

export default { getMetaYoutue };
