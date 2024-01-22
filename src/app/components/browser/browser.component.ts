import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BehaviorSubject, catchError, debounceTime, distinctUntilChanged, of, switchMap} from "rxjs";
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
import {layoutOptions} from "../../app.config";
import {MessageService} from "primeng/api";
import {RequestState} from "../../helpers/request-state.enum";

@Component({
  selector: 'app-browser',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, RippleModule, ToolbarModule, SelectButtonModule, FormsModule, CardListComponent, DropdownModule, DialogModule, ReactiveFormsModule, ListboxModule, AddDialogComponent, LoadingSpinnerComponent],
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrowserComponent {
  protected readonly RequestState = RequestState;
  protected readonly layoutOptions = layoutOptions;
  private readonly scryfall = inject(ScryfallService);
  private readonly messageService = inject(MessageService);

  private inputValue = new BehaviorSubject<string | undefined>(undefined);
  browsedCards$ = this.inputValue.asObservable().pipe(
    debounceTime(1000),
    distinctUntilChanged(),
    switchMap(value => this.scryfall.getCardsForAutocomplete(value ?? '').pipe(
      catchError(error => {
        this.showError(error);
        return of([] as Card[]);
      })
    )),
  );

  readonly requestState$ = this.scryfall.requestState$;
  selectedCards: Card[] = [];
  dialogVisible: boolean = false;

  selectedLayout: string = 'grid';

  selectedCardPool: string = 'results';
  readonly cardPoolOptions = [
    { label: 'Search', cardPool: 'results' },
    { label: 'Selection', cardPool: 'selection' }
  ];

  showDialog() {
    this.dialogVisible = true;
  }

  onInputChange(input: string) {
    this.inputValue.next(input);
  }

  private showError(error: Error) {
    this.messageService.add({
      key: 'global',
      severity: 'error',
      summary: error.message
    })
  }
}
