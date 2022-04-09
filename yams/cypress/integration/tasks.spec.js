const uniqueTitle = title => `${title}-${Date.now()}`

describe('Tasks', function () {
  beforeEach(function () {
    cy.visit('/')
  })

  it('displays the board', function () {
    cy.get('h2').contains('Backlog')
    cy.get('h2').contains('In Progress')
    cy.get('h2').contains('PR Review')
    cy.get('h2').contains('Testing')
    cy.get('h2').contains('Done')
  })

  it('creates a task', function () {
    const title = uniqueTitle('New Task')

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

  it('updates and moves a task', function () {
    // Create task
    const title = uniqueTitle('New Task')
    cy.contains('Add Task').click()
    cy.get('input[name="title"]').type(title)
    cy.get('textarea[name="description"]').type('Do the thing.')
    cy.contains('Save').click()
    cy.contains('Created task!')

    // Update task
    const newTitle = uniqueTitle('Updated Task')
    cy.contains(title).click()
    cy.get('input[name="title"]')
      .clear()
      .type(newTitle)
    cy.get('#mui-component-select-status').click()
    cy.contains('PR Review').click()
    cy.contains('Save').click()
    cy.contains('Updated task!')
    cy.get('#column-pr_review').contains(newTitle)
    cy.contains(title).should('not.exist')
  })
})
