// / <reference types="cypress" />
const isMac = Cypress.platform === 'darwin';
const modifierKey = isMac ? '{meta}' : '{ctrl}';

describe('Project', () => {
  before(() => {
    cy.goDashboard()
  })

  it('containers lock in parent container', function() {

  })
})
