export class SmartTable {
    updateAgebyName(age){
        cy.get("tbody")
        .contains("tr", "Larry")
        .then((items) => {
          cy.wrap(items).find(".nb-edit").click();
          cy.wrap(items).find('[placeholder="Age"]').clear().type(age);
          cy.wrap(items).find(".nb-checkmark").click();
        });
    }
    addNewUserForTable(name, lastName){
        cy.get("thead").find(".nb-plus").click();
        cy.get("thead")
          .find("tr")
          .eq(2)
          .then((tableRow) => {
            cy.wrap(tableRow).find('[placeholder="First Name"]').type(name);
            cy.wrap(tableRow).find('[placeholder="Last Name"]').type(lastName);
            cy.wrap(tableRow).find(".nb-checkmark").click();
          });
        cy.get("tbody tr")
          .first()
          .find("td")
          .then((tableColums) => {
            cy.wrap(tableColums).eq(2).should("have.text", name);
            cy.wrap(tableColums).eq(3).should("have.text", lastName);
          });
    }
    deleteRowByIndex(num){
        const stub = cy.stub();
        cy.on("window:confirm", stub);
        cy.get("tbody tr").eq(num).find(".nb-trash").click().then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Are you sure you want to delete?')
        })
    }
}

export const onSmartTablePage = new SmartTable()