import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardGridComponent} from "../card-grid/card-grid.component";
import {Card} from "../../../models/card";
import {ButtonModule} from "primeng/button";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {CardComponent} from "../card/card.component";
import {SkeletonModule} from "primeng/skeleton";
import {ManaCostComponent} from "../mana-cost/mana-cost.component";

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, CardGridComponent, ButtonModule, SharedModule, TableModule, CardComponent, SkeletonModule, ManaCostComponent],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss'
})
export class CardListComponent {
  @Input({ required: true }) selectedLayout!: string;
  @Input({ required: true }) cardList!: Card[];
  @Input({ required: true }) selectedCards!: Card[];
  @Input() selectAllEnabled: boolean = true;
  @Output() selectedCardsChange = new EventEmitter<Card[]>();
  @HostBinding('class.p-border') borderApplied = true;

  handleSelectionChange(event: any) {
    this.selectedCardsChange.emit(event);
  }

  customCardSort(event: any) {
    event.data.sort((card1: Card, card2: Card) => {
      let result = null;

      switch (event.field) {
        case 'cmc':
          const cmc1 = card1.cmc;
          const cmc2 = card2.cmc;
          result = cmc1 - cmc2;
          break;
        case 'name':
          const name1 = card1.name.toLowerCase();
          const name2 = card2.name.toLowerCase();
          result = name1.localeCompare(name2);
          break;
        case 'rarity':
          // Define rarity order for comparison
          const rarityOrder: {[index: string]: number} = {
            'common': 1,
            'uncommon': 2,
            'rare': 3,
            'mythic': 4
          };
          const rarity1 = rarityOrder[card1.rarity];
          const rarity2 = rarityOrder[card2.rarity];
          result = rarity1 - rarity2;
          break;
        case 'mana_cost':
          const convertManaCostToValue = (manaCost: string): number => {
            let totalManaValue = 0;
            const parsedCosts = this.parseManaCosts(manaCost);

            if (!parsedCosts) return 0;

            for (const cost of parsedCosts) {
              const segment = cost.substring(1, cost.length - 1);
              if (/^\d+$/.test(segment)) {
                totalManaValue += parseInt(segment, 10);
              } else if (segment === 'X' || segment === 'Y') {
                totalManaValue += 0;
              } else {
                totalManaValue += 1;
              }
            }

            return totalManaValue;
          };

          const cost1 = convertManaCostToValue(card1.manaCost);
          const cost2 = convertManaCostToValue(card2.manaCost);
          result = cost1 - cost2;
          break;
        default:
          // For any other field, maintain existing comparison logic
          let value1, value2;

          if (event.field) {
            value1 = card1[event.field as keyof Card];
            value2 = card2[event.field as keyof Card];
          } else {
            value1 = null;
            value2 = null;
          }

          if (value1 == null && value2 != null) result = -1;
          else if (value1 != null && value2 == null) result = 1;
          else if (value1 == null && value2 == null) result = 0;
          else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
          else result = value1! < value2! ? -1 : value1! > value2! ? 1 : 0;
          break;
      }

      return event.order * result;
    });
  }

  private parseManaCosts(manaCost: string) {
    const regex = /\{([0-9RGBWUXPYB/]+)\}/g;

    const matches = manaCost.match(regex);

    return matches?.map(match => match.substring(1, match.length - 1));
  }

  handleCardClick(card: Card) {
    this.selectedCards = this.checkIfCardSelected(card)
      ? this.selectedCards.filter(value => value.id != card.id)
      : [...this.selectedCards, card];

    this.emitSelectedCards();
  }

  emitSelectedCards() {
    this.selectedCardsChange.emit(this.selectedCards);
  }

  checkIfCardSelected(card: Card): boolean {
    return this.selectedCards.some(value => value.id == card.id);
  }

  redirectToScryfall(link: string) {
    window.open(link);
  }

  onSelectionChange(event: any) {
    this.emitSelectedCards();
  }
}
