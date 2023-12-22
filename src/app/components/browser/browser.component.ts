import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BehaviorSubject, debounceTime, distinctUntilChanged, Observable, tap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ScryfallService} from "../../services/scryfall.service";
import {Card} from "../../models/card";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {ToolbarModule} from "primeng/toolbar";
import {SelectButtonModule} from "primeng/selectbutton";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CardListComponent} from "../cards/card-list/card-list.component";
import {DropdownModule} from "primeng/dropdown";
import {DialogModule} from "primeng/dialog";
import {ListboxModule} from "primeng/listbox";
import {AddDialogComponent} from "../add-dialog/add-dialog.component";
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-browser',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, RippleModule, ToolbarModule, SelectButtonModule, FormsModule, CardListComponent, DropdownModule, DialogModule, ReactiveFormsModule, ListboxModule, AddDialogComponent, LoadingSpinnerComponent],
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
  fetchInProgress$ = this.scryfall.fetchInProgress$;
  selectedCards: Card[] = [];
  dialogVisible: boolean = false;

  selectedLayout: string = 'grid';
  layoutOptions = [
    { icon: 'pi pi-th-large', layout: 'grid' },
    { icon: 'pi pi-bars', layout: 'table' }
  ];

  selectedCardPool: string = 'results';
  cardPoolOptions = [
    { label: 'Search', cardPool: 'results' },
    { label: 'Selection', cardPool: 'selection' }
  ];

  showDialog() {
    this.dialogVisible = true;
  }

  onInputChange(input: string) {
      this.inputValue.next(input);
  }
}
