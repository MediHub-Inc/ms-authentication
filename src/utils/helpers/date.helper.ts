export const isOneHourAgo = (date): boolean => {
  const now = new Date().getTime();
  const dbDate = new Date(date).getTime();
  const oneHour = 1000 * 60 * 60 * 1000;
  const hourago = now - dbDate > oneHour;

  return hourago;
};
