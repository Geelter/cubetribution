import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogModule} from "primeng/dialog";
import {CubesService} from "../../services/cubes.service";
import {DonationsService} from "../../services/donations.service";
import {Cube} from "../../models/cube";
import {Collection} from "../../models/collection";
import {ListboxModule} from "primeng/listbox";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {catchError, take, throwError} from "rxjs";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {dialogBreakpoints} from "../../app.config";
import {ConfirmationService, MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {RequestState} from "../../helpers/request-state.enum";
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-donate-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ListboxModule, FormsModule, ButtonModule, ConfirmDialogModule, LoadingSpinnerComponent],
  templateUrl: './donate-dialog.component.html',
  styleUrl: './donate-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DonateDialogComponent {
  @Input({ required: true }) dialogVisible!: boolean;
  @Input({ required: true }) collection!: Collection;
  @Output() dialogVisibleChange = new EventEmitter<boolean>();
  protected readonly RequestState = RequestState;
  protected readonly dialogBreakpoints = dialogBreakpoints;
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly cubesService = inject(CubesService);
  private readonly donationsService = inject(DonationsService);

  cubes$ = this.cubesService.cubes$;
  cubesRequestState$ = this.cubesService.requestState$;
  donationsRequestState$ = this.donationsService.requestState$;
  selectedCube: Cube | null = null;

  showErrorDialog(error: Error) {
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
        ).subscribe({
          complete: (() => this.showSuccessMessage('Cubes fetched'))
        });
      },
      reject: () => {
        this.router.navigate(['..']);
      }
    })
  }

  donateCollectionToCube(collection: Collection, cube: Cube) {
    if (this.selectedCube) {
      this.donationsService.createDonation(collection, cube).pipe(
        take(1),
        catchError(error => {
          this.showErrorMessage('Creating donation failed', error.message);
          return throwError(() => new Error(error));
        })
      ).subscribe({
        complete: (() => this.showSuccessMessage('Donation created'))
      });
    }

    this.dialogVisibleChange.emit(false);
  }

  private showSuccessMessage(summary: string) {
    this.messageService.add({
      key: 'global',
      severity: 'success',
      summary: summary
    })
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
