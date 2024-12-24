export interface CityStateType {
  listCityLoading: boolean;
  addCityLoading: boolean;
  deleteCityLoading: boolean;
  // updateCityLoading: boolean;
  cityList: CityDataType[];
}

export interface CityDataType {
  Id: number;
  StateName: string;
  StateFId: number;
  // CityName: string;
  Name: string;
}
