export const escape = (message: string) =>
  message.replace(/[\[\]()~`>#\+={}.!-]/g, '\\$&');
