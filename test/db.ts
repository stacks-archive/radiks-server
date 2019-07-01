import { getDB } from '../src/database/mongodb';

const db = async () => {
  const url = process.env.MONGODB_URI;
  return getDB(url);
};

export default db;
