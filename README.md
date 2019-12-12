# Alastria Identity Service Provider
This is an example of _Service Provider_ in Alastria. You can try the demo online accessing http://52.16.248.226/.


This repository contains two main dockers, **spBackend** and **spFrontend**.

This is an example of a Service Provider with Alastria.

## Components
### spBackend
Backend that interacts with the [Alastria Identity Lib](https://github.com/alastria/alastria-identity-lib). This library interacts with the Smart Contracts from [Alastria](https://github.com/alastria/alastria-identity).
### spFrontend
Frontend of the Service Provider. 

## How to run the Service Provider
### Requirements
You need to install [`npm`](https://www.npmjs.com/get-npm), [`docker`](https://docs.docker.com/v17.09/engine/installation/) and [`docker-compose`](https://docs.docker.com/compose/install/).
### Install spFrontend
First of all, you need to install some packages for the Frontend to work. In order to do that, move to the frontend directory `cd spFrontend`, then:
```sh
npm install
```
After that, build and compile the project:
```sh
npm run build
```
## Run the Service Provider
Before running the Service Provider, you can change the blockchain node IP in the file [docker-compose.yaml](https://github.com/alastria/alastria-identity-serviceProvider/blob/develop/docker-compose.yaml). At the moment, you can choose one of this (**only one**):
```yaml
- NODE_ENDPOINT=localEndpoint
#- NODE_ENDPOINT=alastria
```
In the example above, a ganache will run locally, so you will need to deploy the _smart contracts_ manually.

Finally, just **run the dockers**. For this step, you need to stay **in the root directory**:
```sh
docker-compose up -d
```
