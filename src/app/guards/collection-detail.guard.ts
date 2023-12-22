import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {CollectionsService} from "../services/collections.service";
import {switchMap} from "rxjs";

export const collectionDetailGuard: CanActivateFn = () => {
  const router = inject(Router);
  const collectionsService = inject(CollectionsService);

  return collectionsService.selectedCollection$.pipe(
    switchMap(async (selectedCollection) =>
      selectedCollection ? true : router.parseUrl('/collection/list')
    )
  );
};
