import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogModule} from "primeng/dialog";
import {CubesService} from "../../services/cubes.service";
import {DonationsService} from "../../services/donations.service";
import {Cube} from "../../models/cube";
import {Collection} from "../../models/collection";
import {ListboxModule} from "primeng/listbox";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-donate-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ListboxModule, FormsModule, ButtonModule],
  templateUrl: './donate-dialog.component.html',
  styleUrl: './donate-dialog.component.scss'
})
export class DonateDialogComponent {
  @Input({ required: true }) dialogVisible!: boolean;
  @Input({ required: true }) collection!: Collection;
  @Output() dialogVisibleChange = new EventEmitter<boolean>();
  readonly cubesService = inject(CubesService);
  readonly donationsService = inject(DonationsService);

  cubes$ = this.cubesService.cubes$;
  selectedCube: Cube | null = null;

  donateCollectionToCube(collection: Collection, cube: Cube) {
    if (this.selectedCube) {
      this.donationsService.createDonation(collection, cube);
    }

    this.dialogVisibleChange.emit(false);
  }

  constructor() {
    this.cubesService.initializeCubes();
  }
}
