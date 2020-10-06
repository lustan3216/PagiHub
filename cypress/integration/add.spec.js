// / <reference types="cypress" />
const isMac = Cypress.platform === 'darwin';
const modifierKey = isMac ? '{meta}' : '{ctrl}';

describe('Project', () => {
  before(() => {
    cy.goDashboard()
  })

  it('Create', function() {
    cy.dataCy('component-set-create').click()
    cy.dataCy('component-set-name-input').type('testtest')
    cy.dataCy('component-set-desc-input').type('testtest')
    cy.dataCy('dialog-confirm').click()

    cy.get('[data-cy^="grid-item"]').should('have.length', 4)
  })

  it('copy', function() {
    cy.dataCy('grid-item-2').click()
    cy.dataCy('grid-item-3').click({
      ctrlKey: true,
      metaKey: true
    })
    cy.get('body').type(modifierKey + 'C').type(modifierKey + 'V')
    cy.get('[data-cy^="grid-item"]').should('have.length', 6)
  })

  it('delete', function() {
    cy.dataCy('grid-item-2').click('right')

    cy.dataCy('grid-item-0').click('left', {
      metaKey: true,
      ctrlKey: true
    })
    cy.dataCy('grid-item-1').click('right', {
      metaKey: true,
      ctrlKey: true
    })

    cy.get('body').type('{backspace}')
    cy.get('[data-cy^="grid-item"]').should('have.length', 2)
  })

  it('copy', function() {
    cy.dataCy('grid-item-0').click('right')
    cy.dataCy('grid-item-1').click({
      ctrlKey: true,
      metaKey: true
    })
    cy.get('body').type(modifierKey + 'C').type(modifierKey + 'V')
    cy.get('[data-cy^="grid-item"]').should('have.length', 4)
  })

  it('add layout', function() {
    cy.dataCy('grid-item-1').click()
    cy.dataCy('add-panel-button').click({ force: true })
    cy.dataCy('add-component-button').first().click()

  })
})
