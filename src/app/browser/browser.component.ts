import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BehaviorSubject, debounceTime, distinctUntilChanged, Observable, tap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ScryfallService} from "../services/scryfall.service";
import {Card} from "../models/card";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {ToolbarModule} from "primeng/toolbar";
import {ConfirmationService, MessageService} from "primeng/api";
import {SelectButtonModule} from "primeng/selectbutton";
import {FormsModule} from "@angular/forms";
import {CardListComponent} from "../card-list/card-list.component";

@Component({
  selector: 'app-browser',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, RippleModule, ToolbarModule, SelectButtonModule, FormsModule, CardListComponent],
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss']
})
export class BrowserComponent {
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
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
  selectedCards: Card[] = [];

  selectedLayout: string = 'grid';
  layoutOptions = [
    { icon: 'pi pi-th-large', layout: 'grid' },
    { icon: 'pi pi-bars', layout: 'table' }
  ];

  onInputChange(input: string) {
      this.inputValue.next(input);
  }
}
