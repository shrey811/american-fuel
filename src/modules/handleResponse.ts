export function handleResponse(response: Response) {
  // return authorization header with jwt token
  return response
    .text()
    .then((text) => {
      let data;
      try {
        data = text && JSON.parse(text);
      } catch (error) {
        return 'error';
      }
      if (response.ok) {
        if (response.status === 200 || response.status === 201) {
          return { message: data };
        }
      }

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // you can logout here
          // Return error message for 401 or 403 status
          return { code: 'UNAUTHORIZED', message: data || 'Unauthorized' };
        }
        if (response.status === 400) {
          // you can logout here
          // Return error message for 401 or 403 status
          return { code: 'ERROR', message: data || 'Unauthorized' };
        }
        const error = data || response.statusText;
        return Promise.reject(error);
      }
      return data;
    })
    .catch(() => ({ code: 'ERROR', message: 'Something went wrong.' }));
}
