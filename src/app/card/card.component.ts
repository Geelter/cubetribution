import {Component, Input} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Card} from "../models/card";

enum CardFaces {
  Front,
  Back
}

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

  getCardImageURI(face: CardFaces): string {
    const card = this.card;

    if (this.isTwoSided()) return card.card_faces![face.valueOf()].image_uris!.normal;

    if (card.image_uris) return card.image_uris.normal;

    return '../assets/images/mtg_card_back.jpeg';
  }

  isTwoSided(): boolean {
    const card = this.card;
    return !!(card.card_faces && card.card_faces[0].image_uris != null);
  }

  flip() {
    this.isFlipped = !this.isFlipped;
  }

  protected readonly CardFaces = CardFaces;
}
