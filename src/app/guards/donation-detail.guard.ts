import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {DonationsService} from "../services/donations.service";
import {switchMap} from "rxjs";

export const donationDetailGuard: CanActivateFn = () => {
  const router = inject(Router);
  const donationsService = inject(DonationsService);

  return donationsService.selectedDonation$.pipe(
    switchMap(async (selectedDonation) =>
      selectedDonation ? true : router.parseUrl('/donation/list')
    )
  );
};
