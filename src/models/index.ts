import { AudioEXTEnum } from "youtube-dl-exec";

export interface VideoInfo {
    thumb: string,
    meta: {
        duration: string,
        source: string,
        tags: string[],
        categories: string[],
        title: string,
        desc: string
    },
    view_count: number,
    formats: FormatInfo[],
    channel: string
}

export type FormatInfo = {
    name: string,
    url: string,
    audio: boolean, // check by audio_ext && video_ext
    no_audio: boolean,
    quality: number | undefined,
    ext: AudioEXTEnum,
    cookies?: string
}