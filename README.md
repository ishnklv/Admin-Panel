<h1>Admin-Panel</h1>
<p>Powered by I. Aktan</p>

## Installation

```bash
$ npm install
```
```bash
$ yarn install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# Endpoints
<b>POST</b> Signup - ``http://localhost:5000/account/signup``

payload: 
``` json
    {
        "first_name": string;
        "last_name": string;
        "email": string;
        "password": string;
    }
```

<b>POST</b> Signin - ``http://localhost:5000/account/signin``

payload:
``` json
    {
        "email": string;
        "password": string;
        "password2": string;
    }
```

<b>GET</b> Profile - ``http://localhost:5000/account/profile``

payload:
```
    Headers
    {
        "Authorization": "Bearer :token"
    }
```

<b>POST</b> Reset Password - ``http://localhost:5000/account/reset-password``

payload:
``` json
    {
        "email": string;
    }
```

<b>POST</b> Reset Password - ``http://localhost:5000/account/:token``

payload:
``` json
    {
        "password": string;
        "password2": string;
    }
```

<b>POST</b> Create Role - ``http://localhost:5000/account/role``

payload:
``` json
    {
        "value": string;
    }
```

<b>GET</b> Create Role - ``http://localhost:5000/account/role``


<b>POST</b> Create User Role - ``http://localhost:5000/account/role/user-role``

payload:
``` json
    {
        "user_id": ObjectId,
        "role_id": ObjectId
    }
```

<b>PUT</b> Create User Role - ``http://localhost:5000/account/role/user-role``

payload:
``` json
    {
        "user_id": ObjectId,
        "oldRole": string;
        "newRole": string;
    }
```


## Stay in touch

- Author - [Aktan](https://kamilmysliwiec.com)

