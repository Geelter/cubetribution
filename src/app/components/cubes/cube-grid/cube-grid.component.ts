import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from "@angular/router";
import {CubesService} from "../../../services/cubes.service";
import {Cube} from "../../../models/cube";
import {ButtonModule} from "primeng/button";
import {ToolbarModule} from "primeng/toolbar";
import {CubeCardComponent} from "../cube-card/cube-card.component";
import {catchError, take, throwError} from "rxjs";
import {RequestState} from "../../../helpers/request-state.enum";
import {LoadingSpinnerComponent} from "../../loading-spinner/loading-spinner.component";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {dialogBreakpoints} from "../../../app.config";
import {ConfirmationService, MessageService} from "primeng/api";

@Component({
  selector: 'app-cube-grid',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToolbarModule, CubeCardComponent, LoadingSpinnerComponent, ConfirmDialogModule],
  templateUrl: './cube-grid.component.html',
  styleUrl: './cube-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CubeGridComponent {
  protected readonly RequestState = RequestState;
  protected readonly dialogBreakpoints = dialogBreakpoints;
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly cubesService = inject(CubesService);

  readonly cubesList$ = this.cubesService.cubes$;
  readonly cubesRequestState$ = this.cubesService.requestState$;

  private showErrorDialog(error: Error) {
    this.confirmationService.confirm({
      message: error.message,
      header: 'Error fetching cubes',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cubesService.fetchCubes().pipe(
          take(1),
          catchError(error => {
            this.showErrorDialog(error);
            return throwError(() => new Error(error));
          })
        ).subscribe();
      },
      reject: () => {
        this.router.navigate(['..']);
      }
    })
  }

  refreshCubes() {
    this.cubesService.fetchCubes().pipe(
      take(1),
      catchError(error => {
        this.showErrorMessage('Fetching cubes failed', error.message);
        return throwError(() => new Error(error));
      })
    ).subscribe();
  }

  selectCube(cube: Cube) {
    this.cubesService.selectCube(cube);
    this.router.navigate(['/cubes', 'list', 'detail']);
  }

  private showErrorMessage(summary: string, detail: string = '') {
    this.messageService.add({
      key: 'global',
      severity: 'error',
      summary: summary,
      detail: detail
    })
  }

  constructor() {
    this.cubesService.getCubes().pipe(
      take(1),
      catchError(error => {
        this.showErrorDialog(error);
        return throwError(() => new Error(error));
      })
    ).subscribe();
  }
}
