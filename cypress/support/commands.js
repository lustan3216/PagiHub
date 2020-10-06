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
    cy.fixture('user.json').then(user => {
      window.store.commit('user/SET', user, { root: true })
    })
  })
})

Cypress.Commands.add('goDashboard', function(path) {
  cy.login()
  // cy.window().then(window => {
  //   cy.fixture('node.json').then(node => {
  //     window.store.commit('node/SET', node, { root: true })
  //   })
  // })

  cy.$router('workboard/01EK6GFYWVTM04JCF76N2KGPFB')
})

