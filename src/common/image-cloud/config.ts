import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: 'soterrenos',
  keyFilename: './gcp-service-account.json',
});

export const bucket = storage.bucket('soterrenos-image-storage');