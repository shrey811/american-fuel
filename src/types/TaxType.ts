export interface TaxStateType {
    addTaxLoading: boolean;
    listTaxLoading: boolean;
    deleteTaxLoading: boolean;
    getPuchaseorderTaxLoading: boolean;
    taxList: TaxDataType[];
}

export interface TaxDataType {

    Id: number;
    Name: string,
    Type: string,
    Code: string,
    Rate: number,
    UnitType: string,
    Unit: string,
    IsState: boolean,
    IsCity: boolean,
    CityName: string,
    PA_Income_FId: number;
    PA_Expense_FId: number;
    StateName: string,
    ProductsDetails: [
        {
            ProductsCategoryFId: number,
            ProductFId: number[]; // Changed to number[] for clarity
            IsProduct: true; // Change to boolean if necessary
        }
    ],

    StateFId: number,
    CitiesFId: number,
    IsProductCategory: boolean
}



