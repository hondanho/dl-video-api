import { VideoInfo } from './index'

export interface TiktokInfo extends VideoInfo {
    meta: {
        duration: string,
        source: string,
        tags: string[],
        title: string,
        desc: string,
        uploader: string | undefined
    }
}