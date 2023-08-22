# mauss/api

The `/api` module exports a `fetcher` factory that can be used to create a `send` function to make requests. The factory can be configured heavily to fit your needs, it accepts an object that can contain the following properties:

-   `prepare` - a function that is called before the request is sent, it receives the specified `method` and `to` url string, and optionally a `body`, `from` URL, and `headers` object. It should _prepare_ and return an object that satisfies the [`RequestInit`](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request) interface
-   `intercept` - a function that is called against the `url` string before the request is sent
-   `sweep` - a function that is called when `fetch` throws an error, it receives the thrown exception and returns a string
-   `transform` - a function that is called when `fetch` returns a response, it receives the response and can return anything that will used as the `payload`, defaults to `r.json().catch(() => ({}))`
-   `exit` - a function that is called after the response is transformed, it receives a clone of the initial response and the `payload`, and should return a string if the request was unsuccessful, or anything falsy such as `void | false | null | undefined` if it was successful

```js
import { fetcher, type SendOptions } from 'mauss/api';

const send = fetcher({
  prepare({ method, to, body }) {
    // ... do some checks or logging
    return {
      method: method || 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
  },
  exit({ status }, payload) {
    if (status >= 500) return 'ServerError';
    if (status >= 400) return 'ClientError';
    // void or non-string means successful
  },
});

// use the `send` function above to make and export an abstraction
export const API = {
  // use getter to determine the template and infer the defined parameters
  get 'session/:id'() {
    // `tsf` function from 'mauss/std'
    const render = tsf('https://auth.example/{id}/login');
    return (params: Parameters<typeof render>[0], options: SendOptions = {}) => {
      const target = send(render(params), options);
      return {
        // ... abstraction methods, for example
        async post() {
          return await target.post();
        },
      };
    };
  },
};
```
