import * as fs from 'fs';

export const readJson = (path: string) => {
  try {
    const sourceData = fs.readFileSync(path, { encoding: 'utf-8' });
    const data = JSON.parse(sourceData);

    return data;
  } catch (e) {
    return {};
  }
};
