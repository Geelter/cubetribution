import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, combineLatestWith, from, map, of, retry, switchMap, throwError} from "rxjs";
import {Cube} from "../models/cube";
import {SupabaseClientService} from "./supabase/supabase-client.service";
import {RequestState} from "../helpers/request-state.enum";
import {Tables} from "../models/supabase";

@Injectable({
  providedIn: 'root'
})
export class CubesService {
  private readonly supabase = inject(SupabaseClientService);

  private requestState = new BehaviorSubject<RequestState>(RequestState.Initial);
  requestState$ = this.requestState.asObservable();

  private cubes = new BehaviorSubject<Cube[]>([]);
  cubes$ = this.cubes.asObservable();

  private selectedCube = new BehaviorSubject<number | null>(null);
  selectedCube$ = this.cubes$.pipe(
    combineLatestWith(this.selectedCube.asObservable()),
    map(([cubes, chosenCubeID]) =>
      cubes.find(cube => cube.id == chosenCubeID)
    )
  );

  getCubes() {
    const requestState = this.requestState.getValue();
    if (
      requestState == RequestState.Success ||
      requestState == RequestState.InProgress
    ) return of(null);

    return this.fetchCubes();
  }

  fetchCubes() {
    this.setRequestState(RequestState.InProgress);

    return from(
      this.supabase.client
        .from('cubes')
        .select()
        .returns<Tables<'cubes'>[]>()
    ).pipe(
      switchMap(result => {
        if (result.error) {
          this.setRequestState(RequestState.Failure);
          return throwError(() => new Error(result.error.message));
        } else if (result.data) {
          const fetchedCubes = result.data.map(
            value => new Cube(value)
          );
          this.cubes.next(fetchedCubes);
          this.setRequestState(RequestState.Success);
        }
        return of(null);
      }),
      retry({ count: 2, delay: 1000 }),
    );
  }

  selectCube(cube: Cube) {
    this.selectedCube.next(cube.id);
  }

  clearSelectedCube() {
    this.selectedCube.next(null);
  }

  private setRequestState(state: RequestState) {
    this.requestState.next(state);
  }
}
