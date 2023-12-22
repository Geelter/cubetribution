import {Component, inject} from '@angular/core';
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
import {ConfirmationService} from "primeng/api";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {dialogBreakpoints} from "../../../app.config";
import {LoadingSpinnerComponent} from "../../loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-collection-card-grid',
  standalone: true,
  imports: [CommonModule, CollectionCardComponent, ToolbarModule, ButtonModule, DialogModule, ReactiveFormsModule, InputTextModule, ConfirmDialogModule, LoadingSpinnerComponent],
  templateUrl: './collection-grid.component.html',
  styleUrl: './collection-grid.component.scss'
})
export class CollectionGridComponent {
  protected readonly dialogBreakpoints = dialogBreakpoints;
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly collectionsService = inject(CollectionsService);
  collectionList$ = this.collectionsService.collections$;
  fetchInProgress$ = this.collectionsService.requestInProgress$;

  collectionForm: FormGroup;
  dialogVisible: boolean = false;
  deleteMode: boolean = false;

  showDialog() {
    this.dialogVisible = true;
  }

  toggleDeleteMode() {
    this.deleteMode = !this.deleteMode;
  }

  async createCollection() {
    const { name } = this.collectionForm.value;

    await this.collectionsService.createCollection(name);

    this.collectionForm.reset();
    this.dialogVisible = false;
  }

  refreshCollections() {
    this.collectionsService.getCollections();
  }

  selectCollection(collection: Collection) {
    this.collectionsService.selectCollection(collection);
    this.router.navigate([`/collection/detail`]);
  }

  confirmDelete(collection: Collection) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete selected collection?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteCollection(collection);
      }
    })
  }

  private deleteCollection(collection: Collection) {
    this.collectionsService.deleteCollection(collection);
  }

  constructor() {
    this.collectionForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]]
    });

    this.collectionsService.initializeCollections();
  }
}
