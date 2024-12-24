export interface UserStateType {
    userListLoading: boolean;
    userListData: UserDataType[];
}

export interface UserDataType {
    Description: string;
    Category: string;
    API: string;
    Auth: string;
    Cors: string;
    HTTPS: boolean;
    Link: string;
}
