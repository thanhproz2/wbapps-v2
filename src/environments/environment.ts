// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  enableReCaptcha: false,
  enableChat: false,
  // baseApiChat: (window.location.protocol + '//' + window.location.host + '/chat'),
  // baseApiUrl: (window.location.protocol + '//' + window.location.host + '/api'),
  // groupChatThreadsUrl: (window.location.protocol + '//' + window.location.host + '/group-chat-threads')
  // baseApiStudioChat: (window.location.protocol + '//' + window.location.host + '/studio-chat')
  // baseApiUrl: 'http://localhost:8089/api',
  // baseApiChat: 'http://localhost:8090/chat',
  groupChatThreadsUrl: 'http://localhost:8090/group-chat-threads',
  baseApiStudioChat: 'http://localhost:8090/studio-chat',
  // baseApiUrl: "http://blackboxstaging.imt-soft.com/api",
  // baseApiChat: "http://blackboxstaging.imt-soft.com:8090/chat",
  baseApiUrl: "http://54.90.75.231/api",
  baseApiChat: "http://54.90.75.231/chat"
  // baseApiUrl: "http://portal3.blackbox.global/api",
  // baseApiChat: "http://portal.blackbox.global/chat"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
