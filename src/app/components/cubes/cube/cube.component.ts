import {Component, inject} from '@angular/core';
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
  styleUrl: './cube.component.scss'
})
export class CubeComponent {
  protected readonly layoutOptions = layoutOptions;
  private readonly cubesService = inject(CubesService);
  private readonly cardsService = inject(CardsService);

  private readonly cube$: Observable<Cube | null>;
  private readonly cubeCards$: Observable<Card[]>;
  vm$: Observable<{cube: Cube | null; cubeCards: Card[]}>;
  requestInProgress$ = this.cubesService.requestInProgress$;

  selectedCards: Card[] = [];
  dialogVisible: boolean = false;

  selectedLayout: string = 'grid';

  showDialog() {
    this.dialogVisible = true;
  }

  constructor() {
    this.cube$ = this.cubesService.selectedCube$;
    this.cubeCards$ = this.cubesService.selectedCube$.pipe(
      switchMap(cube =>
        this.cardsService.getCardsForIDs(cube?.cardIDs ?? [])
      )
    );

    this.vm$ = this.cube$.pipe(
      combineLatestWith(this.cubeCards$),
      map(([cube, cubeCards]) => ({ cube, cubeCards }))
    );
  }
}
