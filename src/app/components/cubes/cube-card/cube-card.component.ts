import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Cube} from "../../../models/cube";

@Component({
  selector: 'app-cube-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './cube-card.component.html',
  styleUrl: './cube-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CubeCardComponent {
  @Input({ required: true }) cube!: Cube;
  @Output() cubeClicked = new EventEmitter<void>();

  handleCubeClick() {
    this.cubeClicked.emit();
  }
}
