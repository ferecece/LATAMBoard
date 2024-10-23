export function escapeHTML(str) {
  return str.replace(
    /[&<>"']/g,
    (match) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[match])
  );
}

export function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function humanizeDate(dateString) {
  const eventDate = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - eventDate) / 1000);
  const rtf = new Intl.RelativeTimeFormat(navigator.language, {
    numeric: "auto",
  });

  if (diffInSeconds < 60) return rtf.format(-diffInSeconds, "second");
  if (diffInSeconds < 3600)
    return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
  if (diffInSeconds < 86400)
    return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
  if (diffInSeconds < 2592000)
    return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
  if (diffInSeconds < 31536000)
    return rtf.format(-Math.floor(diffInSeconds / 2592000), "month");
  return rtf.format(-Math.floor(diffInSeconds / 31536000), "year");
}

export function gradient(startColor, endColor, length) {
  const result = [];
  for (let i = 0; i < length; i++) {
    const ratio = i / (length - 1);
    const color = startColor.map((start, j) =>
      Math.round(start + ratio * (endColor[j] - start))
    );
    result.push(color.map((c) => c.toString(16).padStart(2, "0")).join(""));
  }
  return result;
}
