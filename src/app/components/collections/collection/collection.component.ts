import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Collection} from "../../../models/collection";
import {CollectionsService} from "../../../services/collections.service";
import {ScryfallService} from "../../../services/scryfall.service";
import {ButtonModule} from "primeng/button";
import {CardListComponent} from "../../cards/card-list/card-list.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {ConfirmationService, SharedModule} from "primeng/api";
import {ToolbarModule} from "primeng/toolbar";
import {Card} from "../../../models/card";
import {FormsModule} from "@angular/forms";
import {take, tap} from "rxjs";
import {DialogModule} from "primeng/dialog";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {dialogBreakpoints} from "../../../app.config";
import {LoadingSpinnerComponent} from "../../loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardListComponent, SelectButtonModule, SharedModule, ToolbarModule, FormsModule, DialogModule, ConfirmDialogModule, LoadingSpinnerComponent],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss'
})
export class CollectionComponent {
  protected readonly dialogBreakpoints = dialogBreakpoints;
  collectionsService = inject(CollectionsService);
  scryfallService = inject(ScryfallService);
  confirmationService = inject(ConfirmationService);

  collection: Collection | null = null;
  collectionCards: Card[] = [];
  requestInProgress$ = this.collectionsService.requestInProgress$;

  selectedCards: Card[] = [];

  selectedLayout: string = 'grid';
  layoutOptions = [
    { icon: 'pi pi-th-large', layout: 'grid' },
    { icon: 'pi pi-bars', layout: 'table' }
  ];

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
    this.collectionsService.removeCardsFromCollection(collection, this.selectedCards).then(() => {
        this.selectedCards = [];
      }
    );
  }

  constructor() {
    this.collectionsService.selectedCollection$.pipe(
      takeUntilDestroyed(),
      tap(collection => {
        this.scryfallService.getCardsForIDs(collection?.cardIDs ?? []).pipe(
          take(1),
          tap(cards => this.collectionCards = cards)
        ).subscribe();

        this.collection = collection;
        }
      )
    ).subscribe();
  }
}
