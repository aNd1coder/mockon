const production = process.env.NODE_ENV === 'production'

export const DOMAIN = production ? 'http://api.mockon.time33.com' : 'http://127.0.0.1:8360'
export const API_ROOT = DOMAIN + '/v1.0'
export const UPLOAD_URL = DOMAIN + '/upload'
export const GRAPHQL_URI = 'http://127.0.0.1:3020/graphql'; //DOMAIN + '/graphql'
export const STATIC_URL = DOMAIN + '/static'
export const COOKIE_DOMAIN = production ? '.time33.com' : 'localhost'
export const COOKIE_EXPIRES = '1M'
export const HTTP_METHOD = ['GET', 'POST', 'PUT', 'DELETE'] // ,'copy',  'patch', 'head', 'options', 'link', 'unlink', 'purge'
export const RESPONSE_TYPE = ['success', 'error']
export const PARAM_LOCATION = {
  formData: 'Form Data',
  header: 'Request Header'
}
export const HTTP_HEADERS = [
  'Accept',
  'Accept-Charset',
  'Accept-Encoding',
  'Accept-Language',
  'Accept-Ranges',
  'Access-Control-Allow-Credentials',
  'Access-Control-Allow-Headers',
  'Access-Control-Allow-Methods',
  'Access-Control-Allow-Origin',
  'Access-Control-Expose-Headers',
  'Access-Control-Max-Age',
  'Access-Control-Request-Headers',
  'Access-Control-Request-Method',
  'Age',
  'Cache-Control',
  'Connection',
  'Content-Disposition',
  'Content-Encoding',
  'Content-Language',
  'Content-Length',
  'Content-Location',
  'Content-Range',
  'Content-Security-Policy',
  'Content-Security-Policy-Report-Only',
  'Content-Type',
  'Cookie',
  'DNT',
  'Date',
  'ETag',
  'Expires',
  'Forwarded',
  'From',
  'Host',
  'If-Match',
  'If-Modified-Since',
  'If-None-Match',
  'If-Range',
  'If-Unmodified-Since',
  'Keep-Alive',
  'Last-Modified',
  'Location',
  'Origin',
  'Public-Key-Pins',
  'Public-Key-Pins-Report-Only',
  'Range',
  'Referer',
  'Referrer-Policy',
  'Retry-After',
  'Server',
  'Set-Cookie',
  'Strict-Transport-Security',
  'TE',
  'Tk',
  'Trailer',
  'Transfer-Encoding',
  'Upgrade-Insecure-Requests',
  'User-Agent',
  'Vary',
  'Via',
  'Warning',
  'X-Content-Type-Options',
  'X-DNS-Prefetch-Control',
  'X-Frame-Options',
  'X-XSS-Protection',
]
export const FORM_ENCTYPE = [
  'application/json',
  'application/x-www-form-urlencoded',
  'multipart/form-data'
]
export const DATA_SOURCE = ['mysql', 'mongodb'] // 'postgresql', 'sqlserver', 'oracle', 'access', 'sqlite'
export const PARAM_TYPE = ['string', 'int', 'bool', 'array', 'object', 'file']
