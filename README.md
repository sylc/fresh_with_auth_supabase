# fresh project

## Goal

A boilerplate project for using fresh with authentication powered by supabase running in deno deploy

### Usage

Start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.

## Not using SUPABASE-JS

Supabase provide a client supabase-js to facilitate the supabase integration.
However this client is not compatible with deno deploy. see [comment](https://github.com/supabase/supabase-js/issues/161#issuecomment-947229507). This is limiting the 

> If you don't want to use deno deploy then this implementation might not be the best one.

## Login

### OAUTH

deno deploy runs on the edge, far away from the database. So instead of verifying the user by making a call to the database, the request is authenticated by verifying the jwt on the server. 
This works great for basic usage. However if some parameter needs to be retrieve from the user profile, then the optimisation is lost. 

### Email and password

TODO:. Not tested yet.

### Resources
- JWT anatomy https://fusionauth.io/learn/expert-advice/tokens/anatomy-of-jwt
- https://stackoverflow.com/questions/69126222/how-can-i-create-a-signed-jwt-using-npm-jose-and-then-verify-this-token

- Implement JWT https://thomasstep.com/blog/a-guide-to-using-jwt-in-javascript#creating-public-and-private-keys

refresh tokens: https://auth0.com/learn/refresh-tokens/