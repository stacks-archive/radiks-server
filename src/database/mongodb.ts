import { MongoClient, Db } from 'mongodb';

let client: MongoClient;

export const getClient = async (url?: string) => {
  const _url =
    url || process.env.MONGODB_URI || 'mongodb://localhost:27017/radiks-server';

  if (!client) {
    client = new MongoClient(_url);
    await client.connect();
  }
  return client;
};

export const getDB = async (url?: string): Promise<Db> => {
  const client = await getClient(url);
  return client.db();
};
