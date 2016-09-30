# Yet Another Secure Delivery Application

[![Dependency Status](https://david-dm.org/gbuszmicz/yasdapp.svg?style=flat)](https://david-dm.org/gbuszmicz/yasdapp)
[![devDependency Status](https://david-dm.org/gbuszmicz/yasdapp/dev-status.svg?style=flat)](https://david-dm.org/gbuszmicz/yasdapp#info=devDependencies)

A free, simple and secure way to send encrypted files to your friends and coworkers

<p align="center">
  <img src ="https://raw.githubusercontent.com/gbuszmicz/yasdapp/master/public/img/Screenshot.png" />
</p>


## Demo
You can check out [Yasdapp](https://yasdapp.com/) online and test it.
The app is runing on Heroku



## Installation
#### Clone the repo
```shell
$ git clone https://github.com/gbuszmicz/yasdapp.git myApp
$ cd myApp
$ npm install  # Install Node.js components listed in ./package.json
```


#### Create environment files
Before you start it you will need to create a directory and 2 files:
```shell
env    # this is the directory for the files
env/development.json
env/production.json
```

The files will contain all the info about the services you will need to run this software in development mode, and production. 
Here is an example:
```javascript
{
  "email": {
    "_comment": "Used by the worker to send the emails to users",
    "provider": "Mailgun",
    "domain": "sandbox3423423423423423423.mailgun.org",
    "api_key": "key-2342342342342342342342",
    "account": "postmaster@sandbox3423423423423423423.mailgun.org",
    "full_account": "Yasdapp Sandbox Notification <postmaster@sandbox3423423423423423423.mailgun.org>"
  },
  "mongodb": {
    "_comment": "Db for storing all app info",
    "url": "public.mongodb.com:12345",
    "dbname": "testing-dbname",
    "user": "testing-user",
    "pass": "testingSecretPass",
    "uri": "mongodb://testing-user:testingSecretPass@public.mongodb.com:12345/testing-dbname"
  },
  "s3": {
    "_comment": "Used to store the encrypted files uploaded by users",
    "accessKey": "JKSDFJASKDJAKSDJA",
    "secretKey": "asdkjasldaujsodasdha9sa/JKSDFJASKDJAKSDJA/ajsdalsja",
    "bucket": "yasdapp_bucket",
    "bucketUrl": "https://s3.amazonaws.com/yasdapp_bucket"
  },
  "redis": {
    "_comment": "Used to communicate the Web and the worker",
    "host": "public.redis.com",
    "port": "12345",
    "pass": "jakslda7hajksda7j3310a",
  },
  "app": {
    "_comment": "Just the app. localexample.com is an alias for 127.0.0.1 added in /etc/hosts file",
    "domain": "http://localexample.com:5000"
  }
}
```


#### Start the app
The app use [foreman](https://github.com/strongloop/node-foreman) to start the Web and the worker:
```shell
$ foreman start
```
If you want you can start both services without using foreman. Just start the Web and the worker


## Questions and issues
Feel free to contact me in [twitter](https://twitter.com/gbuszmicz) or [create an issue](https://github.com/gbuszmicz/yasdapp/issues/new)
