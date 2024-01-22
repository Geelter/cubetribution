import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Collection} from "../../models/collection";
import {CollectionsService} from "../../services/collections.service";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ListboxModule} from "primeng/listbox";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {Card} from "../../models/card";
import {DividerModule} from "primeng/divider";
import {dialogBreakpoints} from "../../app.config";
import {catchError, take, throwError} from "rxjs";
import {Router} from "@angular/router";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {RequestState} from "../../helpers/request-state.enum";
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-add-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule, FormsModule, InputTextModule, ListboxModule, ReactiveFormsModule, SharedModule, DividerModule, ConfirmDialogModule, LoadingSpinnerComponent],
  templateUrl: './add-dialog.component.html',
  styleUrl: './add-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDialogComponent {
  @Input({ required: true }) dialogVisible!: boolean;
  @Input({ required: true }) cardSelection!: Card[];
  @Output() dialogVisibleChange = new EventEmitter<boolean>();
  protected readonly RequestState = RequestState;
  protected readonly dialogBreakpoints = dialogBreakpoints;
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly collectionsService = inject(CollectionsService);

  collectionForm: FormGroup;
  readonly collections$ = this.collectionsService.collections$;
  readonly collectionsRequestState$ = this.collectionsService.requestState$;
  selectedCollection: Collection | null = null;

  private showErrorDialog(error: Error) {
    this.confirmationService.confirm({
      message: error.message,
      header: 'Error fetching collections',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.collectionsService.fetchCollections().pipe(
          take(1),
          catchError(error => {
            this.showErrorDialog(error);
            return throwError(() => new Error(error));
          })
        ).subscribe({
          complete: (() => this.showSuccessMessage('Collections fetched'))
        });
      },
      reject: () => {
        this.router.navigate(['..']);
      }
    })
  }

  addSelectionToCollection() {
    if (this.selectedCollection) {
      this.collectionsService.addCardsToCollection(this.selectedCollection, this.cardSelection)
        .pipe(
          take(1),
          catchError(error => {
            this.showErrorMessage('Adding cards to collection failed', error.message);
            return throwError(() => new Error(error.message))
          })
        ).subscribe({
        complete: (() => this.showSuccessMessage('Cards added to collection'))
      });
    }

    this.dialogVisibleChange.emit(false);
  }

  createCollectionWithSelection() {
    const { name } = this.collectionForm.value;

    this.collectionsService.createCollection(name, this.cardSelection)
      .pipe(
        take(1),
        catchError(error => {
          this.showErrorMessage('Creating collection failed', error.message);
          return throwError(() => new Error(error));
        })
      ).subscribe({
      complete: (() => this.showSuccessMessage('Cards added to collection'))
    });

    this.collectionForm.reset();
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
    this.collectionForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]]
    });

    this.collectionsService.getCollections().pipe(
      take(1),
      catchError(error => {
        this.showErrorDialog(error);
        return throwError(() => new Error(error));
      })
    ).subscribe();
  }
}
