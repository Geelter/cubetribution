import {fakeAsync, flushMicrotasks, TestBed, tick} from '@angular/core/testing';

import { CardsService } from './cards.service';
import {generateCardDataForID} from "../helpers/tests/generate-card-data-for-id";
import {generateCardsForData} from "../helpers/tests/generate-cards-for-data";
import {Card} from "../models/card";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ScryfallCollectionResponse} from "../models/scryfall-collection-response";

describe('CardsService', () => {
  let cardsService: CardsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    cardsService = TestBed.inject(CardsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    cardsService['fetchedCards'].clear();
  })

  it('should be created', () => {
    expect(cardsService).toBeTruthy();
  });

  describe('.getCardsForIDs', () => {
    const presentIDs = ['1234', '5678'];
    const missingIDs = ['9012'];
    const combinedIDs = [...presentIDs, ...missingIDs];

    const presentCardData = presentIDs.map(id => generateCardDataForID(id));
    const missingCardData = missingIDs.map(id => generateCardDataForID(id));
    const combinedCardData = [...presentCardData, ...missingCardData];

    const presentCards = generateCardsForData(presentCardData);
    const missingCards = generateCardsForData(missingCardData);
    const combinedCards = [...presentCards, ...missingCards];

    const endpointURL = 'https://api.scryfall.com/cards/collection';
    const mockResponse: ScryfallCollectionResponse = {
      object: 'list',
      not_found: [],
      data: missingCardData
    };

    it(`should emit correct value when all IDs are present in 'fetchedCards'`, fakeAsync(() => {
      presentCards.forEach(card => {
        cardsService['fetchedCards'].set(card.id, card);
      });

      cardsService.getCardsForIDs(presentIDs).subscribe();

      tick();

      const requestedCards = cardsService['requestedCards'].getValue();

      expect(requestedCards).toBeInstanceOf(Array);
      expect(requestedCards.length).toBe(presentIDs.length);
      expect(requestedCards[0]).toBeInstanceOf(Card);

      flushMicrotasks();
    }));

    it(`should emit correct value after making a network request, when all IDs are missing from 'fetchedCards'`, fakeAsync(() => {
      cardsService.getCardsForIDs(missingIDs).subscribe();

      httpTestingController
        .expectOne(endpointURL)
        .flush(mockResponse);

      tick();

      const requestedCards = cardsService['requestedCards'].getValue();

      expect(requestedCards).toBeInstanceOf(Array);
      expect(requestedCards.length).toBe(missingIDs.length);
      expect(requestedCards[0]).toBeInstanceOf(Card);

      flushMicrotasks();
    }));

    it(`should emit correct value after making a network request, when some IDs are present in 'fetchedCards' and some not`, fakeAsync(() => {
      presentCards.forEach(card => {
        cardsService['fetchedCards'].set(card.id, card);
      });

      cardsService.getCardsForIDs(combinedIDs).subscribe();

      httpTestingController
        .expectOne(endpointURL)
        .flush(mockResponse);

      tick();

      const requestedCards = cardsService['requestedCards'].getValue();

      expect(requestedCards).toBeInstanceOf(Array);
      expect(requestedCards.length).toBe(combinedIDs.length);
      expect(requestedCards[0]).toBeInstanceOf(Card);

      flushMicrotasks();
    }));
  });
});
