import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';

let db: Database | null = null;

export const initDB = async () => {
  db = await open({
    filename: './recipes.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS ai_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ingredients TEXT NOT NULL,
        response TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_queries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        ingredients TEXT NOT NULL,
        response_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (response_id) REFERENCES ai_cache (id)
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (recipe_id) REFERENCES recipes(id)
    );
  `);
};

export const getCachedResponse = async (ingredients: string): Promise<string | null> => {
  const result = await db?.get(
      'SELECT response FROM ai_cache WHERE ingredients = ?',
      [ingredients]
  );
  return result ? result.response : null;
};

export const saveResponseToCache = async (ingredients: string, response: string) => {
  await db?.run(
      'INSERT INTO ai_cache (ingredients, response) VALUES (?, ?)',
      [ingredients, response]
  );
};

export const saveUserQuery = async (userId: number, ingredients: string, responseId: number | null) => {
  await db?.run(
      'INSERT INTO user_queries (user_id, ingredients, response_id) VALUES (?, ?, ?)',
      [userId, ingredients, responseId]
  );
};

export const saveSearchQuery = async (userId: number, query: string): Promise<void> => {
  await db?.run(
      'INSERT INTO search_history (user_id, query) VALUES (?, ?)',
      [userId, query]
  );
};

export const getUserSearchHistory = async (userId: number): Promise<any[]> => {
  const result = await db?.all(
      'SELECT query, created_at FROM search_history WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
  );
  return result || [];
};

export const addRecipeRating = async (userId: number, recipeId: number, rating: number): Promise<void> => {
  await db?.run(
      'INSERT INTO recipe_ratings (user_id, recipe_id, rating) VALUES (?, ?, ?)',
      [userId, recipeId, rating]
  );
};

export const getRecipeRating = async (recipeId: number): Promise<number> => {
  const result = await db?.get(
      'SELECT AVG(rating) as average_rating FROM recipe_ratings WHERE recipe_id = ?',
      [recipeId]
  );
  return result?.average_rating || 0;
};

export const getUserRatings = async (userId: number): Promise<any[]> => {
  const result = await db?.all(
      'SELECT recipe_id, rating, created_at FROM recipe_ratings WHERE user_id = ?',
      [userId]
  );

  return result || [];
};
