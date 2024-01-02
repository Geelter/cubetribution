import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {Donation} from "../../../models/donation";

@Component({
  selector: 'app-donation-card',
  standalone: true,
  imports: [CommonModule, ButtonModule, NgOptimizedImage],
  templateUrl: './donation-card.component.html',
  styleUrl: './donation-card.component.scss'
})
export class DonationCardComponent {
  @Input({ required: true }) donation!: Donation;
  @Input({ required: true }) deleteMode!: boolean;
  @Output() donationClicked = new EventEmitter<void>();
  @Output() deleteClicked = new EventEmitter<void>();

  handleDonationClick() {
    if (!this.deleteMode) this.donationClicked.emit();
  }

  handleDeleteClick() {
    if (this.deleteMode) this.deleteClicked.emit();
  }
}
