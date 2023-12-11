import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Collection} from "../../models/collection";
import {CollectionsService} from "../../services/collections.service";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ListboxModule} from "primeng/listbox";
import {SharedModule} from "primeng/api";
import {Card} from "../../models/card";
import {DividerModule} from "primeng/divider";
import {dialogBreakpoints} from "../../app.config";

@Component({
  selector: 'app-add-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule, FormsModule, InputTextModule, ListboxModule, ReactiveFormsModule, SharedModule, DividerModule],
  templateUrl: './add-dialog.component.html',
  styleUrl: './add-dialog.component.scss'
})
export class AddDialogComponent {
  protected readonly dialogBreakpoints = dialogBreakpoints;
  @Input({ required: true }) dialogVisible!: boolean;
  @Input({ required: true }) cardSelection!: Card[];
  @Output() dialogVisibleChange = new EventEmitter<boolean>();
  formBuilder = inject(FormBuilder);
  collectionsService = inject(CollectionsService);

  collectionForm: FormGroup;
  collections$ = this.collectionsService.collections$;
  selectedCollection: Collection | null = null;

  addSelectionToCollection() {
    if (this.selectedCollection) {
      this.collectionsService.addCardsToCollection(this.selectedCollection, this.cardSelection);
    }

    this.dialogVisibleChange.emit(false);
  }

  createCollectionWithSelection() {
    const { name } = this.collectionForm.value;

    this.collectionsService.createCollection(name, this.cardSelection);

    this.collectionForm.reset();
    this.dialogVisibleChange.emit(false);
  }

  constructor() {
    this.collectionForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]]
    });

    this.collectionsService.initializeCollections();
  }
}
