import { Request, Response, NextFunction } from 'express';
import youtubedl, { Format } from 'youtube-dl-exec'
import { extractDomain } from '../utils/helper-url';
import { FormatInfo, VideoInfo } from '../models';
import { sortByFormat } from '../utils';
import { exec, spawn } from 'child_process';

const getFormatVideo = (data: any[], title: string): FormatInfo[] => {
    const formats = data.map(function(fm: Format, index: number) {
        const formatConvert: FormatInfo = {
            name: fm.resolution ? (index == 0 ? '720p' : '360p') + '.' + fm.ext  : '',
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

export const fallbackDownloadMethod = async (req: Request, res: Response, next: NextFunction) => {
    const url = extractDomain(req.body.postUrl);
    // If streaming fails, fallback to downloading using yt-dlp as a Python module
    const ytDlpProcess = spawn('CMD', ['D:\\ex\\dl-video-api\\node_modules\\youtube-dl-exec\\bin\\yt-dlp.exe', '-f', '0', '-o', '-', url ?? '']);

    res.setHeader('Content-Type', 'video/mp4');

    ytDlpProcess.stdout.on('data', (chunk) => {
        console.log(`data`);
        res.write(chunk);
    });

    ytDlpProcess.stdout.on('end', () => {
        console.log(`end`);
        res.end();
    });

    ytDlpProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    ytDlpProcess.on('error', (error) => {
        console.error('Failed to start yt-dlp process:', error);
        res.status(500).send('Failed to download video');
    });
}

export const getMetaTiktok = async (req: Request, res: Response, next: NextFunction) => {
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
        cookies: '{"url":"https://www.tiktok.com","cookies":[{"domain":".tiktok.com","hostOnly":false,"httpOnly":true,"name":"tt_csrf_token","path":"/","sameSite":"lax","secure":true,"session":true,"storeId":"0","value":"bZawCZt3-RIoufqTnVT7HewhHkMvpNKRNFzc"},{"domain":".tiktok.com","expirationDate":1730452269.426518,"hostOnly":false,"httpOnly":true,"name":"tt_chain_token","path":"/","sameSite":"unspecified","secure":true,"session":false,"storeId":"0","value":"9XKXaIkrZnRJgkeF185e0g=="},{"domain":".tiktok.com","expirationDate":1714907468.426556,"hostOnly":false,"httpOnly":false,"name":"ak_bmsc","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"0BC66C7E0814B1DA5C80FE6CB6AA48E4~000000000000000000000000000000~YAAQhL4vFzH950GPAQAAkHgFSBdk8Y5AKqdSiZYmsZiJcAbdVCz1bRoaY9onEbfnwHHb2IOe6ij4cWc2Q6nNIWq8Rbc8oq8LLuXN4URH48LbB1k/E+gyc+3gycOgK5dFsqAiy3dzno5Guc/4wCydOFPFEHWJjyQlbecQGm7YO6kXX+ukyaMNUv/t/28FlRZSn8N+X1xZpvdBIYqrTz3lN/HaeabBlFpOSguata7ry0XcVr02yzmUxSPzj6YKwSgptMNZGjKjXC8uRNxGFZGIOiay+14HbQWz9U9FEr0ZFHThUFP2qa720eqIkyAM9mkUsioLGwwBSTyXayAQSS/whYR4SXcEVK0R6qAlUrVx2XLtnlvJ9Bnn1TXc2hzZpgZ7UVg0tGX2x3gVZQ=="},{"domain":".www.tiktok.com","expirationDate":1740820270,"hostOnly":false,"httpOnly":false,"name":"tiktok_webapp_theme","path":"/","sameSite":"unspecified","secure":true,"session":false,"storeId":"0","value":"light"},{"domain":".tiktok.com","expirationDate":1746436270.855515,"hostOnly":false,"httpOnly":true,"name":"ttwid","path":"/","sameSite":"no_restriction","secure":true,"session":false,"storeId":"0","value":"1%7CG0bCCjJhA0YEQfCE22lHkEBmt1H0xXShZQ9W4pTpXFU%7C1714900270%7Caf6417535ac2e5ebc1edfa0412bcfbc44fccb92d0abdccf4521149cb9ac32ff0"},{"domain":".tiktok.com","expirationDate":1746436270.914081,"hostOnly":false,"httpOnly":true,"name":"odin_tt","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"03bf2094bfd563515d18b7d8fe590fc8353efd1b35dc5264ab50ffcbb2bc774ae086c88cfd19f1f85c1f98f6ba91520ba57102337aca26b470c2a08b525c1cfca839fe49cf2958960da6f6bff0e46edb"},{"domain":".tiktok.com","expirationDate":1715765293.315101,"hostOnly":false,"httpOnly":false,"name":"msToken","path":"/","sameSite":"no_restriction","secure":true,"session":false,"storeId":"0","value":"1-MkBR3LFxo1Y3a9cc3dFKkxLEgBqbR6A8EWytmy4LC6nGVqeGvp1yiEzDzO7nGrlxEQM-pbJHpNQ_uvR6xF1Ag3sueFsZx-Iz12cSVzjU0Gs8RNUoF-TB2n0i3UeDATeNK3-w=="},{"domain":"www.tiktok.com","expirationDate":1722677293,"hostOnly":true,"httpOnly":false,"name":"msToken","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"1-MkBR3LFxo1Y3a9cc3dFKkxLEgBqbR6A8EWytmy4LC6nGVqeGvp1yiEzDzO7nGrlxEQM-pbJHpNQ_uvR6xF1Ag3sueFsZx-Iz12cSVzjU0Gs8RNUoF-TB2n0i3UeDATeNK3-w=="}]}'
    }).then((result: any) => {
        // res.send(result);
        // return;
        const resultFilter = result.formats
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

export default { getMetaTiktok };
