import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CollectionCardComponent} from "../collection-card/collection-card.component";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {CollectionsService} from "../../../services/collections.service";
import {Collection} from "../../../models/collection";
import {Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {dialogBreakpoints} from "../../../app.config";
import {LoadingSpinnerComponent} from "../../loading-spinner/loading-spinner.component";
import {catchError, take, throwError} from "rxjs";
import {RequestState} from "../../../helpers/request-state.enum";

@Component({
  selector: 'app-collection-card-grid',
  standalone: true,
  imports: [CommonModule, CollectionCardComponent, ToolbarModule, ButtonModule, DialogModule, ReactiveFormsModule, InputTextModule, ConfirmDialogModule, LoadingSpinnerComponent],
  templateUrl: './collection-grid.component.html',
  styleUrl: './collection-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionGridComponent {
  protected readonly dialogBreakpoints = dialogBreakpoints;
  protected readonly RequestState = RequestState;
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly collectionsService = inject(CollectionsService);
  private readonly messageService = inject(MessageService);

  readonly collectionList$ = this.collectionsService.collections$;
  readonly collectionsRequestState$ = this.collectionsService.requestState$;

  collectionForm: FormGroup;
  dialogVisible: boolean = false;
  deleteMode: boolean = false;

  showDialog() {
    this.dialogVisible = true;
  }

  toggleDeleteMode() {
    this.deleteMode = !this.deleteMode;
  }

  createCollection() {
    const { name } = this.collectionForm.value;

    this.collectionsService.createCollection(name).pipe(
      take(1),
      catchError(error => {
        this.showErrorMessage('Creating collection failed', error.message);
        return throwError(() => new Error(error));
      })
    ).subscribe();

    this.collectionForm.reset();
    this.dialogVisible = false;
  }

  refreshCollections() {
    this.collectionsService.fetchCollections().pipe(
      take(1),
      catchError(error => {
        this.showErrorMessage('Fetching collections failed', error.message);
        return throwError(() => new Error(error));
      })
    ).subscribe();
  }

  selectCollection(collection: Collection) {
    this.collectionsService.selectCollection(collection);
    this.router.navigate([`/collections`, 'list', 'detail']);
  }

  confirmDelete(collection: Collection) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete selected collection?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.collectionsService.deleteCollection(collection).pipe(
          take(1),
          catchError(error => {
            this.showErrorMessage('Deleting collection failed', error.message);
            return throwError(() => new Error(error));
          })
        ).subscribe();
      }
    })
  }

  private showErrorDialog(error: Error) {
    this.confirmationService.confirm({
      message: error.message,
      header: 'Do you want to retry?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.collectionsService.fetchCollections().pipe(
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
