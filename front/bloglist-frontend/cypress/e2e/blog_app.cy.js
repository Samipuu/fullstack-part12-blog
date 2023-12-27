describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'root',
      username: 'root',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function () {
    cy.contains('Login')
    cy.contains('Username')
    cy.contains('Password')

  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('root')
      cy.get('#password').type('salainen')
      cy.get('#loginButton').click()
      cy.contains('Logged in as root')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('root')
      cy.get('#password').type('asd')
      cy.get('#loginButton').click()
      cy.contains('error Login failed')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.get('#username').type('root')
      cy.get('#password').type('salainen')
      cy.get('#loginButton').click()
    })

    it('A blog can be created', function () {
      cy.createBlog()
      cy.contains('This is a title')
      cy.contains('Author of the Blog')
    })

    it('A blog can be liked', function () {
      cy.createBlog()
      cy.contains('View').click()
      cy.contains('Like').click()
    })

    it('A blog created by user can be removed', function () {
      cy.createBlog()
      cy.contains('View').click()
      cy.contains('Remove').click()
      cy.get('html').should('not.contain', 'Author of the Blog')
    })

    it('Another user can not see remobe blog button', function () {
      cy.createBlog()
      cy.contains('Logout').click()

      const user = {
        name: 'user',
        username: 'user',
        password: 'salainen'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)
      cy.login({ username: 'user', password: 'salainen' })
      cy.contains('View').click()
      cy.contains('Remove').should('have.css', 'display', 'none')
    })

    it('Blogs are in order by like count', function () {
      cy.createBlog({ title: 'Least liked', author: 'Test', url: 'test' })
      cy.createBlog({ title: 'Second most liked', author: 'Test', url: 'test' })
      cy.createBlog({ title: 'Most liked', author: 'Test', url: 'test' })

      cy.contains('Second most liked').contains('View').click().parent().contains('Like').click()
      cy.get('.blog').eq(0).should('contain', 'Second most liked')
      cy.contains('Most liked').contains('View').click().parent().contains('Like').click().click()

      cy.get('.blog').eq(0).should('contain', 'Most liked')
      cy.get('.blog').eq(1).should('contain', 'Second most liked')
      cy.get('.blog').eq(2).should('contain', 'Least liked')
    })
  })
})