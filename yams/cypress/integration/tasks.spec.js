describe('Tasks', function () {
  it('displays the board', function () {
    cy.visit('http://localhost:3000')
    cy.get('h2').contains('Backlog')
    cy.get('h2').contains('In Progress')
    cy.get('h2').contains('PR Review')
    cy.get('h2').contains('Testing')
    cy.get('h2').contains('Done')
  })
})
