context('Login', () => {

    let header = "//h3[contains(text(),'Welcome to MyClinic')]"
    let emailInput = "//input[@id='user_email']"
    let passwordInput = "//input[@id='user_password']"
    let cookieHelpText = "//label[@class='cookie-help-text']"
    let privacyPolicyLink = "//label[@class='cookie-help-text']//a[@class='display-terms-conditions-checkobx']"
    let cookieCheckbox = "//input[@id='user_accepted_cookies_at']"
    let termsConditionsCheckbox = "//input[@id='user_accepted_terms_and_conditions_at']"
    let termsConditionsLink = "//label[@for='user_accepted_terms_and_conditions_at']//a[@class='display-terms-conditions-checkobx']"
    let loginButton = "//li[@id='user_submit_action']//input"

    let forgotPasswordLink = "//a[contains(@href,'forgot_password')]"
    let unlockLink = "//a[contains(@href,'unlock')]"

    let emailTo = "//span[@itemprop='email']"
    let phoneNumberIndia = "//h3[@class='number'][1]"
    let phoneNUmberUK = "//h3[@class='number'][2]"

    let copyRightLink = "//a[contains(@href,'avegenhealth')]"
    let termConditionsFooterLink = "//footer//a[contains(@href,'terms_and_conditions')]"
    let privacyPolicyFooterLink = "//footer//a[contains(@href,'privacy_policy')]"

    let avegenPage = "//div[@id='myCarousel']"
    let loginPageError = "//li[contains(@class,'flash_alert')]"

    beforeEach(() => {
        cy.visit('https://s.myclinic.miraihealth.com')
        cy.get('h3').should('be.visible')
        cy.xpath(loginPageError).should(($div) => {
            const msg = $div.text()
            expect(msg).to.include('You need to sign in or sign up before continuing.')
        })
        cy.server().should((server) => {
            expect(server.status).to.eq(200)
        })
    })

    it('Check login page elements', () => {
        cy.xpath(loginButton).should('not.be.enabled')
        cy.xpath(cookieCheckbox).should('not.be.checked')
        cy.xpath(termsConditionsCheckbox).should('not.be.checked')

        cy.xpath(emailInput).type('foo@bar.com')
        cy.xpath(passwordInput).type('password')

        cy.xpath(cookieCheckbox).check()
        cy.xpath(termsConditionsCheckbox).check()
        cy.xpath(loginButton).should('not.be.disabled')

        cy.xpath(forgotPasswordLink).within(($form) => {
            cy.wrap($form).should('have.attr', 'href', '/forgot_password?locale=en')
        })
        cy.xpath(unlockLink).within(($form) => {
            cy.wrap($form).should('have.attr', 'href', '/admin/unlock/new?locale=en')
        })

        cy.xpath("string(//span[@itemprop='email'])").should('contain', 'myclinic@miraihealth.atlassian.net')
        cy.xpath("string(//h3[@class='number'][1])").should('contain', 'IN (+91) 766 605 6560')
        cy.xpath("string(//h3[@class='number'][2])").should('contain', 'UK (+44) 2033185961')

        cy.xpath(copyRightLink).within(($form) => {
            cy.wrap($form).should('have.attr', 'href', 'http://www.avegenhealth.com/')
        })
        cy.xpath(termConditionsFooterLink).within(($form) => {
            cy.wrap($form).should('have.attr', 'href', '/terms_and_conditions.html')
        })
        cy.xpath(privacyPolicyFooterLink).within(($form) => {
            cy.wrap($form).should('have.attr', 'href', '/privacy_policy.html')
        })
    })

    it('Check login functionality with Blank Username & Blank Password', () => {
        cy.xpath(emailInput)
        cy.xpath(passwordInput)
        cy.xpath(cookieCheckbox).check()
        cy.xpath(termsConditionsCheckbox).check()
        cy.xpath(loginButton).click()

        cy.xpath("string(//li[contains(@class,'flash_alert')])").should('contain', 'Invalid Email or password.')
    })

    it('Check login functionality with Blank Username', () => {
        // cy.xpath(emailInput).type(' ')
        cy.xpath(passwordInput).type('password')
        cy.xpath(cookieCheckbox).check()
        cy.xpath(termsConditionsCheckbox).check()
        cy.xpath(loginButton).click()

        cy.xpath("string(//li[contains(@class,'flash_alert')])").should('contain', 'Invalid Email or password.')
    })

    it('Check login functionality with Blank Password', () => {
        cy.xpath(emailInput).type('drnayan@miraihealth.com')
        // cy.xpath(passwordInput).type(' ')
        cy.xpath(cookieCheckbox).check()
        cy.xpath(termsConditionsCheckbox).check()
        cy.xpath(loginButton).click()

        cy.xpath("string(//li[contains(@class,'flash_alert')])").should('contain', 'Invalid Email or password.')
    })

    it('Check login functionality with Invalid Username/Invalid Password', () => {
        cy.xpath(emailInput).type('foo@bar.com')
        cy.xpath(passwordInput).type('password')
        cy.xpath(cookieCheckbox).check()
        cy.xpath(termsConditionsCheckbox).check()
        cy.xpath(loginButton).click()

        cy.xpath("string(//li[contains(@class,'flash_alert')])").should('contain', 'Invalid Email or password.')
    })

    it('Check login functionality with Valid Username & Password', () => {
        cy.xpath(emailInput).type('drnayan@miraihealth.com')
        cy.xpath(passwordInput).type('password')
        cy.xpath(cookieCheckbox).check()
        cy.xpath(termsConditionsCheckbox).check()
        cy.xpath(loginButton).click()

        cy.get('.flash.flash_alert.text-red').should('not.be.visible')
        cy.xpath("<logout_button_xpath>").click()
        cy.xpath(loginButton).should('not.be.disabled')
        cy.xpath(cookieCheckbox).should('not.be.visible')
        cy.xpath(termsConditionsCheckbox).should('not.be.visible')
    })

    it('Check Login page links', () => {
        cy.xpath(privacyPolicyLink).click()
        cy.server().should((server) => {
            expect(server.status).to.eq(200)
        })
        cy.xpath("string(//body)").should('contain', 'Welcome to the Avegen Health Pte Ltd\'s (Avegen) privacy policy.')
        cy.go(-1)

        cy.xpath(termsConditionsLink).click()
        cy.server().should((server) => {
            expect(server.status).to.eq(200)
        })
        cy.xpath("string(//body)").should('contain', 'Terms and Conditions of Use')
        cy.go(-1)

        // cy.xpath(copyRightLink).click()
        // cy.server().should((server) => {
        //     expect(server.status).to.eq(200)
        // })
        // cy.xpath(avegenPage).should('not.be.hidden')
    })
})