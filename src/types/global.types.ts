export type LabelTypes = Record<string, Record<string, string>>;

export enum LanguageEnum {
  en = 'en',
  ne = 'ne',
}

export enum ThemeEnum {
  dark = 'dark',
  light = 'light'
}

export type Language = keyof typeof LanguageEnum;

export type Theme = keyof typeof ThemeEnum;

export type ThemeType = {
  theme: ThemeEnum;
  setTheme: (theme: ThemeEnum) => void;
}

export type LanguageType = {
  lang: LanguageEnum;
  setLang: (lang: LanguageEnum) => void;
};

export type multiLanguage = Record<string, string>;
