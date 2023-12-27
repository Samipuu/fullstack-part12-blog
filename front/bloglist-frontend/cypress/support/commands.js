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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', ({ username, password }) => {
    cy.request('POST', 'http://localhost:3003/api/login', {
        username, password
    }).then(({ body }) => {
        localStorage.setItem('loggedUser', JSON.stringify(body))
        cy.visit('http://localhost:5173')
    })
})

Cypress.Commands.add('createBlog', (blog) => {
    cy.contains('Add blog').click()

    if (!blog) {
        cy.get('#title').type('This is a title')
        cy.get('#author').type('Author of the Blog')
        cy.get('#url').type('www.url.com')
    } else {
        cy.get('#title').type(blog.title)
        cy.get('#author').type(blog.author)
        cy.get('#url').type(blog.url)
    }

    cy.get('#createButton').click()
})