# Alastria Identity Service Provider
This repository contains two main dockers, **spBackend** and **spFrontend**.

This is an example of a Service Provider with Alastria.

## Components
### spBackend
Backend that interacts with the [Alastria Identity Lib](https://github.com/alastria/alastria-identity-lib). This library interacts with the Smart Contracts from [Alastria](https://github.com/alastria/alastria-identity).
### spFrontend
Frontend of the Service Provider. 

## How to run the Service Provider
### Requirements
You need to install [`npm`](https://www.npmjs.com/get-npm), [`docker-compose`](https://docs.docker.com/compose/install/) and [`ganache-cli`](https://github.com/trufflesuite/ganache-cli).
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
Before running the Service Provider, if you want to run it locally, you need to start the `ganache-cli`:
```sh
ganache-cli
```
Once `ganache` is up, just run the dockers:
```sh
docker-compose up
```
