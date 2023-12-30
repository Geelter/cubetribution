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

  emitSelectedCards() {
    this.selectedCardsChange.emit(this.selectedCards);
  }

  redirectToScryfall(link: string) {
    window.open(link);
  }
}
