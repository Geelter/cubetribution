import { TestBed } from '@angular/core/testing';

import { ThemeLoaderService } from './theme-loader.service';

describe('ThemeLoaderService', () => {
  let service: ThemeLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
