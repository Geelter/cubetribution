import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DonationsService} from "../../../services/donations.service";
import {CardsService} from "../../../services/cards.service";
import {combineLatestWith, map, Observable, switchMap} from "rxjs";
import {Donation} from "../../../models/donation";
import {Card} from "../../../models/card";
import {ToolbarModule} from "primeng/toolbar";
import {ConfirmationService, SharedModule} from "primeng/api";
import {dialogBreakpoints, layoutOptions} from "../../../app.config";
import {SelectButtonModule} from "primeng/selectbutton";
import {ButtonModule} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {LoadingSpinnerComponent} from "../../loading-spinner/loading-spinner.component";
import {CardListComponent} from "../../cards/card-list/card-list.component";
import {ConfirmDialogModule} from "primeng/confirmdialog";

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule, ToolbarModule, SharedModule, SelectButtonModule, ButtonModule, FormsModule, LoadingSpinnerComponent, CardListComponent, ConfirmDialogModule],
  templateUrl: './donation.component.html',
  styleUrl: './donation.component.scss'
})
export class DonationComponent {
  protected readonly dialogBreakpoints = dialogBreakpoints;
  protected readonly layoutOptions = layoutOptions;
  private readonly donationsService = inject(DonationsService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly cardsService = inject(CardsService);

  private readonly donation$: Observable<Donation | null>;
  private readonly donationCards$: Observable<Card[]>;
  vm$: Observable<{donation: Donation | null, donationCards: Card[]}>;

  selectedCards: Card[] = [];

  selectedLayout: string = 'grid';

  confirmDelete(donation: Donation) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove selected cards?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteSelectedCards(donation);
      }
    });
  }

  deleteSelectedCards(donation: Donation) {
    this.donationsService.removeCardsFromDonation(donation, this.selectedCards).then(() => this.selectedCards = []);
  }

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
