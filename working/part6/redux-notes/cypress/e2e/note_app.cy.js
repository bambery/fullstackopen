describe('Note app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: 'Matti Luukkainen',
            username: 'mluukkai',
            password: 'salainen'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.visit('http://localhost:3000')
    })

    it('front page can be opened', function() {
        cy.contains('Notes')
        cy.contains('Note app, Department of Computer Science, University of Helsinki 2022')
    })

    it('user can log in', function() {
        cy.contains('button', 'login').click()
        cy.get('[data-cy="username"]').type('mluukkai')
        cy.get('[data-cy="password"]').type('salainen')
        cy.get('[data-cy="submit-login"]').click()

        cy.contains('Matti Luukkainen logged in')
    })

    it('login fails with wrong password', function() {
        cy.contains('button', 'login').click()
        cy.get('[data-cy="username"]').type('mluukkai')
        cy.get('[data-cy="password"]').type('wrong')
        cy.get('[data-cy="submit-login"]').click()
        cy.get('.error').contains('Username or password is incorrect')

        cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })

    describe('when logged in', function() {
        beforeEach(function() {
            cy.login({ username: 'mluukkai', password: 'salainen' })
        })

        it('a new note can be created', function() {
            cy.contains('button', 'new note').click()
            cy.get('[data-cy="new-note-text"]').type('a note created by cypress')
            cy.get('[data-cy="submit-note"]').click()
            cy.contains('a note created by cypress')
        })

        describe('and several notes exist', function () {
            beforeEach(function () {
                cy.createNote({ content: 'first note', important: false })
                cy.createNote({ content: 'second note', important: false })
                cy.createNote({ content: 'third note', important: false })
            })

            it('can be made important', function () {
                cy.contains('second note')
                    .parent()
                    .find('button', 'make important')
                    .click()

                cy.contains('second note')
                    .parent()
                    .find('button')
                    .should('contain', 'make not important')
            })
        })
    })
})
