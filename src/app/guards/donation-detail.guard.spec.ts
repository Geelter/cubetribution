import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { donationDetailGuard } from './donation-detail.guard';

describe('donationDetailGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => donationDetailGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
