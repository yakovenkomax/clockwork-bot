export const escape = (message: string) => message
  .replace(/-/g, '\\-')
  .replace(/\./g, '\\.')
  .replace(/!/g, '\\!');
