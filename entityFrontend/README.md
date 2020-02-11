# Entity Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.2.

## Starting 🚀

These instructions will allow you to get a copy of the project running on your local machine for development and testing purposes:

Clone the proyect:

```sh
git clone https://github.com/alastria/alastria-identity-entity.git
```

### ng build and ng serve with environments

For build or serve aplication with differents environments your insert this commands:

```sh
ng build --configuration={configurationName}
```

or

```sh
ng serve --configuration={configurationName}
```

### Installation and Deployment 🔧

The first step open a terminal inside the proyect and go to entity folder

```sh
cd entityFrontend

```

Then you have to install all the dependencies

```sh
npm install
```

Finally you can init the application

```sh
npm run start
```

### Installation and Deployment with Docker 🔧

The first step open a terminal inside the proyect and go to entityFrontend folder

```sh
cd entityFrontend
```

Then you have to build the project

```sh
npm run build
```

Create image of docker

```sh
docker build -t entityfrontend .
```

After go to the previous folder

```sh
cd ..
```

Finally you can init the docker container

```sh
docker-compose up -d entityFrontend
```
