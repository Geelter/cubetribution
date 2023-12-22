import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {CubesService} from "../services/cubes.service";
import {switchMap} from "rxjs";

export const cubeDetailGuard: CanActivateFn = () => {
  const router = inject(Router);
  const cubesService = inject(CubesService);

  return cubesService.selectedCube$.pipe(
    switchMap(async (selectedCube) =>
      selectedCube ? true : router.parseUrl('/cube/list')
    )
  );
};
