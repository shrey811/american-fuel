export interface AccountStateType {
    listInutitLoading: boolean;
    listAccountLoading: boolean;
    accountListData: AccountDataType[];
}

export interface AccountDataType {
    Id: number,
    Name: string,
    IntuitId: string,
    Type: string,
}
