import { TestBed } from '@angular/core/testing';

import { SupabaseDatabaseService } from './supabase-database.service';

describe('SupabaseDatabaseService', () => {
  let service: SupabaseDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupabaseDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
