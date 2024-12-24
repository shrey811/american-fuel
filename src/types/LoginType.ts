export interface LoginStateType {
  loginDataLoading: boolean;
  loginListData: LoginDataType[];
}

export interface LoginDataType {
  Description: string;
  Category: string;
  API: string;
  Auth: string;
  Cors: string;
  HTTPS: boolean;
  Link: string;
}
