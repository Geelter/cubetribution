import {inject, Injectable} from '@angular/core';
import {SupabaseDatabaseService} from "./supabase/supabase-database.service";
import {BehaviorSubject} from "rxjs";
import {Donation} from "../models/donation";
import {Collection} from "../models/collection";
import {Cube} from "../models/cube";

@Injectable({
  providedIn: 'root'
})
export class DonationsService {
  private readonly databaseService = inject(SupabaseDatabaseService);

  private donations = new BehaviorSubject<Donation[] | null>(null);
  donations$ = this.donations.asObservable();

  private requestInProgress = new BehaviorSubject<boolean>(false);
  requestInProgress$ = this.requestInProgress.asObservable();

  async initializeDonations() {
    const donationsValue = this.donations.getValue();

    if (!donationsValue || !donationsValue.length) {
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

  clearFetchedCollections() {
    this.donations.next(null);
  }

  async createDonation(collection: Collection, cube: Cube) {
    this.requestInProgress.next(true);

    const createdDonation = await this.databaseService.createDonationForCube(collection, cube);

    if (createdDonation) {
      const currentDonations = this.donations.getValue() ?? [];

      this.donations.next([...currentDonations, createdDonation]);
    }

    this.requestInProgress.next(false);
  }

  async deleteDonation(donation: Donation) {
    this.requestInProgress.next(true);

    const error = await this.databaseService.deleteDonation(donation);

    if (!error) {
      const filteredDonations = this.donations.getValue()?.filter(
        val => val.id != donation.id
      ) ?? [];

      this.donations.next([...filteredDonations]);
    }

    this.requestInProgress.next(false);
  }
}
