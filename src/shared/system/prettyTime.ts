export const prettyTime = (secs: number) => {
    let s = secs | 0;
    const seconds = s % 60;
    s = (s / 60) | 0;
    const minutes = s % 60;
    s = (s / 60) | 0;
    const hours = s;
    const segs = [
        hours > 0 ? `${hours}h` : null,
        minutes > 0 ? `${minutes}m` : null,
        seconds > 0 ? `${seconds}s` : null
    ];
    return segs.filter(s => s != null).join(" ");
};
