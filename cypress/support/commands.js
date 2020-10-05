// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('dataCy', function(selector) {
  cy.get(`[data-cy="${selector}"]`)
})

Cypress.Commands.add('$router', function(path) {
  cy.window().then(window => {
    window.app.$router.push(path)
  })
})

Cypress.Commands.add('login', function() {
  cy.visit('/')
  cy.window().then(window => {
    cy.wrap(window.store).as('store') // alias the store (can be accessed like this.store)
    window.store.commit('user/SET', {
      coverPhoto: "https://scontent-nrt1-1.xx.fbcdn.net/v/t1.30497-1/c59.0.200.200a/p200x200/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&_nc_sid=12b3be&_nc_ohc=XSyibPGhs4AAX8qAF9u&_nc_ht=scontent-nrt1-1.xx&_nc_tp=27&oh=91bcc5e205b8999122083e4b7efe57ca&oe=5F9FE839",
      email: "et3216@gmail.com",
      user: {},
      userId: "3189364354449003",
      username: "dddddddd"
    }, { root: true })
  })
})
