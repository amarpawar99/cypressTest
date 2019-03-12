context('Forgot Password', () => {

    let loginPageError = "//li[contains(@class,'flash_notice')]"
    let forgotPasswordLink = "//a[contains(@href,'forgot_password')]"
    let header = "//h3[contains(text(),'Forgot your password?')]"
    let errorExplanationH = "//div[@id='error_explanation']/h2"
    let errorExplanationLi = "//div[@id='error_explanation']//li"
    let emailInput = "//input[@id='user_email']"
    let resetButton = "//li[@id='user_submit_action']//input"
    let forgotPasswordError = "//p[@class='inline-errors']"
    let signInLink = "//a[contains(@href,'login')]"
    let unlockLink = "//a[contains(@href,'unlock')]"

    beforeEach(() => {
        cy.visit('https://s.myclinic.miraihealth.com')
        cy.xpath(forgotPasswordLink).click()
        cy.get('h3').should('be.visible')
        cy.xpath(header).should(($div) => {
            const msg = $div.text()
            expect(msg).to.include('Forgot your password?')
        })
    })

    it('Check Forgot Password page elements', () => {
        cy.xpath(emailInput).should('not.be.disabled')
        cy.xpath(resetButton).should('not.be.disabled')
        cy.xpath(signInLink).should('not.be.hidden')
        cy.xpath(unlockLink).should('not.be.hidden')
    })

    it('Check Sign In link on Forgot Password page', () => {
        cy.xpath(signInLink).click()
        cy.get('h3').should(($div) => {
            const msg = $div.text()
            expect(msg).to.include('Welcome to MyClinic')
        })
        cy.xpath(resetButton).within(($form) => {
            cy.wrap($form).should('have.attr', 'value', 'Login')
        })
    })

    it('Check Resend unlock instructions link on Forgot Password page', () => {
        cy.xpath(unlockLink).click()
        cy.get('h3').should(($div) => {
            const msg = $div.text()
            expect(msg).to.include('Welcome to MyClinic')
        })
        cy.xpath(resetButton).within(($form) => {
            cy.wrap($form).should('have.attr', 'value', 'Resend unlock instructions')
        })
    })

    it('Check Reset password for blank username', () => {
        // cy.xpath(emailInput).type(' ')
        cy.xpath(resetButton).click()

        cy.xpath(errorExplanationH).should(($div) => {
            const msg = $div.text()
            expect(msg).to.include('1 error prohibited this user from being saved:')
        })
        cy.xpath(errorExplanationLi).should(($div) => {
            const msg = $div.text()
            expect(msg).to.include('Email can\'t be blank')
        })
        cy.xpath(forgotPasswordError).should(($div) => {
            const msg = $div.text()
            expect(msg).to.include('can\'t be blank')
        })
    })

    it('Check Reset password for invalid username', () => {
        cy.xpath(emailInput).type('foo@bar.com')
        cy.xpath(resetButton).click()

        cy.xpath(errorExplanationH).should(($div) => {
            const msg = $div.text()
            expect(msg).to.include('1 error prohibited this user from being saved:')
        })
        cy.xpath(errorExplanationLi).should(($div) => {
            const msg = $div.text()
            expect(msg).to.include('Email not found')
        })
        cy.xpath(forgotPasswordError).should(($div) => {
            const msg = $div.text()
            expect(msg).to.include('not found')
        })
    })

    it('Check Reset password for valid username', () => {
        cy.xpath(emailInput).type('drnayan@miraihealth.com')
        cy.xpath(resetButton).click()

        cy.get('h3').should(($div) => {
            const msg = $div.text()
            expect(msg).to.include('Welcome to MyClinic')
        })
        cy.xpath(loginPageError).should(($div) => {
            const msg = $div.text()
            expect(msg).to.include('You will receive an email with instructions on how to reset your password in a few minutes.')
        })
    })
})