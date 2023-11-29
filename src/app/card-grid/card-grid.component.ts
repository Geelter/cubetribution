import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CardComponent} from "../card/card.component";
import {Card} from "../models/card";

@Component({
  selector: 'app-card-grid',
  standalone: true,
    imports: [CommonModule, CardComponent],
  templateUrl: './card-grid.component.html',
  styleUrl: './card-grid.component.scss'
})
export class CardGridComponent {
  @Input({ required: true }) cardList!: Card[];
}
