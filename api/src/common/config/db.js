'use strict';
/**
 * db config
 * @type {Object}
 */
export default {
  type: 'mysql',
  log_sql: true,
  log_connect: true,
  adapter: {
    mysql: {
      host: '192.168.10.10',
      port: '',
      database: 'mockon', //数据库名称
      user: 'homestead', //数据库帐号
      password: 'secret', //数据库密码
      prefix: 't_',
      encoding: 'utf8mb4'
    }
  }
}
