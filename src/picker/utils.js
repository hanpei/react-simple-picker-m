export function paddingLeft(num, length) {
  if ((num + '').length >= length) {
    return num.toString();
  }
  return paddingLeft('0' + num, length);
}

export function formatTimestamp(timestamp, form = 'yyyy-MM-dd') {
  const date = new Date(timestamp);
  if (!form) return date;
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  return form
    .replace('yyyy', paddingLeft(year, 2))
    .replace('MM', paddingLeft(month, 2))
    .replace('dd', paddingLeft(day, 2))
    .replace('HH', paddingLeft(hours, 2))
    .replace('mm', paddingLeft(minutes, 2))
    .replace('ss', paddingLeft(seconds, 2));
}