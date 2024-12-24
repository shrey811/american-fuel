export interface TestStateType {
  testDataLoading: boolean;
  testListData: TestDataType[];
}

export interface TestDataType {
  Description: string;
  Category: string;
  API: string;
  Auth: string;
  Cors: string;
  HTTPS: boolean;
  Link: string;
}
