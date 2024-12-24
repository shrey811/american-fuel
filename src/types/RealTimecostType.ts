export interface RealTimeCostStateType {
  listRealTimeLoading: boolean;
  addRealTimeLoading: boolean;
  filterRealTimeLoading: boolean;
  realtimeList: RealTimeCostDataType[];
  uploadRealTimeLoading: boolean;
}

export interface RealTimeCostDataType {
  Id: number;
  EffectiveDateTime: string,
  Cost: number,
  VendorsFId: number,
  TerminalsFId: number,
  ProductsFId: number,
  Vendors: string,
  Type: string,
  Terminals: string,
  Products: string,
}
