# Filippo Miorin's autoSense Coding Challenge

This is the RESTful API for the web app that can be found [here](https://github.com/FeelHippo/gasStationsApp)

## Built With:

* [ExpressJs](https://www.npmjs.com/package/express)
* [TS](https://www.typescriptlang.org/)
* [Mongoose](https://www.npmjs.com/package/mongoose)
* [LokiJs](https://github.com/techfort/LokiJS)

... and several other packages that can be found in this repo's package.json.


## Install Dependencies

```
npm install
```

## Run the app

* Development
```
npm run serve
```

* Production
```
npm start
```

# REST API:

The REST API and its various endpoints are described below.

# Authentication

## Verify whether user is registered:
### Request

`GET /user/login/:user`

### Response
```
  {
    "username": "UserAdmin",
    "password": "123abc",
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWE4OWEzMTM0ZTRhZGFkM2QxOTQ2ODciLCJpYXQiOjE2Mzg0Mzk1MTQsImV4cCI6MTYzOTA0NDMxNH0.BCBUOjn8HJxUILjE5MYvB5Uy_aJ-ujpfSs2MPM_oLuU"
  }
```
## Create an account:
### Request

`POST /user/register`

### Response
```
  {
    "_doc": {
        "username": "newUserName",
        "password": "$2b$10$EQfYCSj.60FtX3vueXDLMOZaPhjp6CBlD/30IDP/sxd1dkWV.vDJq",
        "_id": "61a8bd13d6673762a5a7ba76",
        "__v": 0
    },
    "success": true
  }
```
## Authenticate existing account
### Request

`POST /user/login`

### Response
```
  {
    "username": "UserAdmin",
    "password": "123abc",
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWE4OWEzMTM0ZTRhZGFkM2QxOTQ2ODciLCJpYXQiOjE2Mzg0Mzk1MTQsImV4cCI6MTYzOTA0NDMxNH0.BCBUOjn8HJxUILjE5MYvB5Uy_aJ-ujpfSs2MPM_oLuU"
  } 
```
## Initiate/validate JWT token
### Request

`GET /user/tokenIsValid`

### Response
```
  {
    "success": true
  } 
```
------------------------------------
# Stations

## Return geoLocation data
### Request

`GET /api/allStations`

### Response
```
  [
    {
      "id": "MIGROL_100086",
      "name": "Tankstelle SOCAR",
      "address": "Klotenerstrasse 46, 8303",
      "city": "Bassersdorf",
      "latitude": 47.44945112101852,
      "longitude": 8.620147705078127,
      "pumps": [
          {
            "id": "10001",
            "fuel_type": "BENZIN_95",
            "price": 1.71,
            "available": true
          },
          {
            "id": "10002",
            "fuel_type": "BENZIN_98",
            "price": 0,
            "available": false
          },
          {
            "id": "10003",
            "fuel_type": "DIESEL",
            "price": 1.75,
            "available": true
          }
      ],
      "meta": {
        "revision": 3,
        "created": 1638400122464,
        "version": 0,
        "updated": 1638435433705
      }
    },
    ...
  ]
```
## Create new station
### Request

`POST /api/postStation`

* Payload:
```
{
  "id": string,
  "name": string,
  "address": string,
  "city": string,
  "latitude": float,
  "longitude": float,
  "pumps": [
      {
        "id": "10001",
        "fuel_type": "BENZIN_95",
        "price": float,
        "available": boolean
      },
      {
        "id": "10002",
        "fuel_type": "BENZIN_98",
        "price": float,
        "available": boolean
      },
      {
        "id": "10003",
        "fuel_type": "DIESEL",
        "price": float,
        "available": boolean
      }
  ],
}
```
### Response
```
  {
    status: 200,
    {
      "success": true
    } 
  }
```
## Update existing station
### Request

`PUT /api/updateStation`

### Response
```
  {
    status: 200,
    {
      "success": true
    } 
  }
```
## Get changed Thing
### Request

`DELETE /api/deleteStation/:id`

### Response
```
  {
    status: 200,
    {
      "success": true
    } 
  }
```
- a change here
- another change here
