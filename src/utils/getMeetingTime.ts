export function getTime(providedTime: Date) {
  const dt = new Date(providedTime);

  const hours = dt.getHours() % 12 || 12;
  const minutes = dt.getMinutes();
  const period = dt.getHours() < 12 ? 'AM' : 'PM';

  const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;

  return formattedTime;
}
