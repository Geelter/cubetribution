import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToolbarModule} from "primeng/toolbar";
import {SharedModule} from "primeng/api";

@Component({
  selector: 'app-card-collection',
  standalone: true,
  imports: [CommonModule, ToolbarModule, SharedModule],
  templateUrl: './card-collection.component.html',
  styleUrl: './card-collection.component.scss'
})
export class CardCollectionComponent {

}
