import { MongoClient, Db } from 'mongodb';

export const getDB = async (url?: string): Promise<Db> => {
  const _url =
    url || process.env.MONGODB_URI || 'mongodb://localhost:27017/radiks-server';
  const client = new MongoClient(_url, {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000, // every 1 second
  });
  await client.connect();
  return client.db();
};
