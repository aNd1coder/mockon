'use strict';
/**
 * config
 */
export default {
  cors: {
    origin: "*",                         // Access-Control-Allow-Origin
    methods: "GET,POST,PUT,DELETE",      // Access-Control-Allow-Methods
    //credentials: false,                   // Access-Control-Allow-Credentials
    allowedHeaders: "X-ACCESS-TOKEN",     // Access-Control-Allow-Headers
    exposedHeaders: "X-ACCESS-TOKEN",     // Access-Control-Expose-Headers
    //maxAge: 1000,                        // Access-Control-Max-Age  for the OPTIONS request
    preflightContinue: false              // for the OPTIONS request
  },
}
