export interface StateCityStateType {

    listCityStateLoading: boolean;
    cityStateList: CityStateDataType[];
}

export interface CityStateDataType {
    Id: number;

    StateFId: number;

    Name: string;
}
