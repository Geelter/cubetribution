import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Card} from "../models/card";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  isFlipped = false;
  @Input({ required: true }) card!: Card;
  @Input({ required: true }) isSelected!: boolean;
  @Output('cardSelected') faceClicked = new EventEmitter<void>();

  flip(event: MouseEvent) {
    this.isFlipped = !this.isFlipped;
  }
}
