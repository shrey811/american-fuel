export interface StateStateType {
    stateDataLoading: boolean;
    stateLoading: boolean;
    stateListData: StateDataType[];
}

export interface StateDataType {
    Id: number,
    Name: string,
    Symbol: string,
}
