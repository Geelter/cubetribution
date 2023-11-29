import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {BehaviorSubject, debounceTime, distinctUntilChanged, Observable, tap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ScryfallService} from "../services/scryfall.service";
import {Card} from "../models/card";
import {CardGridComponent} from "../card-grid/card-grid.component";

@Component({
  selector: 'app-browser',
  standalone: true,
  imports: [CommonModule, CardGridComponent],
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss']
})
export class BrowserComponent {
  private scryfall = inject(ScryfallService);

  private inputValue = new BehaviorSubject<string | undefined>(undefined);
  private inputValue$ = this.inputValue.asObservable()
      .pipe(
          takeUntilDestroyed(),
          debounceTime(1000),
          distinctUntilChanged(),
          tap(value => {
                if (value) {
                  this.browsedCards$ = this.scryfall.getCardsForAutocomplete(value);
                }
          })
      ).subscribe();

  browsedCards$: Observable<Card[]> | undefined;

  onInputChange(input: string) {
      this.inputValue.next(input);
  }
}
