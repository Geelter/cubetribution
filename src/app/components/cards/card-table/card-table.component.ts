import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableModule} from "primeng/table";
import {Card} from "../../../models/card";
import {ManaCostComponent} from "../mana-cost/mana-cost.component";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";

@Component({
  selector: 'app-card-table',
  standalone: true,
  imports: [CommonModule, TableModule, ManaCostComponent, ToolbarModule, ButtonModule, RippleModule],
  templateUrl: './card-table.component.html',
  styleUrl: './card-table.component.scss'
})
export class CardTableComponent {
  @Input({ required: true }) cardList!: Card[];
  @Input({ required: true }) selectedCards!: Card[];
  @Output() selectedCardsChange = new EventEmitter<Card[]>();

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

  parseManaCosts(manaCost: string) {
    const regex = /\{([0-9RGBWUXPYB/]+)\}/g;

    const matches = manaCost.match(regex);

    return matches?.map(match => match.substring(1, match.length - 1));
  }

  emitSelectedCards() {
    this.selectedCardsChange.emit(this.selectedCards);
  }

  redirectToScryfall(link: string) {
    window.open(link);
  }
}
