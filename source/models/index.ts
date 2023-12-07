
export interface VideoInfo {
    thumb: string,
    meta: {
        duration: string,
        source: string,
        tags: string[],
        title: string,
        desc: string
    },
    view_count: number,
    formats: Format[],
    channel: string
}

export type Format = {
    url: string
    audio: boolean,
    video: boolean,
    type: 'audio' | 'video_yes_audio' | 'video_no_audio',
    name: string,
    quality: number,
    zest?: any
}