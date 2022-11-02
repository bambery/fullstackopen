describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            username: 'testUser',
            name: 'Test User',
            password: 'salainen'
        }

        cy.request('POST', 'http://localhost:3003/api/users', user)
        cy.visit('http://localhost:3000')
    })

    it('displays the login page for a logged out user', function () {
        cy.contains('log in to application')
        cy.get('[data-cy="login-username"]')
        cy.get('[data-cy="login-password"]')
        cy.contains('button', 'login')
    })

    describe('Login', function() {
        it('succeeds with valid credentials', function () {
            cy.get('[data-cy="login-username"]').type('testUser')
            cy.get('[data-cy="login-password"]').type('salainen')
            cy.contains('button', 'login').click()

            cy.contains('testUser logged in!').should('have.class', 'alert').should('have.css', 'color', 'rgb(0, 128, 0)')
        })

        it('fails with invalid credentials', function () {
            cy.get('[data-cy="login-username"]').type('testUser')
            cy.get('[data-cy="login-password"]').type('wrong')
            cy.contains('button', 'login').click()

            cy.contains('Username or password is incorrect').should('have.class', 'error').should('have.css', 'color', 'rgb(255, 0, 0)')
        })
    })

    describe('when logged in', function() {
        beforeEach(function() {
            cy.login({ username: 'testUser', password: 'salainen' })
        })

        it.only('A new blog can be created', function() {
            cy.contains('button', 'new blog').click()
            cy.contains('label', 'title:').find('input').type('a brand new blog')
            cy.contains('label', 'author:').find('input').type('a test author')
            cy.contains('label', 'url:').find('input').type('http://test.com')
            cy.contains('button', 'create').click()
            cy.get('.blog-list').should('include.text', 'a brand new blog').find('div', '.blog-item')
        })
    })
})
