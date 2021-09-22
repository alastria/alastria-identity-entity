// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:10010/v1',
  // websocketUrl: 'ws://localhost:8080', // deployed runing npm run start
  websocketUrl: 'ws://localhost:10011', // deployed with docker
  entityName: '[Entity]',
  callbackUrl: 'http://localhost:10010/v1',
  authToken: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBbGFzdHJpYSIsImlhdCI6MTYzMjMyNjIxMSwiZXhwIjoxNjYzODYyMjAxLCJhdWQiOiJ3d3cuZXhhbXBsZS5jb20iLCJzdWIiOiJqcm9ja2V0QGV4YW1wbGUuY29tIn0.K6NWppQSBXfn4mub9za62qACfHRyRMYdz5o-KFBj_fM"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
