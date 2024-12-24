export interface IntuitStateType {
    intuitDataLoading: boolean;
    intuitListData: IntuitDataType[];
}

export interface IntuitDataType {
    Description: string;
    Category: string;
    API: string;
    Auth: string;
    Cors: string;
    HTTPS: boolean;
    Link: string;
}
