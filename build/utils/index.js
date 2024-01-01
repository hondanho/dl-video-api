"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYoutubeResult = exports.sortYoutubeResult = exports.getVideoSlice = exports.sortQuality = void 0;
const sortQuality = (a, b) => {
    if (a.quality < b.quality) {
        return 1;
    }
    else if (a.quality > b.quality) {
        return -1;
    }
    return 0;
};
exports.sortQuality = sortQuality;
const getVideoSlice = (array, length = 2) => {
    const tiks = array.slice(0, length);
    tiks.map((tik, index) => {
        if (index == 0) {
            tik.name = 'Download video HD';
        }
        else {
            tik.name = 'Download video';
        }
    });
    return tiks;
};
exports.getVideoSlice = getVideoSlice;
const sortYoutubeResult = (a, b) => {
    const typeOrder = ['video_yes_audio', 'video_no_audio', 'audio'];
    const aTypeIndex = typeOrder.indexOf(a.type);
    const bTypeIndex = typeOrder.indexOf(b.type);
    if (aTypeIndex !== bTypeIndex) {
        return aTypeIndex - bTypeIndex;
    }
    return b.quality - a.quality;
};
exports.sortYoutubeResult = sortYoutubeResult;
const getYoutubeResult = (result, item) => {
    const found = result.find(element => element.type === item.type);
    if (!found) {
        switch (item.type) {
            case 'video_yes_audio':
                item.name = 'Download video HD';
                break;
            case 'video_no_audio':
                item.name = 'Download mp4 no audio';
                break;
            case 'audio':
                item.name = 'Download only audio';
                break;
            default:
                break;
        }
        result.push(item);
    }
    return result;
};
exports.getYoutubeResult = getYoutubeResult;
