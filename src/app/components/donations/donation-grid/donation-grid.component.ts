import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToolbarModule} from "primeng/toolbar";
import {ConfirmationService, SharedModule} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {SelectButtonModule} from "primeng/selectbutton";
import {FormsModule} from "@angular/forms";
import {DonationsService} from "../../../services/donations.service";
import {Donation} from "../../../models/donation";
import {Router} from "@angular/router";
import {DonationCardComponent} from "../donation-card/donation-card.component";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {dialogBreakpoints} from "../../../app.config";
import {map} from "rxjs";

@Component({
  selector: 'app-donation-grid',
  standalone: true,
  imports: [CommonModule, ToolbarModule, SharedModule, ButtonModule, SelectButtonModule, FormsModule, DonationCardComponent, ConfirmDialogModule],
  templateUrl: './donation-grid.component.html',
  styleUrl: './donation-grid.component.scss'
})
export class DonationGridComponent {
  protected readonly dialogBreakpoints = dialogBreakpoints;
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly donationsService = inject(DonationsService);
  private readonly donationList$ = this.donationsService.donations$;

  readonly pendingDonations$ = this.donationList$.pipe(
    map(donations => donations?.filter(donation => !donation.accepted) ?? [])
  );

  readonly acceptedDonations$ = this.donationList$.pipe(
    map(donations => donations?.filter(donation => donation.accepted) ?? [])
  );

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
    this.donationsService.getDonations();
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
        this.deleteDonation(donation);
      }
    });
  }

  private deleteDonation(donation: Donation) {
    this.donationsService.deleteDonation(donation);
  }

  handleOptionClick(event: any) {
    if (event.option.status == 'accepted') this.deleteMode = false;
  }

  constructor() {
    this.donationsService.initializeDonations();
  }
}
