export interface SignupStateType {
    signupDataLoading: boolean;
    signupListData: SignupDataType[];
}

export interface SignupDataType {
    Description: string;
    Category: string;
    API: string;
    Auth: string;
    Cors: string;
    HTTPS: boolean;
    Link: string;
}
