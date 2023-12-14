import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from "@angular/router";
import {CubesService} from "../../../services/cubes.service";
import {Cube} from "../../../models/cube";
import {ButtonModule} from "primeng/button";
import {ToolbarModule} from "primeng/toolbar";

@Component({
  selector: 'app-cube-grid',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToolbarModule],
  templateUrl: './cube-grid.component.html',
  styleUrl: './cube-grid.component.scss'
})
export class CubeGridComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly cubesService = inject(CubesService);
  cubesList$ = this.cubesService.cubes$;

  refreshCubes() {
    this.cubesService.getCubes();
  }

  selectCube(cube: Cube) {
    this.cubesService.selectCube(cube);
    this.router.navigate(['cube-detail']);
  }

  ngOnInit() {
    this.cubesService.initializeCubes();
  }
}
