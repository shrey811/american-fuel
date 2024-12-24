import { STORAGE_KEY } from 'globalConstants/rootConstants';

export function authHeader(jsonType = true) {
  const authDetails = localStorage.getItem(STORAGE_KEY);
  console.log({ authDetails });

  const type = jsonType
    ? { 'Content-Type': 'application/json' }
    : { 'Content-Type': '' };

  if (authDetails) {
    const tokenType = 'BEARER';
    const accessToken = authDetails;
    const authorization = `${tokenType} ${accessToken}`;
    return { Authorization: authorization, ...type };
  }

  console.log({ authDetails });
  return { ...type };
}