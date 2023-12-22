import {inject, Injectable} from '@angular/core';
import {SupabaseDatabaseService} from "./supabase/supabase-database.service";
import {BehaviorSubject} from "rxjs";
import {Cube} from "../models/cube";

@Injectable({
  providedIn: 'root'
})
export class CubesService {
  private readonly databaseService = inject(SupabaseDatabaseService);

  private cubes = new BehaviorSubject<Cube[] | null>(null);
  cubes$ = this.cubes.asObservable();

  private selectedCube = new BehaviorSubject<Cube | null>(null);
  selectedCube$ = this.selectedCube.asObservable();

  //TODO: Rewrite the code for flipping the subject value into something more elegant
  private requestInProgress = new BehaviorSubject<boolean>(false);
  requestInProgress$ = this.requestInProgress.asObservable();

  async initializeCubes() {
    const cubesValue = this.cubes.getValue();

    if (!cubesValue || !cubesValue.length) {
      await this.getCubes();
    }
  }

  async getCubes() {
    this.requestInProgress.next(true);

    const cubes = await this.databaseService.fetchCubes();

    if (cubes) {
      this.cubes.next(cubes);
    }

    this.requestInProgress.next(false);
  }

  selectCube(cube: Cube) {
    this.selectedCube.next(cube);
  }

  clearSelectedCube() {
    this.selectedCube.next(null);
  }
}
