# Alastria Identity Entity

This is an example of _Entity_ in Alastria. You can try the demo online accessing to [Entity Frontend](http://34.244.47.233/login).

This repository contains two main dockers, **entityBackend** and **entityFrontend**.

This is an example of a Entity with Alastria.

## Components

### entityBackend

Backend that interacts with the [Alastria Identity Lib](https://github.com/alastria/alastria-identity-lib). This library interacts with the Smart Contracts from [Alastria](https://github.com/alastria/alastria-identity).

### entityFrontend

Frontend of the Entity.

### Mongo Database

Data Base of the entity.

### Mongo-Express

A tool to monitorize the mongo database.

#### Notes

If you want to develop, first of all you need to have the database started, to do this you have to run this command in the directory of alastria-identity-entity.

```sh
docker-compose up -d mongo-express
```

## How to run the Entity

### Requirements

You need to install [`npm`](https://www.npmjs.com/get-npm), [`docker`](https://docs.docker.com/v17.09/engine/installation/) and [`docker-compose`](https://docs.docker.com/compose/install/).

### Replacements

In the file `node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js`

replace in the last line `node: false`

with `node: { crypto: true, stream: true, buffer: true }`

### Install entityFrontend

First of all, you need to install some packages for the Frontend to work. In order to do that, move to the frontend directory `cd entityFrontend`, then:

```sh
npm install
```

After that, build and compile the project:

```sh
npm run build --configuration=docker
```

## Run the Entity

Before running the Entity, you can change the blockchain node IP in the file [docker-compose.yaml](/docker-compose.yaml). At the moment, you can choose one of this (**only one**):

```yaml
- NODE_ENDPOINT=alastria
#- NODE_ENDPOINT=localEndpoint
```

In the example above, a ganache will run locally, so you will need to deploy the _smart contracts_ manually.

Finally, just **run the dockers**. For this step, you need to stay **in the root directory**:

```sh
docker-compose up -d
```
