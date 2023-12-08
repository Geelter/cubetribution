import {Component, Input} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Collection} from "../../../models/collection";

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss'
})
export class CollectionComponent {
  @Input({ required: true }) collection!: Collection;
}
