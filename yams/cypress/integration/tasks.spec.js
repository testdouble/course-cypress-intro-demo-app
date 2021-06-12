describe('Tasks', function () {
  it('displays the board', function () {
    cy.visit('http://localhost:3000')
    cy.get('h2').contains('Backlog')
    cy.get('h2').contains('In Progress')
    cy.get('h2').contains('PR Review')
    cy.get('h2').contains('Testing')
    cy.get('h2').contains('Done')
  })

  it('creates a task', function () {
    cy.visit('http://localhost:3000')

    const title = `New Task-${Date.now()}`

    cy.contains('Add Task').click()

    cy.get('input[name="title"]').type(title)

    cy.get('#mui-component-select-status').click()
    cy.contains('In Progress').click()

    cy.get('textarea[name="description"]').type('Do the thing.')

    cy.get('#mui-component-select-estimate').click()
    cy.contains('3').click()

    cy.contains('Save').click()

    cy.contains('Created task!')
    cy.get('#column-in_progress').contains(title)
  })
})
