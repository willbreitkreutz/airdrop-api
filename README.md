# Airdrop API

Welcome to the API for super awesome spatial game Airdrop!

## API Documentation

### Authentication API

<details>
  <summary><code>POST</code> <code><b>/login</b></code> <code>(logs a user into the app, creating the user profile if it does not already exist)</code></summary>

##### JSON Request Body

> | name       | type     | data type | description                      |
> | ---------- | -------- | --------- | -------------------------------- |
> | `username` | required | string    | The username to lookup or create |
> | `password` | required | string    | The password to lookup or create |

##### Responses

> | http code | content-type               | response                                                                     |
> | --------- | -------------------------- | ---------------------------------------------------------------------------- |
> | `200`     | `application/json`         | `{ "token": <JSON Web Token> }` (see [JWT.io](https://jwt.io) for more info) |
> | `401`     | `text/html; charset=utf-8` | `Login failed`                                                               |

> Note that if the password is wrong you will recieve the 401, but if the username is wrong it will create a new user

</details>

<details>
  <summary><code>GET</code> <code><b>/verify-token</b></code> <code>(returns the payload of a JWT token if it is valid)</code></summary>

##### Headers

> | name       | value            |
> | ---------- | ---------------- |
> | `username` | "Bearer <token>" |

##### Responses

> | http code | content-type       | response                       |
> | --------- | ------------------ | ------------------------------ |
> | `200`     | `application/json` | `JSON User` (see models below) |

</details>

### Game API

<details>
  <summary><code>POST</code> <code><b>/games/new</b></code> <code>(create a new game instance, requires ADMIN role)</code></summary>

##### JSON Request Body

> | name            | type     | data type                   | description                                                  |
> | --------------- | -------- | --------------------------- | ------------------------------------------------------------ |
> | `name`          | required | string                      | Name of the game to display in the UI                        |
> | `startTime`     | required | string - Date.toIsoString() | When should the game start generating prize points           |
> | `endTime`       | required | string - Date.toIsoString() | When should the game end and a winner be declared            |
> | `prizeCount`    | required | number                      | How many prizes will this game offer over its lifetime       |
> | `prizeMaxValue` | required | number                      | Initial point value of each prize                            |
> | `prizeDuration` | required | number                      | Duration of prize validity in ms                             |
> | `geom`          | required | object - geojson Feature    | Boundary of the game within which all prizes will be located |

##### Responses

> | http code | content-type               | response                                                          |
> | --------- | -------------------------- | ----------------------------------------------------------------- |
> | `200`     | `application/json`         | `JSON Game` (see models below)                                    |
> | `401`     | `text/html; charset=utf-8` | `Unauthorized, you did not present a toke with a role of "ADMIN"` |

</details>

## Models

These are the data structures you will be seeing in JSON responses from the API

### User

```json
{
    "sub": integer user id,
    "username": string username,
    "roles": array of strings, either "PLAYER" or "ADMIN",
    "iat": integer timestamp when token was issued,
    "exp": integer timestamp when token expires
}
```

### Game

```json
{
    "id": integer game id,
    "joinCode": string 4 character code used to join the game,
    "name": string name,
    "geom": geojson Feature - bounding polygon for the game,
    "bbox": array of number, bounding coordinates for the geom,
    "startTime": string timestamp when game starts,
    "endTime": string timestamp when game ends,
    "prizeCount": integer count of prizes,
    "dropInterval": integer interval between prize drops
}
```
