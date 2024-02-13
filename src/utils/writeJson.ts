import * as fs from 'fs';

export const writeJson = (path: string, data: any) => {
  const stringData = JSON.stringify(data, null, 2);

  fs.writeFileSync(path, stringData);
}
