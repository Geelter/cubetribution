import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {CardListComponent} from "../../cards/card-list/card-list.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {ToolbarModule} from "primeng/toolbar";
import {CubesService} from "../../../services/cubes.service";
import {Cube} from "../../../models/cube";
import {Card} from "../../../models/card";
import {combineLatestWith, map, Observable, switchMap} from "rxjs";
import {FormsModule} from "@angular/forms";
import {DialogModule} from "primeng/dialog";
import {layoutOptions} from "../../../app.config";
import {AddDialogComponent} from "../../add-dialog/add-dialog.component";
import {CardsService} from "../../../services/cards.service";
import {LoadingSpinnerComponent} from "../../loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-cube',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardListComponent, SelectButtonModule, ToolbarModule, FormsModule, DialogModule, AddDialogComponent, LoadingSpinnerComponent],
  templateUrl: './cube.component.html',
  styleUrl: './cube.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CubeComponent {
  protected readonly layoutOptions = layoutOptions;
  private readonly cubesService = inject(CubesService);
  private readonly cardsService = inject(CardsService);

  private readonly cube$: Observable<Cube | undefined> = this.cubesService.selectedCube$;
  vm$: Observable<{cube: Cube | undefined; cubeCards: Card[]}> = this.createViewModel(this.cube$);

  dialogVisible: boolean = false;
  selectedCards: Card[] = [];

  selectedLayout: string = 'grid';

  showDialog() {
    this.dialogVisible = true;
  }

  createViewModel(sourceObservable$: Observable<Cube | undefined>) {
    const cubeCards$ = sourceObservable$.pipe(
      switchMap(cube =>
        this.cardsService.getCardsForIDs(cube?.cardIDs ?? [])
      )
    );

    return sourceObservable$.pipe(
      combineLatestWith(cubeCards$),
      map(([cube, cubeCards]) => ({ cube, cubeCards }))
    );
  }
}
