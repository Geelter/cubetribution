import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Collection} from "../../../models/collection";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-collection-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ButtonModule],
  templateUrl: './collection-card.component.html',
  styleUrl: './collection-card.component.scss'
})
export class CollectionCardComponent {
  @Input({ required: true }) collection!: Collection;
  @Input({ required: true }) deleteMode!: boolean;
  @Output() collectionClicked = new EventEmitter<void>();
  @Output() deleteClicked = new EventEmitter<void>();

  handleCollectionClick() {
    if (!this.deleteMode) this.collectionClicked.emit();
  }

  handleDeleteClick() {
    if (this.deleteMode) this.deleteClicked.emit();
  }
}
