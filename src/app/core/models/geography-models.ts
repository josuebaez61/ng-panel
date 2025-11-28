export interface CountryFlag {
  png: string;
  svg: string;
  alt: string;
}

export interface PhoneCodeDto {
  id: string;
  name: string;
  iso2: string;
  phoneCode: string;
  emoji: string;
  flags: CountryFlag;
}
