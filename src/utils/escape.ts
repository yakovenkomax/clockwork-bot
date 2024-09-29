export const escape = (message: string) =>
  message.replace(/[_*[\]()~`>#\+=|{}.!-]/g, '\\$&');
