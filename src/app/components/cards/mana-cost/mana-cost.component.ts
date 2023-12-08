import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mana-cost',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mana-cost.component.html',
  styleUrl: './mana-cost.component.scss'
})
export class ManaCostComponent implements OnInit {
  @Input({ required: true }) manaCost!: string;

  parsedManaCosts: string[] | undefined;

  parseManaCosts() {
    const regex = /\{([0-9RGBWUXPYB/]+)\}/g;

    const matches = this.manaCost.match(regex);

    return matches?.map(match => {
      const subcost = match.substring(1, match.length - 1);
      return subcost.replace(/\//g, '');
    });
  }

  ngOnInit() {
    this.parsedManaCosts = this.parseManaCosts();
  }
}
