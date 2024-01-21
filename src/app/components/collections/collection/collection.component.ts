import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Collection} from "../../../models/collection";
import {CollectionsService} from "../../../services/collections.service";
import {ButtonModule} from "primeng/button";
import {CardListComponent} from "../../cards/card-list/card-list.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {ToolbarModule} from "primeng/toolbar";
import {Card} from "../../../models/card";
import {FormsModule} from "@angular/forms";
import {catchError, combineLatestWith, map, Observable, switchMap, take, throwError} from "rxjs";
import {DialogModule} from "primeng/dialog";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {dialogBreakpoints, layoutOptions} from "../../../app.config";
import {LoadingSpinnerComponent} from "../../loading-spinner/loading-spinner.component";
import {DonateDialogComponent} from "../../donate-dialog/donate-dialog.component";
import {CardsService} from "../../../services/cards.service";
import {RequestState} from "../../../helpers/request-state.enum";

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardListComponent, SelectButtonModule, SharedModule, ToolbarModule, FormsModule, DialogModule, ConfirmDialogModule, LoadingSpinnerComponent, DonateDialogComponent],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionComponent {
  protected readonly dialogBreakpoints = dialogBreakpoints;
  protected readonly layoutOptions = layoutOptions;
  protected readonly RequestState = RequestState;
  private readonly collectionsService = inject(CollectionsService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly cardsService = inject(CardsService);

  private readonly collection$: Observable<Collection | undefined> = this.collectionsService.selectedCollection$;
  vm$: Observable<{collection: Collection | undefined, collectionCards: Card[]}> = this.createViewModel(this.collection$);
  readonly collectionsRequestState$ = this.collectionsService.requestState$;

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
        this.collectionsService.removeCardsFromCollection(collection, this.selectedCards).pipe(
          take(1),
          catchError(error => {
            this.showErrorMessage('Deleting selected cards failed', error.message);
            return throwError(() => new Error(error));
          })
        ).subscribe({
          complete: (() => this.showSuccessMessage('Selected cards deleted'))
        });
      }
    })
  }

  createViewModel(sourceObservable$: Observable<Collection | undefined>) {
    const collectionCards$ = sourceObservable$.pipe(
      switchMap(collection =>
        this.cardsService.getCardsForIDs(collection?.cardIDs ?? [])
      )
    );

    return sourceObservable$.pipe(
      combineLatestWith(collectionCards$),
      map(([collection, collectionCards]) => ({ collection, collectionCards }))
    );
  }

  showSuccessMessage(summary: string) {
    this.messageService.add({
      key: 'global',
      severity: 'success',
      summary: summary
    })
  }

  showErrorMessage(summary: string, detail: string = '') {
    this.messageService.add({
      key: 'global',
      severity: 'error',
      summary: summary,
      detail: detail
    })
  }
}
