import {TestBed} from '@angular/core/testing';

import {ThemeLoaderService} from './theme-loader.service';
import {ThemeMode} from "./theme-loader.service";

describe('ThemeLoaderService', () => {
  let themeLoaderService: ThemeLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    themeLoaderService = TestBed.inject(ThemeLoaderService);
  });

  it('should be created', () => {
    expect(themeLoaderService).toBeTruthy();
  });

  it('should change the href attribute when given a valid theme mode', () => {
    const linkElement = document.createElement('link');
    linkElement.id = themeLoaderService['linkID'];
    document.body.appendChild(linkElement);

    themeLoaderService.switchTheme(ThemeMode.Light);

    const expectedPath = `${window.location.origin}/assets/primeng/themes/lara/lara-light/amber/theme.css`;
    expect(linkElement.href).toBe(expectedPath);
  });

  it('should not throw any errors and return void when given a valid theme mode', () => {
    expect(() => {
      themeLoaderService.switchTheme(ThemeMode.Light);
    }).not.toThrowError();
  });
});
