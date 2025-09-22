import SQLite from 'react-native-sqlite-storage';
import {MovieStatus, MovieStatusUpdate} from '../models/movie';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

export interface MovieStatusRecord {
  id: number;
  movie_id: number;
  status: MovieStatus;
  is_favorite: boolean;
  scheduled_date?: string;
  created_at: string;
  updated_at: string;
}

class MovieDatabase {
  private database: SQLite.SQLiteDatabase | null = null;

  async initDatabase(): Promise<void> {
    try {
      this.database = await SQLite.openDatabase({
        name: 'movify.db',
        location: 'default',
      });

      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.database) throw new Error('Database not initialized');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS movie_status (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movie_id INTEGER UNIQUE NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('watched', 'want_to_watch', 'none')),
        is_favorite BOOLEAN NOT NULL DEFAULT 0,
        scheduled_date TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await this.database.executeSql(createTableQuery);
  }

  async updateMovieStatus(update: MovieStatusUpdate): Promise<void> {
    if (!this.database) throw new Error('Database not initialized');

    const {movieId, status, isFavorite, scheduledDate} = update;
    const scheduledDateString = scheduledDate ? scheduledDate.toISOString() : null;

    // First, get current record to preserve existing values
    const currentRecord = await this.getMovieStatus(movieId);
    const currentStatus = currentRecord?.status ?? 'none';
    const currentIsFavorite = currentRecord?.is_favorite ?? false;
    
    const finalStatus = status !== undefined ? status : currentStatus;
    const finalIsFavorite = isFavorite !== undefined ? isFavorite : currentIsFavorite;

    const query = `
      INSERT OR REPLACE INTO movie_status (movie_id, status, is_favorite, scheduled_date, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP);
    `;

    try {
      await this.database.executeSql(query, [movieId, finalStatus, finalIsFavorite ? 1 : 0, scheduledDateString]);
    } catch (error) {
      console.error('Error updating movie status:', error);
      throw error;
    }
  }

  async getMovieStatus(movieId: number): Promise<MovieStatusRecord | null> {
    if (!this.database) throw new Error('Database not initialized');

    const query = 'SELECT * FROM movie_status WHERE movie_id = ?';

    try {
      const [results] = await this.database.executeSql(query, [movieId]);
      
      if (results.rows.length > 0) {
        return results.rows.item(0) as MovieStatusRecord;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting movie status:', error);
      throw error;
    }
  }

  async getAllMovieStatuses(): Promise<MovieStatusRecord[]> {
    if (!this.database) throw new Error('Database not initialized');

    const query = 'SELECT * FROM movie_status ORDER BY updated_at DESC';

    try {
      const [results] = await this.database.executeSql(query);
      const statuses: MovieStatusRecord[] = [];

      for (let i = 0; i < results.rows.length; i++) {
        statuses.push(results.rows.item(i) as MovieStatusRecord);
      }

      return statuses;
    } catch (error) {
      console.error('Error getting all movie statuses:', error);
      throw error;
    }
  }

  async getFavoriteMovies(): Promise<MovieStatusRecord[]> {
    if (!this.database) throw new Error('Database not initialized');

    const query = 'SELECT * FROM movie_status WHERE is_favorite = 1 ORDER BY updated_at DESC';

    try {
      const [results] = await this.database.executeSql(query);
      const statuses: MovieStatusRecord[] = [];

      for (let i = 0; i < results.rows.length; i++) {
        statuses.push(results.rows.item(i) as MovieStatusRecord);
      }

      return statuses;
    } catch (error) {
      console.error('Error getting favorite movies:', error);
      throw error;
    }
  }

  async getMoviesByStatus(status: MovieStatus): Promise<MovieStatusRecord[]> {
    if (!this.database) throw new Error('Database not initialized');

    const query = 'SELECT * FROM movie_status WHERE status = ? ORDER BY updated_at DESC';

    try {
      const [results] = await this.database.executeSql(query, [status]);
      const statuses: MovieStatusRecord[] = [];

      for (let i = 0; i < results.rows.length; i++) {
        statuses.push(results.rows.item(i) as MovieStatusRecord);
      }

      return statuses;
    } catch (error) {
      console.error('Error getting movies by status:', error);
      throw error;
    }
  }

  async removeMovieStatus(movieId: number): Promise<void> {
    if (!this.database) throw new Error('Database not initialized');

    const query = 'DELETE FROM movie_status WHERE movie_id = ?';

    try {
      await this.database.executeSql(query, [movieId]);
    } catch (error) {
      console.error('Error removing movie status:', error);
      throw error;
    }
  }

  async closeDatabase(): Promise<void> {
    if (this.database) {
      await this.database.close();
      this.database = null;
    }
  }
}

export const movieDatabase = new MovieDatabase();