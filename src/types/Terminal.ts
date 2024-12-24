export interface TerminalStateType {
    terminalDataLoading: boolean;
    listTerminalLoading: boolean;
    listAllTerminalLoading: boolean;
    terminalListData: TerminalDataType[];
}

export interface TerminalDataType {
    Id: number,
    Name: string,
    Number: string,
    Address: string,
    Zip: string,
    CityFId: string,
    StatesFId: string,
    // Add other address properties as needed
}

