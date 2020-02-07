# Entity Backend

This project was generated with **[Swagger Node](https://github.com/swagger-api/swagger-node)** version 0.7.5.

## Starting 🚀

These instructions will allow you to get a copy of the project running on your local machine for development and testing purposes:

Clone the proyect:

```sh
git clone https://github.com/alastria/alastria-identity-entity.git
```

### swagger project start & swagger project edit

To start the backend application insert this commands:

```sh
swagger project start
```

To edit the swagger file you can use this command. It will initialize a web editor for swagger where you can *edit* and *test* the API. If you put the flag **-m**, you start the swagger editor in *mock mode*.

```sh
swagger project edit
```

### Installation and Deployment for develop 🔧

The first step is to open a terminal inside the project and go to entity backend folder

```sh
cd entityBackend
```

Then you have to install all the dependencies

```sh
npm install
```

Finally you can init the application

```sh
swagger project start
```

### Installation and Deployment with Docker 🔧

The unique step you have to do is go to the root folder and execute this command. This command will run a container of [MongoDB](https://docs.mongodb.com/manual/tutorial/) and an other container of [mongo-express](https://github.com/mongo-express/mongo-express#readme) (web page to manage the mongo database)

```sh
docker-compose up -d entitybackend
```
