import {inject, Injectable} from '@angular/core';
import {SupabaseDatabaseService} from "./supabase/supabase-database.service";
import {BehaviorSubject, map} from "rxjs";
import {Donation} from "../models/donation";
import {Collection} from "../models/collection";
import {Cube} from "../models/cube";
import {Card} from "../models/card";

@Injectable({
  providedIn: 'root'
})
export class DonationsService {
  private readonly databaseService = inject(SupabaseDatabaseService);

  private donations = new BehaviorSubject<Map<number, Donation> | null>(null);
  donations$ = this.donations.asObservable()
    .pipe(
      map(donationMap => {
        return donationMap
          ? Array.from(donationMap.values())
          : null
      })
    );

  private selectedDonation = new BehaviorSubject<Donation | null>(null);
  selectedDonation$ = this.selectedDonation.asObservable();

  private requestInProgress = new BehaviorSubject<boolean>(false);
  requestInProgress$ = this.requestInProgress.asObservable();

  async initializeDonations() {
    const donationsValue = this.donations.getValue();

    if (!donationsValue || !donationsValue.size) {
      await this.getDonations();
    }
  }

  async getDonations() {
    this.requestInProgress.next(true);

    const donations = await this.databaseService.fetchDonations();

    this.requestInProgress.next(false);

    if (donations) {
      this.donations.next(donations);
    }
  }

  clearFetchedDonations() {
    this.donations.next(null);
  }

  async createDonation(collection: Collection, cube: Cube) {
    this.requestInProgress.next(true);

    const createdDonation = await this.databaseService.createDonationForCube(collection, cube);

    if (createdDonation) {
      const currentDonations = this.donations.getValue() ?? new Map<number, Donation>();

      this.donations.next(currentDonations.set(createdDonation.id, createdDonation));
    }

    this.requestInProgress.next(false);
  }

  async removeCardsFromDonation(donation: Donation, cards: Card[]) {
    this.requestInProgress.next(true);

    const idsToRemove = cards.map(card => card.id);
    const filteredIDs = donation.cardIDs.filter(id => !idsToRemove.includes(id));

    await this.updateDonationInState(donation, filteredIDs);

    this.requestInProgress.next(false);
  }

  async deleteDonation(donation: Donation) {
    this.requestInProgress.next(true);

    const error = await this.databaseService.deleteDonation(donation);

    if (!error) {
      const donations = this.donations.getValue() ?? new Map<number, Donation>();

      donations.delete(donation.id);

      this.donations.next(donations);
    }

    this.requestInProgress.next(false);
  }

  private async updateDonationInState(donation: Donation, cardIDs: string[]) {
    const donations = this.donations.getValue() ?? new Map<number, Donation>();

    const error = await this.databaseService.updateDonationCards(donation.id, cardIDs);

    if (!error) {
      donation.cardIDs = cardIDs;
      donations.set(donation.id, donation);

      this.donations.next(donations);
      this.emitSelectedDonationIfMatches(donation);
    }
  }

  private emitSelectedDonationIfMatches(donation: Donation) {
    const selectedDonation = this.selectedDonation.getValue();

    if (selectedDonation && selectedDonation.id === donation.id) {
      this.selectedDonation.next(donation);
    }
  }

  selectDonation(donation: Donation) {
    this.selectedDonation.next(donation);
  }

  clearSelectedDonation() {
    this.selectedDonation.next(null);
  }
}
