describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        cy.visit('http://localhost:3000')
    })

    it('displays the login page for a logged out user', function () {
        cy.contains('log in to application')
        cy.get('[data-cy="login-username"]')
        cy.get('[data-cy="login-password"]')
        cy.contains('button', 'login')
    })
})
