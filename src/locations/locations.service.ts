
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

interface StateWithCities {
  state: string;
  cities: string[];
}

@Injectable()
export class LocationsService {
  constructor(private readonly entityManager: EntityManager) { }

  private sortCities(cities: unknown): string[] {
    if (!Array.isArray(cities)) return [];

    return cities
      .filter(city => typeof city === 'string')
      .sort((a, b) => a.localeCompare(b));
  }

  async getActiveLocations() {
    const query = `
      SELECT 
        address->>'state' as state,
        ARRAY_AGG(DISTINCT address->>'city') as cities
      FROM land
      WHERE active = true
      GROUP BY address->>'state'
      ORDER BY address->>'state'
    `;

    const result = await this.entityManager.query<StateWithCities[]>(query);

    return result.map(row => ({
      state: row.state,
      cities: this.sortCities(row.cities)
    }));
  }
}