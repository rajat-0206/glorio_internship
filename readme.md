# Parking management system
Node based apis for Glorio internship. 

Project made by <a href="https://itsrajat.xyz">Rajat Shrivastava</a>

Follow the below instruction to correctly setup and run the project.

## Pre-requisites
<p>Node 14.x installed. Download it from <a href="https://nodejs.org/en/">here</a></p>
    
## Cloning the project

Run the following command to clone the project

```
git clone https://github.com/rajat-0206/glorio_internship
```

## Setting up the project

- In the root of the project make a new file called <strong> .env </strong>.
- Copy the code from <a href="https://github.com/rajat-0206/socialcomments/blob/main/.sample.env">sample.env</a> into your <strong>.env</strong> file.
- Fill in all the values in your <strong>.env</strong> file.
- Now install the dependencies required for the project. From the root of the project run the following command.

    ```
    npm install
    ```    
## Running the project

To run and test the project, run the following command from root of the project.

```
npm start
```
Additionally, if you have nodemon installed in your pc, then you can run the following command to start the server
```
nodemon serve
```
Now visit http://localhost:5000 to check if project is running successfully.


## REST API DOCUMENTATION

<p>Documentation for the rest apis start here. 
</p>
<p>The auth token generated in the login api can be sent via header by placing it in <strong>bearer token</strong>.

## Register User

### Request

`POST https://gloiriobackend.herokuapp.com/signup`

    {
        "email": "<some valid email address>",
        "password": "<should be atleast 5 character long and shoul contain one upper case, one lower case, one number and one special character>",
        "name": "<a valid string>"
    }

### Response
```
{
    "id":"<created user id>",
    "response":"A verification mail has been sent to your mailid"
    "code":true
}
```

## Login

### Request

`POST https://gloiriobackend.herokuapp.com/login`

    {
        "email": "<some valid email address>",
        "password": "<should be atleast 5 character long and shoul contain one upper case, one lower case, one number and one special character>",
    }

### Response
```
{
    "id":"<created user id>",
    "token":"<token for user verification>"
    "code":true
}
```
The token recieved in this api is valid for 4 hours. The token can be sent as bearer token in request header.



## Verify Email 
This url is sent on registered mail id. User just need to click on it to verify their email account. The link is valud only once.
### Request

`GET https://gloiriobackend.herokuapp.com/verify/<a random number>`


### Response
```
someone@email.com verified successfull
```

## Dashboard

### Request

`GET https://gloiriobackend.herokuapp.com/dashboard`

### Response
```
{
  "user": {
    "_id": "<object id>",
    "email": "<user email>",
    "name": "<Name>",
    "balance":<1000>,
    "is_validated": <true/false>,
    "created": "<time>"
  },
  "buildings": [
    {
      "_id": "60cdd37f114b851d7cb8d23e",
      "name": "Building A",
      "total_slots": 10,
      "available_slots": 10,
      "filled": []
    },
    {
      "_id": "60cdd3bce7e2d11a98e5abb6",
      "name": "Building B",
      "total_slots": 20,
      "available_slots": 20,
      "filled": []
    },
    {
      "_id": "60cdd3bce7e2d11a98e5abb7",
      "name": "Building C",
      "total_slots": 40,
      "available_slots": 40,
      "filled": []
    }
  ]
}
```


## Add Balance 

### Request

`POST https://gloiriobackend.herokuapp.com/addbalance`

    {
    "amount":<some integer>
    }

### Response
```
{
  "new_balance": "<new balance>",
  "code": true
}

```

## Book Parking Slot

### Request

`POST https://gloiriobackend.herokuapp.com/parkcar`

    {
    "building":"<building name>",
    "slot":<slot number>
    }

### Response
```
{
  "response": "car parked successfull",
  "code": true
}

```


## Unpark/ free the car

### Request

`POST https://gloiriobackend.herokuapp.com/unparkcar`

    {
    "bookingid":"<booking id>"
}

### Response
```
{
  "response": "car unparked successfull",
  "code": true
}
```


## View History

### Request

`GET https://gloiriobackend.herokuapp.com/history`


### Response
```
{
  "response": [
    {
      "_id": "<booking id>",
      "user": "<user email>",
      "parking_time": "Sun Jun 20 2021 16:20:50 GMT+0000 (Coordinated Universal Time)",
      "charges": 100,
      "slot": "Building B slot 1",
      "unpark_time": "Sun Jun 20 2021 16:21:21 GMT+0000 (Coordinated Universal Time)"
    },
  ]
}
```


