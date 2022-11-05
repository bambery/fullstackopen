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
            cy.newBlog({ title: 'Already exists', author: 'An Existing Author', url: 'http://old.com' })
        })

        it('A new blog can be created', function() {
            cy.contains('button', 'new blog').click()
            cy.contains('label', 'title:').find('input').type('A brand new blog')
            cy.contains('label', 'author:').find('input').type('A test author')
            cy.contains('label', 'url:').find('input').type('http://test.com')
            cy.contains('button', 'create').click()
            cy.get('.blog-list').should('include.text', 'a brand new blog').find('div', '.blog-item')
        })

        it('lets a user like a blog', function() {
            cy.contains('Already exists').contains('show').click()
            cy.get('[data-cy="blog-likes"]').then(($div) => {
                const regex = /likes:\s(\d)\slike/
                const likes = parseInt($div.text().match(regex)[1])
                cy.get('[data-cy="blog-like-btn"]')
                  .click()
                  .then(() => {
                      cy.get('[data-cy="blog-likes"]').should(($foo) => {
                          expect(parseInt($foo.text().match(regex)[1])).to.eq(likes + 1)
                      })
                  })
            })
        })

        it('lets the user who created a blog delete it', function() {
            cy.contains('Already exists').then(($div) => {
                cy.wrap($div).contains('button', 'show').click()
                cy.wrap($div).contains('button', 'remove').click()
                cy.get('.notification').should('have.text','Blog post titled \'Already exists\' has been deleted.')
            })
        })

        it('does not allow a user to delete a blog post they did not create', function() {
            cy.contains('button', 'logout').click()

            const user = {
                username: 'cantDelete',
                name: 'Can\'t Delete',
                password: 'salainen'
            }
            cy.request('POST', 'http://localhost:3003/api/users', user)
            cy.visit('http://localhost:3000')

            cy.get('[data-cy="login-username"]').type('cantDelete')
            cy.get('[data-cy="login-password"]').type('salainen')
            cy.contains('button', 'login').click()

            cy.contains('Already exists')
              .contains('button', 'show')
              .click()
              .should('not.contain', 'remove')
        })

        it('displays blogs in order of number of likes', function() {


            cy.newBlog({ title: 'Some likes', author: 'A newly published author', url: 'http://alright.com', likes: 2 })
            cy.newBlog({ title: 'Second-highest likes', author: 'A well regarded author', url: 'http://secondbest.com', likes: 9 })
            cy.newBlog({ title: 'Most likes', author: 'A well liked author', url: 'http://best.com', likes: 10 })

            cy.get('.blog-item').eq(0).should('contain', 'Most likes')
            cy.get('.blog-item').eq(1).should('contain', 'Second-highest likes')
            cy.get('.blog-item').eq(2).should('contain', 'Some likes')
            cy.get('.blog-item').eq(3).should('contain', 'Already exists')

            cy.intercept('PUT', '/api/blogs/*').as('updateBlog')
            cy.contains('Second-highest likes').contains('button', 'show').click()

            cy.contains('Second-highest likes').contains('button', 'like').click()
            cy.wait(['@updateBlog'], {responseTimeout: 5000 })

            cy.contains('Second-highest likes').contains('button', 'like').click()
            cy.wait(['@updateBlog'], {responseTimeout: 5000 })

            cy.get('.blog-item').eq(0).should('contain', 'Second-highest likes')
            cy.get('.blog-item').eq(1).should('contain', 'Most likes')
        })
    })
})
