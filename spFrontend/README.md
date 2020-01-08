# SpFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.2.

## Starting 🚀

These instructions will allow you to get a copy of the project running on your local machine for development and testing purposes:

Clone the proyect:
```
git clone https://github.com/alastria/alastria-identity-entity.git
```

### ng build and ng serve with environments

For build or serve aplication with differents environments your insert this commands:
```
ng build --configuration={configurationName}
```
or
```
ng serve --configuration={configurationName}
```

### Installation and Deployment 🔧

The first step open a terminal inside the proyect and go to spFrontend folder
```
cd spFrontend
```

Then you have to install all the dependencies
```
npm install
```

Finally you can init the application
```
npm run start
```

### Installation and Deployment with Docker 🔧

The first step open a terminal inside the proyect and go to spFrontend folder
```
cd spFrontend
```

Then you have to build the project
```
npm run build
```

Create image of docker
```
docker build -t spFrontend .
```

After go to the previous folder
```
cd ..
```

Finally you can init the docker container
```
docker-compose up -d spFrontend
```
