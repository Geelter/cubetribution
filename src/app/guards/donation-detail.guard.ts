import {CanActivateFn} from '@angular/router';

export const donationDetailGuard: CanActivateFn = (route, state) => {
  return true;
};
