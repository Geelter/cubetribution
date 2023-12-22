import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {CardListComponent} from "../../cards/card-list/card-list.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {ToolbarModule} from "primeng/toolbar";
import {CubesService} from "../../../services/cubes.service";
import {ScryfallService} from "../../../services/scryfall.service";
import {Cube} from "../../../models/cube";
import {Card} from "../../../models/card";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {take, tap} from "rxjs";
import {FormsModule} from "@angular/forms";
import {DialogModule} from "primeng/dialog";
import {dialogBreakpoints} from "../../../app.config";
import {AddDialogComponent} from "../../add-dialog/add-dialog.component";

@Component({
  selector: 'app-cube',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardListComponent, SelectButtonModule, ToolbarModule, FormsModule, DialogModule, AddDialogComponent],
  templateUrl: './cube.component.html',
  styleUrl: './cube.component.scss'
})
export class CubeComponent {
  protected readonly dialogBreakpoints = dialogBreakpoints;
  readonly cubesService = inject(CubesService);
  readonly scryfallService = inject(ScryfallService);

  cube: Cube | null = null;
  cubeCards: Card[] = [];

  selectedCards: Card[] = [];
  dialogVisible: boolean = false;

  selectedLayout: string = 'grid';
  layoutOptions = [
    { icon: 'pi pi-th-large', layout: 'grid' },
    { icon: 'pi pi-bars', layout: 'table' }
  ];

  showDialog() {
    this.dialogVisible = true;
  }

  constructor() {
    this.cubesService.selectedCube$.pipe(
      takeUntilDestroyed(),
      tap(cube => {
        this.scryfallService.getCardsForIDs(cube?.cardIDs ?? []).pipe(
          take(1),
          tap(cards => this.cubeCards = cards)
        ).subscribe();

        this.cube = cube;
      })
    ).subscribe();
  }
}
