import { Request, Response, NextFunction } from 'express';
import youtubedl, { Format } from 'youtube-dl-exec'
import { extractDomain } from '../utils/helper-url';
import { FormatInfo, VideoInfo } from '../models';
import { sortByFormat } from '../utils';

const getFormatVideo = (data: any[], title: string): FormatInfo[] => {
    const formats = data.map(function(fm: Format) {
        const formatConvert: FormatInfo = {
            name: fm.format_id + '.' + fm.ext,
            url: fm.url,
            audio: fm.audio_ext !== 'none' && fm.video_ext == 'none',
            no_audio: fm.acodec == 'none',
            quality: fm.quality,
            ext: fm.ext
        };
        return formatConvert;
    });

    return sortByFormat(formats);
}

export const getMetaTwitch = async (req: Request, res: Response, next: NextFunction) => {
    const domain = extractDomain(req.body.postUrl);
    youtubedl(req.body.postUrl?.toString () ?? '', {
        allFormats: true,
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
            x.format_note !== 'storyboard'
        );
        const formats = getFormatVideo(resultFilter, result.fulltitle);
        const output: VideoInfo = {
            thumb: result.thumbnail,
            channel: result.channel,
            meta: {
                duration: result.duration_string,
                source: result.original_url,
                title: result.fulltitle,
                tags: result.tags,
                categories: result.categories,
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

export default { getMetaTwitch };
