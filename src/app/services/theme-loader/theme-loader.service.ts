import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeLoaderService {
  private readonly linkID = 'theme-link';
  private readonly themePath = 'assets/primeng/themes/lara';

  getThemeFor(mode: string): string {
    return this.themePath + '/lara-' + mode + '/amber/theme.css';
  }

  switchTheme(mode: string) {
      const currentLinkElement = document.getElementById(this.linkID) as HTMLLinkElement;
      const themeFile = this.getThemeFor(mode);

      if (currentLinkElement) {
        currentLinkElement.href = themeFile;
      }
  }
}
