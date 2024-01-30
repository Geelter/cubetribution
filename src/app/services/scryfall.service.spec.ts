import {fakeAsync, flushMicrotasks, TestBed, tick,} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

import {ScryfallService} from './scryfall.service';
import {Card} from "../models/card";
import {RequestState} from "../helpers/request-state.enum";
import {ScryfallCollectionResponse} from "../models/scryfall-collection-response";
import {ScryfallAutocompleteResponse} from "../models/scryfall-autocomplete-response";
import {generateCardDataForID} from "../helpers/tests/generate-card-data-for-id";
import createSpy = jasmine.createSpy;

describe('ScryfallService', () => {
  let scryfallService: ScryfallService;
  let httpTestingController: HttpTestingController;

  const baseURL = 'https://api.scryfall.com/cards';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    scryfallService = TestBed.inject(ScryfallService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Confirm there are no outstanding requests
    httpTestingController.verify();
    scryfallService['requestState'].next(RequestState.Initial);
  })

  it('should be created', () => {
    expect(scryfallService).toBeTruthy();
  });

  describe('.getCardsForIDs', () => {
    const apiEndpoint = `${baseURL}/collection`;
    const ids = ['1234', '5678', '9012'];
    const mockResponse: ScryfallCollectionResponse = {
      object: 'list',
      not_found: [],
      data: ids.map(id => generateCardDataForID(id))
    };

    it(`should result in a 'Card[]' for a non-empty array of IDs`, fakeAsync(() => {
      let result: Card[] | undefined;

      scryfallService.getCardsForIDs(ids).subscribe(cards => {
        result = cards;
      });

      httpTestingController
        .expectOne(apiEndpoint)
        .flush(mockResponse);

      expect(result as Card[]).toBeInstanceOf(Array);
      expect((result as Card[]).length).toBe(ids.length);
      expect((result as Card[])[0]).toBeInstanceOf(Card);

      flushMicrotasks();
    }));

    it('should make multiple requests if number of IDs exceeds request limit', fakeAsync(() => {
      const ids = Array.from({ length: 90 }, (_, i) => i.toString());

      scryfallService.getCardsForIDs(ids).subscribe();

      const mockResponse: ScryfallCollectionResponse = {
        object: 'list',
        not_found: [],
        data: ids.map(id => generateCardDataForID(id))
      };

      const batchSize = scryfallService['BATCH_SIZE'];
      const expectedBatches = Math.ceil(ids.length / batchSize);
      const batchRequests = httpTestingController.match(apiEndpoint);

      expect(batchRequests.length).toBe(expectedBatches);

      flushMicrotasks();
    }));

    it(`should set request state to 'InProgress' for a non-empty array of IDs`, fakeAsync(() => {
      scryfallService.getCardsForIDs(ids).subscribe();

      expect(scryfallService['requestState'].getValue()).toBe(RequestState.InProgress);

      httpTestingController.expectOne(apiEndpoint);

      flushMicrotasks();
    }));

    it(`should set request state to 'Success' if no errors`, fakeAsync(() => {
      scryfallService.getCardsForIDs(ids).subscribe();

      const mockRequest = httpTestingController.expectOne(apiEndpoint);
      mockRequest.flush(mockResponse);

      expect(scryfallService['requestState'].getValue()).toBe(RequestState.Success);

      flushMicrotasks();
    }));

    it(`should set request state to 'Failure' after 2 retries`, fakeAsync(() => {
      const status = 500;
      const statusText = 'Internal Server Error';

      scryfallService.getCardsForIDs(ids).subscribe({
        next: () => {fail('next handler must not be called')},
        error: () => {},
        complete: () => {fail('complete handler must not be called')}
      });

      httpTestingController
        .expectOne(apiEndpoint)
        .flush('Failed!', {status, statusText});

      tick(1000);

      httpTestingController
        .expectOne(apiEndpoint)
        .flush('Failed!', {status, statusText});

      tick(1000);

      httpTestingController
        .expectOne(apiEndpoint)
        .flush('Failed!', {status, statusText});

      tick(1000);

      expect(scryfallService['requestState'].getValue()).toBe(RequestState.Failure);

      flushMicrotasks();
    }));
  });

  describe('.getCardsForAutocomplete', () => {
    const apiEndpoint = `${baseURL}/autocomplete`;
    const query = 'farmhand';
    const autocompleteURL = `${apiEndpoint}?q=${query}`;
    const mockResponse: ScryfallAutocompleteResponse = {
      object: 'catalog',
      total_values: 2,
      data: [
        "Diligent Farmhand",
        "Ambitious Farmhand // Seasoned Cathar"
      ]
    };

    it(`should set request state to 'InProgress'`, fakeAsync(() => {
      scryfallService.getCardsForAutocomplete(query).subscribe();

      expect(scryfallService['requestState'].getValue()).toBe(RequestState.InProgress);

      httpTestingController.expectOne(autocompleteURL);

      flushMicrotasks();
    }));

    it('should not make a collection request for empty autocomplete response', fakeAsync(() => {
      const setRequestStateSpy = createSpy('setRequestState');
      spyOn<any>(scryfallService, 'setRequestState').and.callFake(setRequestStateSpy);

      scryfallService.getCardsForAutocomplete(query).subscribe();

      httpTestingController
        .expectOne(autocompleteURL)
        .flush({
          object: 'catalog',
          total_values: 0,
          data: []
        });

      httpTestingController.expectNone(`${baseURL}/collection`);

      expect(setRequestStateSpy).toHaveBeenCalledTimes(2);

      flushMicrotasks();
    }));

    it(`should set request state to 'Success' if no errors`, fakeAsync(() => {
      const setRequestStateSpy = createSpy('setRequestState');
      spyOn<any>(scryfallService, 'setRequestState').and.callFake(setRequestStateSpy);

      scryfallService.getCardsForAutocomplete(query).subscribe();

      httpTestingController
        .expectOne({ method: 'GET', url: autocompleteURL })
        .flush(mockResponse);

      expect(setRequestStateSpy).toHaveBeenCalledWith(RequestState.Success);

      httpTestingController.expectOne(`${baseURL}/collection`);

      flushMicrotasks();
    }));

    it(`should set request state to 'Failure' after error`, fakeAsync(() => {
      const status = 500;
      const statusText = 'Internal Server Error';

      scryfallService.getCardsForAutocomplete(query).subscribe({
        next: () => { fail('next handler must not be called') },
        error: () => {},
        complete: () => { fail('complete handler must not be called') }
      });

      httpTestingController
        .expectOne({ method: 'GET', url: autocompleteURL })
        .flush('Failed!', {status, statusText});

      tick(1000);

      httpTestingController
        .expectOne({ method: 'GET', url: autocompleteURL })
        .flush('Failed!', {status, statusText});

      tick(1000);

      httpTestingController
        .expectOne({ method: 'GET', url: autocompleteURL })
        .flush('Failed!', {status, statusText});

      tick(1000);

      expect(scryfallService['requestState'].getValue()).toBe(RequestState.Failure);

      flushMicrotasks();
    }));
  });
});
