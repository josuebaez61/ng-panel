export interface Country {
  id: string;
  name: string;
}

export interface State {
  id: string;
  name: string;
}

export interface County {
  id: string;
  name: string;
}

export interface Locality {
  id: string;
  name: string;
}

export type CountryOption = Pick<Country, 'id' | 'name'>;
export type StateOption = Pick<State, 'id' | 'name'>;
export type CountyOption = Pick<County, 'id' | 'name'>;
export type LocalityOption = Pick<Locality, 'id' | 'name'>;
