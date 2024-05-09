import { FormatInfo } from "../models";

export const sortByFormat = (formats: FormatInfo[]) => {
  let boxedAudioFalseNoAudioFalse: FormatInfo[] = []; // video có audio
  let boxedAudioTrueNoAudioFalse: FormatInfo[] = []; // audio
  let boxedRemaining: FormatInfo[] = []; // list còn lại

  formats.forEach((item) => {
    if (!item.audio && !item.no_audio) {
      boxedAudioFalseNoAudioFalse.push(item);
    } else if (item.audio && !item.no_audio) {
      boxedAudioTrueNoAudioFalse.push(item);
    } else {
      boxedRemaining.push(item);
    }
  });

  // Sắp xếp các mảng theo trường quality giảm dần (nếu có)
  boxedAudioFalseNoAudioFalse.sort((a, b) => (b.quality && a.quality) ? b.quality - a.quality : 0);
  boxedAudioTrueNoAudioFalse.sort((a, b) => (b.quality && a.quality) ? b.quality - a.quality : 0);
  boxedRemaining.sort((a, b) => (b.quality && a.quality) ? b.quality - a.quality : 0);

  return [
    ...boxedAudioFalseNoAudioFalse,
    ...boxedAudioTrueNoAudioFalse,
    ...boxedRemaining
];
};