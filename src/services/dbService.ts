import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';

let db: Database | null = null;

export const initDB = async () => {
  try {
    db = await open({
      filename: './recipes1.db',
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        username TEXT,
        language_code TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ai_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ingredients TEXT NOT NULL,
        response TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS search_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        query TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS recipe_ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        recipe_id INTEGER NOT NULL,
        rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const saveUser = async (
    userId: number,
    username: string | null,
    firstName: string | null,
    lastName: string | null,
    languageCode: string | null
) => {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  try {
    const result = await db.run(
        'INSERT OR REPLACE INTO users (id, first_name, last_name, username, language_code) VALUES (?, ?, ?, ?, ?)',
        [userId, firstName, lastName, username, languageCode]
    );
    return result.lastID;
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const getCachedResponse = async (ingredients: string): Promise<string | null> => {
  if (!db) return null;

  try {
    const result = await db.get(
        'SELECT response FROM ai_cache WHERE ingredients = ?',
        [ingredients]
    );
    return result ? result.response : null;
  } catch (error) {
    console.error('Error getting cached response:', error);
    return null;
  }
};

export const saveResponseToCache = async (ingredients: string, response: string) => {
  if (!db) return;

  try {
    await db.run(
        'INSERT INTO ai_cache (ingredients, response) VALUES (?, ?)',
        [ingredients, response]
    );
  } catch (error) {
    console.error('Error saving response to cache:', error);
  }
};

export const saveSearchQuery = async (userId: number, query: string): Promise<void> => {
  if (!db) return;

  try {
    await db.run(
        'INSERT INTO search_history (user_id, query) VALUES (?, ?)',
        [userId, query]
    );
  } catch (error) {
    console.error('Error saving search query:', error);
  }
};

export const getUserSearchHistory = async (userId: number): Promise<any[]> => {
  if (!db) return [];

  try {
    const result = await db.all(
        'SELECT query, created_at FROM search_history WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
    );
    return result || [];
  } catch (error) {
    console.error('Error getting user search history:', error);
    return [];
  }
};

export const addRecipeRating = async (userId: number, recipeId: number, rating: number): Promise<void> => {
  if (!db) return;

  try {
    await db.run(
        'INSERT INTO recipe_ratings (user_id, recipe_id, rating) VALUES (?, ?, ?)',
        [userId, recipeId, rating]
    );
  } catch (error) {
    console.error('Error adding recipe rating:', error);
  }
};

export const getRecipeRating = async (recipeId: number): Promise<number> => {
  if (!db) return 0;

  try {
    const result = await db.get(
        'SELECT AVG(rating) as average_rating FROM recipe_ratings WHERE recipe_id = ?',
        [recipeId]
    );
    return result?.average_rating || 0;
  } catch (error) {
    console.error('Error getting recipe rating:', error);
    return 0;
  }
};

export const getUserRatings = async (userId: number): Promise<any[]> => {
  if (!db) return [];

  try {
    const result = await db.all(
        'SELECT recipe_id, rating, created_at FROM recipe_ratings WHERE user_id = ?',
        [userId]
    );
    return result || [];
  } catch (error) {
    console.error('Error getting user ratings:', error);
    return [];
  }
};
