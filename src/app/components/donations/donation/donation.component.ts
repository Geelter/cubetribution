import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DonationsService} from "../../../services/donations.service";
import {CardsService} from "../../../services/cards.service";
import {catchError, combineLatestWith, map, Observable, switchMap, take, throwError} from "rxjs";
import {Donation} from "../../../models/donation";
import {Card} from "../../../models/card";
import {ToolbarModule} from "primeng/toolbar";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {dialogBreakpoints, layoutOptions} from "../../../app.config";
import {SelectButtonModule} from "primeng/selectbutton";
import {ButtonModule} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {LoadingSpinnerComponent} from "../../loading-spinner/loading-spinner.component";
import {CardListComponent} from "../../cards/card-list/card-list.component";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {RequestState} from "../../../helpers/request-state.enum";

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule, ToolbarModule, SharedModule, SelectButtonModule, ButtonModule, FormsModule, LoadingSpinnerComponent, CardListComponent, ConfirmDialogModule],
  templateUrl: './donation.component.html',
  styleUrl: './donation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DonationComponent {
  protected readonly dialogBreakpoints = dialogBreakpoints;
  protected readonly layoutOptions = layoutOptions;
  protected readonly RequestState = RequestState;
  private readonly donationsService = inject(DonationsService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly cardsService = inject(CardsService);

  private readonly donation$: Observable<Donation | undefined> = this.donationsService.selectedDonation$;
  readonly vm$: Observable<{donation: Donation | undefined, donationCards: Card[]}> = this.createViewModel(this.donation$);
  readonly donationsRequestState$ = this.donationsService.requestState$;

  selectedCards: Card[] = [];

  selectedLayout: string = 'grid';

  confirmDelete(donation: Donation) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove selected cards?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.donationsService.removeCardsFromDonation(donation, this.selectedCards).pipe(
          take(1),
          catchError(error => {
            this.showErrorMessage('Deleting selected cards failed', error.message);
            return throwError(() => new Error(error));
          })
        ).subscribe({
          complete: (() => this.showSuccessMessage('Selected cards deleted'))
        });
      }
    });
  }

  private createViewModel(sourceObservable$: Observable<Donation | undefined>) {
    const donationCards$ = sourceObservable$.pipe(
      switchMap(donation =>
        this.cardsService.getCardsForIDs(donation?.cardIDs ?? [])
      )
    );

    return sourceObservable$.pipe(
      combineLatestWith(donationCards$),
      map(([donation, donationCards]) => ({ donation, donationCards }))
    );
  }

  private showSuccessMessage(summary: string) {
    this.messageService.add({
      key: 'global',
      severity: 'success',
      summary: summary
    })
  }

  private showErrorMessage(summary: string, detail: string = '') {
    this.messageService.add({
      key: 'global',
      severity: 'error',
      summary: summary,
      detail: detail
    })
  }
}
