export interface ReportStateType {
    addReportLoading: boolean;
    reportList: ReportDataType[];

}

export interface ReportDataType {
    Id: number;
    EffectiveDateTime: string,
    EffectiveDateTime2: string,
    ProductFid: number,
}
