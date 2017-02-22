'use strict'

export default class extends think.controller.base {
  indexAction() {
    const schema = `
    type Query {
      hello: String
    }
    
    schema {
      query: Query
    }
    `

    const resolvers = {
      Query: {
        hello(root, args, context) {
          return 'Hello world!'
        }
      }
    }
  }
}
