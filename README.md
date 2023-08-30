# Nest-auth

**Easy authentication system for Nestjs**

Nest-auth is a super light-weight lib to work with Google and Github OAuth2 system. Super easy usage and stable!
Also, you can use it for email auth.

1. **First install the package:**
   `npm install nest-auth`
   .
   .
2. **Create a `.env` file in your root path and put this sample code in it:**

```
NEST_AUTH_SECRET=[paste_your_secret_jwt_sign_code]
MAIN_URL=http://localhost:3000/

# GOOGLE
GOOGLE_CLIENT_ID=[paste_your_client_id]
GOOGLE_CLIENT_SECRET=[paste_your_secret_id]

# GITHUB
GITHUB_CLIENT_ID=[paste_your_client_id]
GITHUB_CLIENT_SECRET=[paste_your_secret_id]

# REDIRECT BACK AFTER SUCCESS AUTH like: /test will gose to ==> http://mainurl.com/test
REDIRECT_BACK=/
```
To create secure JWT secret key use this code in terminal:
`node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"`
.

⚠️⚠️⚠️ DONT FORGET TO PASTE YOUR ID IN `.env` FILE ⚠️⚠️⚠️
To create google oauth id 👉 https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid
To create github oauth id, first login and click here 👉 https://github.com/settings/applications/new
.
. 3. **Add NestAuthController to `app.module.ts` file:**

```
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestAuthController } from 'nest-auth';

@Module({
  imports: [],
  controllers: [AppController, NestAuthController],
  providers: [AppService],
})
export class AppModule {}
```

.
##How to use it?
Here is 3 options to use this lib:

1. Google auth
2. Github auth
3. Email auth

.
First import neccessary libs in a controlle file:

```
import {NestAuth} from 'nest-auth'
import { Request, Response } from 'express';
```

.
Then add `Reauest` and `Responce` to your function input

```
getHello(@Req() req: Request, @Res() res: Response): void {
    ...
}
```

.
Create an object from `NestAuth` and pass params:

```
const nestAuth = new NestAuth(req, res, 'google');
```

Input table for `NestAuth` class:
|Name|Type|Reqired|
|---|---|---|
|req|Express Request|Yes|
|res|Express Responce|Yes|
|provider|String: 'google', 'github', 'jwt'|Yes|

##### What you can use from `nestAuth` object?
1. First you have to redirect user to the provider, you can use this function of object to redirect user. You can pass custom scops to the `redirector`
`nestAuth.redirectToProvider()`
You can pass the scops with an `space` or `%20` to the function with `string` type like this, but if it be empty, function will pass default public scops.
```
const scopes = "read:user user:email"
nestAuth.redirectToProvider(scopes)
```

.

2. After success auth, you can verify the token that save with name `Authorization` in cookies whith this function and get verification `boolean` responce and `data` of verification.
```
// Get verification of the token
const verification:boolean = nestAuth.verifyToken().is_verified

// Get data of token if verification is true
const tokenData = nestAuth.verifyToken().data
```
Output of `data` table:
|Name|Type|
|---|---|
|  id | string  |
|  name | string  |
|  email | string  |
|  image | string  |
|  expire_at | number  |

Output example:
```
{
  data: {
    id: '1107152342347135077',
    name: 'Rad',
    image: 'https://lh3.googleusercontent.com/a/AAcHTtf76PPEDkYNJ3EZ7VB4Z9VbP345dfg65hgSkqdkQWMU=s96-c',
    email: 'useremail@gmail.com',
    expire_at: 1694661158327
  },
  iat: 1693365158
}
```
**You can use `iat` time for security resons**

⚠️⚠️⚠️ IF YOU WANT TO GET ONLY THE DATA WITHOUT IAT USE THIS: ⚠️⚠️⚠️
`const tokenData = nestAuth.verifyToken().data.data`

## A full example of usage
```
import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import {NestAuth} from 'nest-auth';

@Controller()
export class AppController {
  @Get()
  getHello(@Req() req: Request, @Res() res: Response): void {
    const nestAuth = new NestAuth(req, res, 'google');
    if (!nestAuth.verifyToken().is_verified) {
      return nestAuth.redirectToProvider();
    } else {
      console.log(nestAuth.verifyToken().data)
      res.send({ message: 'Token saved!' });
    }
  }
}
```

#How to use just JWT
If you want to auth users with email or SMS you can pass `jwt` to provider and sign or verify token in cookies.
```
const nestAuth = new NestAuth(req, res, 'jwt');

// After success auth to make token
nestAuth.makeToken('nameOfToken',dataOfToken, options)


// To verify saved token
const verifiedToken = nestAuth.verifyToken('nameOfToken')
```
The output is like other providers but we have new inputs here, so new inputs in table is these:
Table of `makeToken` function:
|Name|Type|Reqired|
|---|---|---|
|name|String: default is 'Authorization'|No|
|data|Any|Yes|
|options|CookieOptions|No|
You can pass any options of cookie like `algorithm` and etc to `options`, if you dont pass, it will use default options. Default alorithm of crypt of token is `RS256`

Table of `verifyToken` function input:
|Name|Type|Reqired|
|---|---|---|
|name|String: default is 'Authorization'|No|

ALL CRYPTING METHODS USE SAME JWT SECRET KEY.
