import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Collection} from "../../../models/collection";
import {CollectionComponent} from "../collection/collection.component";
import {sampleCollection} from "../../../models/collection";

@Component({
  selector: 'app-collection-grid',
  standalone: true,
  imports: [CommonModule, CollectionComponent],
  templateUrl: './collection-grid.component.html',
  styleUrl: './collection-grid.component.scss'
})
export class CollectionGridComponent {
  // @Input({ required: true }) collectionList!: Collection[];
  collectionList = Array(7).fill(sampleCollection);
}
