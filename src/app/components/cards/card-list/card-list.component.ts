import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CardGridComponent} from "../card-grid/card-grid.component";
import {CardTableComponent} from "../card-table/card-table.component";
import {Card} from "../../../models/card";

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, CardGridComponent, CardTableComponent],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss'
})
export class CardListComponent {
  @Input({ required: true }) selectedLayout!: string;
  @Input({ required: true }) cardList!: Card[];
  @Input({ required: true }) selectedCards!: Card[];
  @Output() selectedCardsChange = new EventEmitter<Card[]>();
  @HostBinding('class.p-border') borderApplied = true;

  handleSelectionChange(event: any) {
    this.selectedCardsChange.emit(event);
  }
}
