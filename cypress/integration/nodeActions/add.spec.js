// / <reference types="cypress" />

describe('Project', () => {
  before(() => {
    cy.login()
    cy.$router('/dashboard/projects')
  })

  it('Create', function() {
    cy.dataCy('project-create').click()
    cy.dataCy('project-name-input').type('testtest')
    cy.dataCy('project-description-input').type('testtest')
    cy.dataCy('dialog-confirm').click()
  })

  describe('add component set', () => {
    it('layersRoot')
  })

  describe('add each example', () => {
    it('layersRoot')
  })
})
