import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardComponent} from "../card/card.component";
import {Card} from "../../../models/card";

@Component({
  selector: 'app-card-grid',
  standalone: true,
    imports: [CommonModule, CardComponent],
  templateUrl: './card-grid.component.html',
  styleUrl: './card-grid.component.scss'
})
export class CardGridComponent {
  @Input({ required: true }) cardList!: Card[];
  @Input({ required: true }) selectedCards!: Card[];
  @Output() selectedCardsChange = new EventEmitter<Card[]>();

  handleCardClick(card: Card) {
    const isSelected = this.selectedCards.some(value => value.id === card.id);

    this.selectedCards = isSelected
      ? this.selectedCards.filter(val => val.id !== card.id)
      : [...this.selectedCards, card];

    this.selectedCardsChange.emit(this.selectedCards);
  }

  checkIfCardSelected(card: Card): boolean {
    return this.selectedCards.some(value => value.id == card.id);
  }
}
