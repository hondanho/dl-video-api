import { Request, Response, NextFunction } from 'express';
import youtubedl from 'youtube-dl-exec'
import { extractDomain } from '../utils/helper-url';
import { Format } from '../models';
import { getVideoSlice, sortQuality } from '../utils';
import { TiktokInfo } from '../models/tiktok';

const getFormatVideo = (data: any[]): Format[] => {
    const formats = data.map(function(fm: any) {
        const format: Format = {
            url: fm.url,
            audio: false,
            video: false,
            type: 'audio',
            name: '',
            quality: fm.tbr
        };
        format.type = 'video_yes_audio';

        return format;
    });

    formats.sort(sortQuality);
    return getVideoSlice(formats, 2);
}

export const getMetaTiktok = async (req: Request, res: Response, next: NextFunction) => {
    const domain = extractDomain(req.body.postUrl);
    console.log(domain)
    youtubedl(req.body.postUrl?.toString () ?? '', {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        ignoreErrors: true,
        preferFreeFormats: true,
        flatPlaylist: true,
        quiet: true,
        skipDownload: true,
        geoBypass: true,
        addHeader: [`referer:${domain}`, 'user-agent:googlebot']
    }).then((result: any) => {
        // res.send(result)
        // return result;
        const resultFilter = result.formats.filter((x: any) => 
            x.format_note !== 'storyboard' &&
            x.format_note !== 'Default'
        );
        
        const formats = getFormatVideo(resultFilter);
        const output: TiktokInfo = {
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
        
        res.send(output)
    })
    .catch(ex => res.send(500))
};

export default { getMetaTiktok };
