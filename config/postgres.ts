import { Pool } from 'pg';

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'defaultuser',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'jobit_db',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

// Function to get a database client
export const getDbClient = async () => {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

// Function to execute a query
export const executeQuery = async (query: string, params?: any[]) => {
  const client = await getDbClient();
  try {
    const result = await client.query(query, params);
    client.release();
    return result;
  } catch (error) {
    client.release();
    console.error('Error executing query:', error);
    throw error;
  }
};