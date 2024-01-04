import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DonationsService} from "../../../services/donations.service";
import {CardsService} from "../../../services/cards.service";
import {combineLatestWith, map, Observable, switchMap} from "rxjs";
import {Donation} from "../../../models/donation";
import {Card} from "../../../models/card";

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donation.component.html',
  styleUrl: './donation.component.scss'
})
export class DonationComponent {
  private readonly donationsService = inject(DonationsService);
  private readonly cardsService = inject(CardsService);

  private readonly donation$: Observable<Donation | null>;
  private readonly donationCards$: Observable<Card[]>;
  vm$: Observable<{donation: Donation | null, donationCards: Card[]}>;

  constructor() {
    this.donation$ = this.donationsService.selectedDonation$;
    this.donationCards$ = this.donationsService.selectedDonation$.pipe(
      switchMap(donation =>
        this.cardsService.getCardsForIDs(donation?.cardIDs ?? [])
      )
    );

    this.vm$ = this.donation$.pipe(
      combineLatestWith(this.donationCards$),
      map(([donation, donationCards]) => ({ donation, donationCards }))
    );
  }
}
