import { authHeader } from './authHeader';
import { handleResponse } from './handleResponse';

type AllType = string | number | Blob | File | FormData;

async function getRequest(requestURL: string, auth = true) {
  const requestOptions: RequestInit = {
    method: 'GET',
  };
  if (auth) {
    const authHeaders = await authHeader();
    requestOptions.headers = authHeaders;
  }
  return fetch(requestURL, requestOptions).then(handleResponse);
}

async function postRequest(
  requestURL: string,
  payload: AllType,
  auth = true,
  stringify = true
) {
  const requestOptions: RequestInit = {
    method: 'POST',
    body: stringify
      ? (JSON.stringify(payload) as BodyInit)
      : (payload as BodyInit),
  };
  if (auth) {
    const authHeaders = await authHeader(stringify);
    requestOptions.headers = authHeaders;
  }
  return fetch(requestURL, requestOptions).then(handleResponse);
}

async function deleteRequest(
  requestURL: string,
  payload?: AllType,
  auth = true,
  stringify = true
) {
  const requestOptions: RequestInit = {
    method: 'DELETE',
  };
  if (payload) {
    requestOptions.body = stringify
      ? (JSON.stringify(payload) as BodyInit)
      : (payload as BodyInit);
  }
  if (auth) {
    const authHeaders = await authHeader();
    requestOptions.headers = authHeaders;
  }
  return fetch(requestURL, requestOptions).then(handleResponse);
}

async function putRequest(
  requestURL: string,
  payload: AllType,
  auth = true,
  stringify = true
) {
  const requestOptions: RequestInit = {
    method: 'PUT',
    body: stringify
      ? (JSON.stringify(payload) as BodyInit)
      : (payload as BodyInit),
  };
  if (auth) {
    const authHeaders = await authHeader(stringify);
    requestOptions.headers = authHeaders;
  }
  return fetch(requestURL, requestOptions).then(handleResponse);
}

const apiHandler = {
  getRequest,
  postRequest,
  deleteRequest,
  putRequest,
};

export { apiHandler };
