describe('template spec', () => {
    var groupItemList = new Array();
    var groupAccessItemList = new Array();
    it('PagerDutyNewUserTest_Enter as guest', () => {

      cy.visit('/')
      cy.contains('Enter as a Guest').click()

//      //Accessing the Template Pagerduty New User
//      cy.get('h4').contains('PagerDuty // New User').parent('div').parent('div').find('span').contains('Choose').click()
//
//
//     //New User Details page
//
//
//     //full name field error message when no input is given
//     cy.get('[type="submit"]').click()
//     cy.on('window alert',(text) => {
//       expect(text).to.contains('Please fill in this field.')
//     })
//    //email field error message when no input is given
//    cy.get('#root_name-label').type('{selectall}{backspace}').type('Tester Name')
//    cy.get('div [tabindex="0"][type="submit"]').contains('Review').click()
//    cy.on('window alert',(text) => {
//      expect(text).to.contains('Please fill in this field.')
//    })
//    cy.get('#root_email').clear().type('tester@jaguarlandrover.com')
//
//     //full name field validations on New User details page
//
//    //check that any characters, numbers or special characters will be allowed
//    cy.get('#root_name-label').type('{selectall}{backspace}').type('Name')
//    cy.get('div [tabindex="0"][type="submit"]').contains('Review').click()
//    cy.get('div [tabindex="0"][type="button"]').find('span').contains('Back').click()
//
//    //email - mandatory field, should not have capital letters,should not have special characters, zero or one occurence of partner, should match the string jaguarlandrover.com
//
//
//     //email validations on Requester details page
//     //-   zero or one occurence of partner, should match the string jaguarlandrover.com
//
//     //Check that the email should not have capital letters
//     cy.get('#root_email').clear().type('Aa@partner.jaguarlandrover.com')
//     cy.get('div [tabindex="0"][type="submit"]').contains('Review').click()
//     cy.get('#root_email-label').parent('div').parent('div').parent('div').find('ul').click({ multiple: true,force: true }).contains('must match pattern "^[a-z]+[0-9]*@(partner.)?jaguarlandrover.com$"')
//
//     //Check that the email should not have special characters
//     cy.get('#root_email').clear().type('**@partner.jaguarlandrover.com')
//     cy.get('div [tabindex="0"][type="submit"]').contains('Review').click()
//     cy.get('#root_email-label').parent('div').parent('div').parent('div').find('ul').click({ multiple: true,force: true }).contains('must match pattern "^[a-z]+[0-9]*@(partner.)?jaguarlandrover.com$"')
//
//     //Check that the email should have the jaguarlandrover.com and any others are invalid
//     cy.get('#root_email').clear().type('tester@gmail.com')
//     cy.get('div [tabindex="0"][type="submit"]').contains('Review').click()
//     cy.get('#root_email-label').parent('div').parent('div').parent('div').find('ul').click({ multiple: true,force: true }).contains('must match pattern "^[a-z]+[0-9]*@(partner.)?jaguarlandrover.com$"')
//
//     //Check that the email should be accepeted for one occurene of partner
//     cy.get('#root_email').clear().type('tester1@partner.jaguarlandrover.com')
//     cy.get('div [tabindex="0"][type="submit"]').contains('Review').click()
//     cy.get('div [tabindex="0"][type="button"]').find('span').contains('Back').click()
//
//     //Check that the email should be accepeted for no occurene of partner
//     cy.get('#root_email').clear().type('tester1@jaguarlandrover.com')
//     cy.get('div [tabindex="0"][type="submit"]').contains('Review').click()
//     cy.get('div [tabindex="0"][type="button"]').find('span').contains('Back').click()
//
//    //inputting a valid email id for the request to go trhough
//    var randomMail = String.fromCharCode(0|Math.random()*26+97)
//    cy.get('#root_email').clear().type(randomMail+'@partner.jaguarlandrover.com')
//    cy.get('div [tabindex="0"][type="submit"]').contains('Review').click()
//    cy.get('div [tabindex="0"][type="button"]').find('span').contains('Back').click()
//
//    cy.get('form [tabindex="0"][type="submit"]').contains('Review').click()
//
//    //Ensure the titles on Review and create Page are displayed
//      cy.get('tr td').should('include.text','Name')
//    cy.get('tr td').should('include.text','Email')
//
//    cy.get('div [tabindex="0"][type="button"]').contains('Create').click()

    })
  })
