import {Injectable} from '@angular/core';

export enum ThemeMode {
  Light = 'light',
  Dark = 'dark'
}

@Injectable({
  providedIn: 'root'
})
export class ThemeLoaderService {
  private readonly linkID = 'theme-link';
  private readonly themePath = 'assets/primeng/themes/lara';

  private getThemeFor(mode: ThemeMode): string {
    return `${this.themePath}/lara-${mode}/amber/theme.css`;
  }

  switchTheme(mode: ThemeMode) {
    const currentLinkElement = document.querySelector(`#${this.linkID}`);
    const themeFile = this.getThemeFor(mode);

    if (currentLinkElement instanceof HTMLLinkElement) {
      currentLinkElement.href = themeFile;
    }
  }
}
