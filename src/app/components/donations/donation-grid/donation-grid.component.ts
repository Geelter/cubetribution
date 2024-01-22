import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToolbarModule} from "primeng/toolbar";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {SelectButtonModule} from "primeng/selectbutton";
import {FormsModule} from "@angular/forms";
import {DonationsService} from "../../../services/donations.service";
import {Donation} from "../../../models/donation";
import {Router} from "@angular/router";
import {DonationCardComponent} from "../donation-card/donation-card.component";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {dialogBreakpoints} from "../../../app.config";
import {catchError, map, take, throwError} from "rxjs";
import {RequestState} from "../../../helpers/request-state.enum";
import {LoadingSpinnerComponent} from "../../loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-donation-grid',
  standalone: true,
  imports: [CommonModule, ToolbarModule, SharedModule, ButtonModule, SelectButtonModule, FormsModule, DonationCardComponent, ConfirmDialogModule, LoadingSpinnerComponent],
  templateUrl: './donation-grid.component.html',
  styleUrl: './donation-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DonationGridComponent {
  protected readonly dialogBreakpoints = dialogBreakpoints;
  protected readonly RequestState = RequestState;
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly donationsService = inject(DonationsService);
  private readonly donationList$ = this.donationsService.donations$;

  readonly pendingDonations$ = this.donationList$.pipe(
    map(donations => donations?.filter(donation => !donation.accepted) ?? [])
  );

  readonly acceptedDonations$ = this.donationList$.pipe(
    map(donations => donations?.filter(donation => donation.accepted) ?? [])
  );

  donationsRequestState$ = this.donationsService.requestState$;

  showErrorDialog(error: Error) {
    this.confirmationService.confirm({
      message: error.message,
      header: 'Error fetching donations',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.donationsService.fetchDonations().pipe(
          take(1),
          catchError(error => {
            this.showErrorDialog(error);
            return throwError(() => new Error(error));
          })
        ).subscribe({
          complete: (() => this.showSuccessMessage('Donations fetched'))
        });
      },
      reject: () => {
        this.router.navigate(['..']);
      }
    })
  }

  selectedDonationStatus: string = 'pending';
  donationStatusOptions = [
    { label: 'Pending', status: 'pending' },
    { label: 'Accepted', status: 'accepted' }
  ];

  deleteMode: boolean = false;

  toggleDeleteMode() {
    if (this.selectedDonationStatus != 'pending') return;

    this.deleteMode = !this.deleteMode;
  }

  refreshDonations() {
    this.donationsService.fetchDonations().pipe(
      take(1),
      catchError(error => {
        this.showErrorMessage('Fetching donations failed', error.message);
        return throwError(() => new Error(error));
      })
    ).subscribe({
      complete: (() => this.showSuccessMessage('Donations refreshed'))
    });
  }

  selectDonation(donation: Donation) {
    this.donationsService.selectDonation(donation);
    this.router.navigate(['/donations', 'list', 'detail']);
  }

  confirmDelete(donation: Donation) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete selected donation?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.donationsService.deleteDonation(donation).pipe(
          take(1),
          catchError(error => {
            this.showErrorMessage('Deleting donation failed', error.message);
            return throwError(() => new Error(error));
          })
        ).subscribe({
          complete: (() => this.showSuccessMessage('Donation deleted'))
        });
      }
    });
  }

  handleOptionClick(event: any) {
    if (event.option.status == 'accepted') this.deleteMode = false;
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

  constructor() {
    this.donationsService.getDonations().pipe(
      take(1),
      catchError(error => {
        this.showErrorDialog(error);
        return throwError(() => new Error(error));
      })
    ).subscribe();
  }
}
