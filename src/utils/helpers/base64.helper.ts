export const decode = (base64String: string): string => {
  return Buffer.from(base64String, 'base64').toString('utf-8');
};
export const encode = (string: string): string => {
  return Buffer.from(string, 'utf-8').toString('base64');
};
