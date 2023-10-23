# Nest-auther

<p align="center">
  <img src="./nest-auther.png" alt="Image Alt Text" width="200" height="200" style="display: block; margin: 30 auto" />
</p>

![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/scorpio-demon/Nest-auther/codeql.yml)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.0.12-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
[![npm](https://img.shields.io/npm/dt/nest-auther.svg)](https://www.npmjs.com/package/nest-auther)

- [Nest-auther](#nest-auther)
  - [Install](#install)
  - [Tips](#tips)
    - [Redirect back address for provider](#redirect-back-address-for-provider)
  - [How to use it?](#how-to-use-it)
  - [What you can use from `nestAuther` object?](#what-you-can-use-from-nestauther-object)
  - [A full example of usage](#a-full-example-of-usage)
  - [How to use just JWT](#how-to-use-just-jwt)
  - [License](#license)

Easy authentication system for Nestjs

Nest-auther is a super light-weight lib to work with Google and Github OAuth2 system. Super easy usage and stable!
Also, you can use it for email auth.

## Install

1. **First install the package:**
   `npm install nest-auther`
2. **Create a `.env` file in your root path and put this sample code in it:**

```env
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

3. **Add NestAutherController to `app.module.ts` file:**

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestAutherController } from 'nest-auther';

@Module({
  imports: [],
  controllers: [AppController, NestAutherController],
  providers: [AppService],
})
export class AppModule {}
```
## Tips
To create secure JWT secret key use this code in terminal:
`node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"`

⚠️⚠️⚠️ DONT FORGET TO PASTE YOUR ID IN `.env` FILE ⚠️⚠️⚠️

To create google oauth id 👉 <https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid>

To create github oauth id, first login and click here 👉 <https://github.com/settings/applications/new>

### Redirect back address for provider

The address you will add to your provider for redirect back is:

👉 For local host:
`http://localhost:3000/api/nest-auther`

👉 For real domain:
`https://[your-domain-in-here]/api/nest-auther`

## How to use it?

Here is 3 options to use this lib:

1. Google auth
2. Github auth
3. Email auth

First import neccessary libs in a controlle file:

```typescript
import { NestAuther } from 'nest-auther';
import { Request, Response } from 'express';
```

Then add `Reauest` and `Responce` to your function input

```typescript
getHello(@Req() req: Request, @Res() res: Response): void {
   // ...
}
```

Create an object from `NestAuther` and pass params:

```typescript
const nestAuther = new NestAuther(req, res, 'google');
```

Input table for `NestAuther` class:
| Name     | Type                              | Reqired |
| -------- | --------------------------------- | ------- |
| req      | Express Request                   | Yes     |
| res      | Express Responce                  | Yes     |
| provider | String: 'google', 'github', 'jwt' | Yes     |

## What you can use from `nestAuther` object?

1. First you have to redirect user to the provider, you can use this function of object to redirect user. You can pass custom scops to the `redirector`
   `nestAuther.redirectToProvider()`
   You can pass the scops with an `space` or `%20` to the function with `string` type like this, but if it be empty, function will pass default public scops.

```typescript
const scopes = 'read:user user:email';
nestAuther.redirectToProvider(scopes);
```

2. After success auth, you can verify the token that save with name `Authorization` in cookies whith this function and get verification `boolean` responce and `data` of verification.

```typescript
// Get verification of the token
const verification: boolean = nestAuther.verifyToken().is_verified;

// Get data of token if verification is true
const tokenData = nestAuther.verifyToken().data;
```

Output of `data` table:
| Name      | Type   |
| --------- | ------ |
| id        | string |
| name      | string |
| email     | string |
| image     | string |
| expire_at | number |

Output example:

```json
{
  "data": {
    "id": "1107152342347135077",
    "name": "Rad",
    "image": "https://lh3.googleusercontent.com/a/AAcHTtf76PPEDkYNJ3EZ7VB4Z9VbP345dfg65hgSkqdkQWMU=s96-c",
    "email": "useremail@gmail.com",
    "expire_at": 1694661158327
  },
  "iat": 1693365158
}
```

**You can use `iat` time for security resons**

⚠️⚠️⚠️ IF YOU WANT TO GET ONLY THE DATA WITHOUT IAT USE THIS: ⚠️⚠️⚠️

```typescript
const tokenData = nestAuther.verifyToken().data.data;
```

## A full example of usage

```typescript
import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { NestAuther } from 'nest-auther';

@Controller()
export class AppController {
  @Get()
  getHello(@Req() req: Request, @Res() res: Response): void {
    const nestAuther = new NestAuther(req, res, 'google');
    if (!nestAuther.verifyToken().is_verified) {
      return nestAuther.redirectToProvider();
    } else {
      console.log(nestAuther.verifyToken().data);
      res.send({ message: 'Token saved!' });
    }
  }
}
```

## How to use just JWT

If you want to auth users with email or SMS you can pass `jwt` to provider and sign or verify token in cookies.

```typescript
const nestAuther = new NestAuther(req, res, 'jwt');

// After success auth to make token
nestAuther.makeToken('nameOfToken', dataOfToken, options);

// To verify saved token
const verifiedToken = nestAuther.verifyToken('nameOfToken');
```

The output is like other providers but we have new inputs here, so new inputs in table is these:
Table of `makeToken` function:
| Name    | Type                               | Reqired |
| ------- | ---------------------------------- | ------- |
| name    | String: default is 'Authorization' | No      |
| data    | Any                                | Yes     |
| options | CookieOptions                      | No      |

You can pass any options of cookie like `algorithm` and etc to `options`, if you dont pass, it will use default options. Default alorithm of crypt of token is `RS256`

Table of `verifyToken` function input:
| Name | Type                               | Reqired |
| ---- | ---------------------------------- | ------- |
| name | String: default is 'Authorization' | No      |

ALL CRYPTING METHODS USE SAME JWT SECRET KEY.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The MIT License is a permissive open-source license that allows you to freely use, modify, distribute, and sublicense this software for both commercial and non-commercial purposes. You can find the full text of the MIT License in the [LICENSE](LICENSE) file included with this project.

Feel free to fork this project and use it in your own work, but please make sure to give proper attribution and include the original license text.
