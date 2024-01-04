import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Collection} from "../../../models/collection";
import {CollectionsService} from "../../../services/collections.service";
import {ButtonModule} from "primeng/button";
import {CardListComponent} from "../../cards/card-list/card-list.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {ConfirmationService, SharedModule} from "primeng/api";
import {ToolbarModule} from "primeng/toolbar";
import {Card} from "../../../models/card";
import {FormsModule} from "@angular/forms";
import {combineLatestWith, map, Observable, switchMap} from "rxjs";
import {DialogModule} from "primeng/dialog";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {dialogBreakpoints, layoutOptions} from "../../../app.config";
import {LoadingSpinnerComponent} from "../../loading-spinner/loading-spinner.component";
import {DonateDialogComponent} from "../../donate-dialog/donate-dialog.component";
import {CardsService} from "../../../services/cards.service";

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardListComponent, SelectButtonModule, SharedModule, ToolbarModule, FormsModule, DialogModule, ConfirmDialogModule, LoadingSpinnerComponent, DonateDialogComponent],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss'
})
export class CollectionComponent {
  protected readonly dialogBreakpoints = dialogBreakpoints;
  protected readonly layoutOptions = layoutOptions;
  private readonly collectionsService = inject(CollectionsService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly cardsService = inject(CardsService);

  private readonly collection$: Observable<Collection | null>;
  private readonly collectionCards$: Observable<Card[]>;
  vm$: Observable<{collection: Collection | null, collectionCards: Card[]}>;
  requestInProgress$ = this.collectionsService.requestInProgress$;

  dialogVisible: boolean = false;
  selectedCards: Card[] = [];

  selectedLayout: string = 'grid';

  showDialog() {
    this.dialogVisible = true;
  }

  confirmDelete(collection: Collection) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove selected cards?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteSelectedCards(collection);
      }
    })
  }

  deleteSelectedCards(collection: Collection) {
    this.collectionsService.removeCardsFromCollection(collection, this.selectedCards).then(() => this.selectedCards = []
    );
  }

  constructor() {
    this.collection$ = this.collectionsService.selectedCollection$;
    this.collectionCards$ = this.collectionsService.selectedCollection$.pipe(
      switchMap(collection =>
        this.cardsService.getCardsForIDs(collection?.cardIDs ?? [])
      )
    );

    this.vm$ = this.collection$.pipe(
      combineLatestWith(this.collectionCards$),
      map(([collection, collectionCards]) => ({ collection, collectionCards}))
    );
  }
}
