import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

class CustomPool {
  constructor() {
    if (!CustomPool.instance) {
      this.pool = new Pool({
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT || 5432,
        ssl: {
          rejectUnauthorized: false
        }
      });
      CustomPool.instance = this;
    }
    return CustomPool.instance;
  }

  async query(text, params) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Error during database query:', error);
      throw error;
    }
  }

  async getClient() {
    const client = await this.pool.connect();
    const queryRelease = client.query;
    const timeout = setTimeout(() => {
      console.error('A client has been checked out for more than 5 seconds!');
      console.error(`The last executed query on this client was: ${client.lastQuery}`);
    }, 5000);

    client.query = (...args) => {
      client.lastQuery = args;
      return queryRelease.apply(client, args);
    };

    client.release = () => {
      clearTimeout(timeout);
      client.query = queryRelease;
      return this.pool.release(client);
    };

    return client;
  }
}

const db = new CustomPool(); // Create a singleton instance
export default db;
