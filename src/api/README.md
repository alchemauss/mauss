# mauss/api

This defaults to `fetch` api from browser, but you can also use it on the server-side by first installing the package `node-fetch`. If you're using something like [SvelteKit](https://github.com/sveltejs/kit) that polyfills `fetch` globally, you won't have to worry about installing this.

```bash
npm install node-fetch
```

You can set a custom rule by calling `init` as early as possible. This is optional and might be useful for pointing to both same and external domain at the same time.

```js
import api from 'mauss/api';

api.init({
  host: process.env.NODE_ENV === 'production' ? 'mauss.dev' : 'localhost:3000',

  intercept(path) { /* returns a value that will be used as url for `fetch(url)` */
    const base = process.env.NODE_ENV !== 'production'
      ? 'https://development.url/api/'
      : 'https://production.url/api/';

    /* differentiate external vs same-domain by checking if path starts with '/' */
    return path[0] !== '/' ? base + path : path.slice(1);
  }
});
```

All the available exported API can be passed a url string or object of `{ path, fetch }`. This is especially useful for users working with [`load` function in SvelteKit](https://kit.svelte.dev/docs#loading-input-fetch) as `fetch` can be passed down the api call.

```js
import { get, post } from 'mauss/api';

const token = 'jwt:token'; // optional, pass for authenticated request

/* GET example */
const { response, body, error } = await get('/auth/profile', token);
if (response.ok) {
  console.log(body);  // user data in JSON format
} else {
  console.log(error); // error message in string
}

/* POST example */
const { response, body, error } = await post('/auth/login', {
  email: 'mail@example.com',
  password: 'super_secure_password',
});
if (response.ok) {
  console.log(body);  // response body
} else {
  console.log(error); // error message
}
```
