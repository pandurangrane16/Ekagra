import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

export const THEME_KEY = 'userThemeSelection';
export enum themeType {
  Dark = 'dark-theme',
  Light = 'light-theme',
}

@Injectable({
    providedIn: 'root',
  })
export class ThemeManagerService {
  theme: themeType;
  constructor(@Inject(DOCUMENT) private document: Document) {
    let selectedTheme = themeType.Dark;

    try {
      const storedTheme = localStorage.getItem(THEME_KEY) as themeType;
      if (storedTheme) {
        selectedTheme = storedTheme;
      }
    } catch (e) {
      // Do nothing
      console.log('no stored theme');
    }

    this.theme = selectedTheme;
  }

  init() {
    this.updateThemingOnBody(this.theme);
  }

  toggleTheme() {
    this.setTheme(
      this.theme === themeType.Dark ? themeType.Light : themeType.Dark
    );
  }

  setTheme(theme: themeType) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      // Do nothing
    }
    this.theme = theme;

    this.updateThemingOnBody(theme);
  }

  private updateThemingOnBody(theme: themeType) {
    if (this.document.documentElement) {
      this.document.documentElement.className = '';
      this.document.documentElement.classList.add(theme);
    }
  }
}
