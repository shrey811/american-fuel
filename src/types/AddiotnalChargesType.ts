export interface AdditionalChargesStateType {
    listAdditionalchargesLoading: boolean,
    addAdditionalchargesLoading: boolean,
    updateAdditionalchargesLoading: boolean,
    deleteAdditionalchargesLoading: boolean,
    additionalchargesList: AdditionalChargesDataType[];
}

export interface AdditionalChargesDataType {
    Id: number;
    Name: string,
    Price: number,
    PA_Income_FId: number,
    PA_Expense_FId: number,
    PA_Income_Name: string,
    PA_Expense_Name: string,
}


