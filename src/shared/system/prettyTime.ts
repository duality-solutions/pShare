export const prettyTime = (secs: number) => {
  let s = secs | 0;
  const seconds = s % 60;
  s = (s / 60) | 0;
  const minutes = s % 60;
  s = (s / 60) | 0;
  const hours = s % 24;
  s = (s / 24) | 0;
  const days = s;
  const segs = [
    days > 0 ? `${days}d` : null,
    hours > 0 ? `${hours}h` : null,
    minutes > 0 ? `${minutes}m` : null,
    seconds > 0 ? `${seconds}s` : null
  ];
  return segs.filter(s => s != null).join(" ");
};
