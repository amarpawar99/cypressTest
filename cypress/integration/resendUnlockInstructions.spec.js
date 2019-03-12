context('Resend Unlock Instructions', () => {

    let unlockLink = "//a[contains(@href,'unlock')]"
    let header = "//h3[contains(text(),'Welcome to MyClinic')]"
    let emailInput = "//input[@id='user_email']"
    let resendButton = "//li[@id='user_submit_action']//input"
    let resendUnlockInstructionsError = "//p[@class='inline-errors']"
    let signInLink = "//a[contains(@href,'login')]"
    let forgotPasswordLink = "//a[contains(@href,'forgot_password')]"

    beforeEach(() => {
        cy.visit('https://s.myclinic.miraihealth.com')
        cy.xpath(unlockLink).click({ force: true })
        cy.get('h3').should('be.visible')
        cy.xpath(header).should(($div) => {
            const msg = $div.text()
            expect(msg).to.include('Welcome to MyClinic')
        })
    })

    it('Check Resend Unlock Instructions page elements', () => {
        cy.xpath(emailInput).should('not.be.disabled')
        cy.xpath(resendButton).should('not.be.disabled')
        cy.xpath(signInLink).should('not.be.hidden')
        cy.xpath(forgotPasswordLink).should('not.be.hidden')
    })

    it('Check Sign In link on Resend Unlock Instructions page', () => {
        cy.xpath(signInLink).click()
        cy.get('h3').should(($div) => {
            const msg = $div.text()
            expect(msg).to.include('Welcome to MyClinic')
        })
        cy.xpath(resendButton).within(($form) => {
            cy.wrap($form).should('have.attr', 'value', 'Login')
        })
    })

    it('Check Forgot Password link on Resend Unlock Instructions page', () => {
        cy.xpath(forgotPasswordLink).click()
        cy.get('h3').should(($div) => {
            const msg = $div.text()
            expect(msg).to.include('Forgot your password?')
        })
        cy.xpath(resendButton).within(($form) => {
            cy.wrap($form).should('have.attr', 'value', 'Reset My Password')
        })
    })

    it('Check Resend Unlock Instructions for blank username', () => {
        // cy.xpath(emailInput).type(' ')
        cy.xpath(resendButton).click()

        cy.xpath(resendUnlockInstructionsError).should(($div) => {
            const msg = $div.text()
            expect(msg).to.include('can\'t be blank')
        })
    })

    it('Check Resend Unlock Instructions for invalid username', () => {
        cy.xpath(emailInput).type('foo@bar.com')
        cy.xpath(resendButton).click()

        cy.xpath(resendUnlockInstructionsError).should(($div) => {
            const msg = $div.text()
            expect(msg).to.include('not found')
        })
    })

    it('Check Resend Unlock Instructions for valid username', () => {
        cy.xpath(emailInput).type('drnayan@miraihealth.com')
        cy.xpath(resendButton).click()

        cy.xpath(resendUnlockInstructionsError).should(($div) => {
            const msg = $div.text()
            expect(msg).to.include('was not locked')
        })
    })
})