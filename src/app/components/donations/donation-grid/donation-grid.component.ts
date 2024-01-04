import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToolbarModule} from "primeng/toolbar";
import {SharedModule} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {SelectButtonModule} from "primeng/selectbutton";
import {FormsModule} from "@angular/forms";
import {DonationsService} from "../../../services/donations.service";

@Component({
  selector: 'app-donation-grid',
  standalone: true,
  imports: [CommonModule, ToolbarModule, SharedModule, ButtonModule, SelectButtonModule, FormsModule],
  templateUrl: './donation-grid.component.html',
  styleUrl: './donation-grid.component.scss'
})
export class DonationGridComponent {
  private readonly donationsService = inject(DonationsService);

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

  constructor() {
    this.donationsService.initializeDonations();
  }
}
