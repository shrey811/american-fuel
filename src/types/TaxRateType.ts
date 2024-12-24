
export interface TaxRateStateType {
    addTaxRateLoading: boolean;
    listTaxRateLoading: boolean;
    deleteTaxRateLoading: boolean;
    updateTaxRateLoading: boolean;
    taxRateList: TaxRateDataType[];
}
export interface TaxRateDataType {
    TaxesFId: number;
    TaxesRateList: [
        {
            Rate: number;
            UnitType: string;
            Unit: string;
            EffectiveDateTime: string;
        }
    ]

}