import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(private connection: Connection) { }

  async checkConnection() {
    try {
      await this.connection.query('SELECT 1');
      return true;
    } catch (error) {
      return error as string;
    }
  }
}
