export class LayoutsPage {
  selectInlineForm(name, email) {
    cy.contains("nb-card", "Inline form")
      .find(".form-inline")
      .then((item) => {
        cy.wrap(item).find('[placeholder="Jane Doe"]').type(name);
        cy.wrap(item).find('[placeholder="Email"]').type(email);
        cy.wrap(item).find('[type="checkbox"]').check({force: true});
        cy.wrap(item).submit();
      });
  }
  selectBasicForm(name, email){
    cy.contains("nb-card", "Basic form")
    .find("form")
    .then((item) => {
      cy.wrap(item).find('[placeholder="Email"]').type(name);
      cy.wrap(item).find('[placeholder="Password"]').type(email);
      cy.wrap(item).find('[type="checkbox"]').check({force: true});
      cy.wrap(item).submit();
    });
  }
}
export const onLayoutsForm = new LayoutsPage();
