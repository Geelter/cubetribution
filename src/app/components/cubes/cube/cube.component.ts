import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {CardListComponent} from "../../cards/card-list/card-list.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {ToolbarModule} from "primeng/toolbar";
import {CubesService} from "../../../services/cubes.service";
import {Cube} from "../../../models/cube";
import {Card} from "../../../models/card";
import {catchError, combineLatestWith, map, Observable, take, tap, throwError} from "rxjs";
import {FormsModule} from "@angular/forms";
import {DialogModule} from "primeng/dialog";
import {dialogBreakpoints, layoutOptions} from "../../../app.config";
import {AddDialogComponent} from "../../dialogs/add-dialog/add-dialog.component";
import {CardsService} from "../../../services/cards.service";
import {LoadingSpinnerComponent} from "../../loading-spinner/loading-spinner.component";
import {ConfirmationService} from "primeng/api";
import {Router} from "@angular/router";
import {RequestState} from "../../../helpers/request-state.enum";
import {ConfirmDialogModule} from "primeng/confirmdialog";

@Component({
  selector: 'app-cube',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardListComponent, SelectButtonModule, ToolbarModule, FormsModule, DialogModule, AddDialogComponent, LoadingSpinnerComponent, ConfirmDialogModule],
  templateUrl: './cube.component.html',
  styleUrl: './cube.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CubeComponent {
  protected readonly RequestState = RequestState;
  protected readonly dialogBreakpoints = dialogBreakpoints;
  protected readonly layoutOptions = layoutOptions;
  private readonly cubesService = inject(CubesService);
  private readonly cardsService = inject(CardsService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);

  private readonly cube$: Observable<Cube | undefined> = this.cubesService.selectedCube$;
  readonly vm$: Observable<{cube: Cube | undefined; cubeCards: Card[]}> = this.createViewModel(this.cube$);
  readonly cubesRequestState$ = this.cubesService.requestState$;
  readonly cardsRequestState$ = this.cardsService.requestState$;

  dialogVisible: boolean = false;
  selectedCards: Card[] = [];

  selectedLayout: string = 'grid';

  showDialog() {
    this.dialogVisible = true;
  }

  private createViewModel(sourceObservable$: Observable<Cube | undefined>) {
    return sourceObservable$.pipe(
      tap(collection => {
        const ids = collection?.cardIDs ?? [];
        this.cardsService.getCardsForIDs(ids).pipe(
          take(1),
          catchError(error => {
            this.showErrorDialog(error, ids);
            return throwError(() => new Error(error));
          })
        ).subscribe();
      }),
      combineLatestWith(this.cardsService.requestedCards$),
      map(([cube, cubeCards]) => ({ cube, cubeCards }))
    );
  }
}
