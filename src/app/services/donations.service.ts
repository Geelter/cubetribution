import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, combineLatestWith, from, map, retry, switchMap, throwError} from "rxjs";
import {Donation} from "../models/donation";
import {Collection} from "../models/collection";
import {Cube} from "../models/cube";
import {Card} from "../models/card";
import {SupabaseClientService} from "./supabase/supabase-client.service";
import {RequestState} from "../helpers/request-state.enum";
import {Tables} from "../models/supabase";

@Injectable({
  providedIn: 'root'
})
export class DonationsService {
  private readonly supabase = inject(SupabaseClientService);

  private requestState = new BehaviorSubject<RequestState>(RequestState.Initial);
  requestState$ = this.requestState.asObservable();

  private donations = new BehaviorSubject<Map<number, Donation>>(
    new Map<number, Donation>()
  );
  donations$ = this.donations.asObservable().pipe(
    map(donationMap => Array.from(donationMap.values()))
  );

  private selectedDonation = new BehaviorSubject<number | null>(null);
  selectedDonation$ = this.donations$.pipe(
    combineLatestWith(this.selectedDonation.asObservable()),
    map(([donations, chosenDonationID]) =>
      donations.find(donation => donation.id == chosenDonationID)
    )
  );

  getDonations() {
    if (this.requestState.getValue() == RequestState.Success) {
      return this.donations$;
    } else {
      return this.fetchDonations();
    }
  }

  fetchDonations() {
    this.setRequestState(RequestState.InProgress);

    return from(
      this.supabase.client
        .from('donations')
        .select()
        .returns<Tables<'donations'>[]>()
    ).pipe(
      switchMap(result => {
        if (result.data && !result.error) {
          const fetchedDonations = result.data.map(
            value => new Donation(value)
          );
          this.donations.next(this.convertArrayToMap(fetchedDonations));
          this.setRequestState(RequestState.Success);
          return this.donations$;
        } else {
          this.setRequestState(RequestState.Failure);
          return throwError(() => new Error(result.error.message));
        }
      }),
      retry({ count: 2, delay: 1000 }),
    );
  }

  createDonation(collection: Collection, cube: Cube) {
    this.setRequestState(RequestState.InProgress);
    const filteredCards = collection.cardIDs.filter(id => cube.cardIDs.includes(id));

    return from(
      this.supabase.client
        .from('donations')
        .insert({ name: `${cube.name} donation`, cube_id: cube.id, card_ids: filteredCards })
        .select()
        .returns<Tables<'donations'>[]>()
    ).pipe(
      switchMap(result => {
        if (result.data && !result.error) {
          const newDonation = new Donation(result.data[0]);

          this.setDonationInState(newDonation);
          this.setRequestState(RequestState.Success);

          return this.getDonations();
        } else {
          this.setRequestState(RequestState.Failure);
          return throwError(() => new Error(result.error.message));
        }
      }),
      retry({ count: 2, delay: 1000 }),
    );
  }

  deleteDonation(donation: Donation) {
    this.setRequestState(RequestState.InProgress);

    return from(
      this.supabase.client
        .from('donations')
        .delete()
        .eq('id', donation.id)
    ).pipe(
      switchMap(result => {
        if (!result.error) {
          this.removeDonationFromState(donation);

          this.setRequestState(RequestState.Success);
          return this.getDonations();
        } else {
          this.setRequestState(RequestState.Failure);
          return throwError(() => new Error(result.error.message));
        }
      }),
      retry({ count: 2, delay: 1000 }),
    );
  }

  removeCardsFromDonation(donation: Donation, cards: Card[]) {
    this.setRequestState(RequestState.InProgress);

    const idsToRemove = cards.map(card => card.id);
    const filteredIDs = donation.cardIDs.filter(id => !idsToRemove.includes(id));

    return from(
      this.supabase.client
        .from('donations')
        .update({ card_ids: filteredIDs })
        .eq('id', donation.id)
        .select()
        .returns<Tables<'donations'>[]>()
    ).pipe(
      switchMap(result => {
        if (result.data && !result.error) {
          const updatedDonation = new Donation(result.data[0]);

          this.setDonationInState(updatedDonation);
          this.setRequestState(RequestState.Success);

          return this.getDonations();
        } else {
          this.setRequestState(RequestState.Failure);
          return throwError(() => new Error(result.error.message));
        }
      }),
      retry({ count: 2, delay: 1000 }),
    );
  }

  clearFetchedDonations() {
    this.donations.next(new Map<number, Donation>());
    this.setRequestState(RequestState.Initial);
  }

  selectDonation(donation: Donation) {
    this.selectedDonation.next(donation.id);
  }

  clearSelectedDonation() {
    this.selectedDonation.next(null);
  }

  private convertArrayToMap(array: Donation[]) {
    return new Map(array.map(donation => [donation.id, donation]));
  }

  private setDonationInState(donation: Donation) {
    const donationsState = this.donations.getValue();

    this.donations.next(donationsState.set(donation.id, donation));
  }

  private removeDonationFromState(donation: Donation) {
    const donationsState = this.donations.getValue();

    donationsState.delete(donation.id);

    this.donations.next(donationsState);
  }

  private setRequestState(state: RequestState) {
    this.requestState.next(state);
  }
}
