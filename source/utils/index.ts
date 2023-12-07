import { Format } from "../models";

export const sortQuality = (a: Format, b: Format) => {
  if (a.quality < b.quality) {
    return 1; 
  } else if (a.quality > b.quality) {
    return -1;
  }
  return 0;
}

export const getVideoSlice = (array: Format[], length: number = 2): Format[] => {
  const tiks = array.slice(0, length);
  tiks.map((tik, index) => {
    if (index == 0) {
      tik.name = 'Download video HD'
    } else {
      tik.name = 'Download video'
    }
  });

  return tiks;
}

export const sortYoutubeResult = (a: Format, b: Format) => {
  const typeOrder = ['video_yes_audio', 'video_no_audio', 'audio'];
  const aTypeIndex = typeOrder.indexOf(a.type);
  const bTypeIndex = typeOrder.indexOf(b.type);

  if (aTypeIndex !== bTypeIndex) {
    return aTypeIndex - bTypeIndex;
  }

  return b.quality - a.quality;
}

export const getYoutubeResult = (result: Format[], item: Format) => {
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