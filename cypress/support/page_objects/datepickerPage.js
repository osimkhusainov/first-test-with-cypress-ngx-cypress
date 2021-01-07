function selectDayFromCurrent(day) {
    let date = new Date();
    date.setDate(date.getDate() + day);
    let futureDay = date.getDate();
    let futureMonth = date.toLocaleString("default", { month: "short" });
    let dateAssert = `${futureMonth} ${futureDay}, ${date.getFullYear()}`;

    cy.get("nb-calendar-navigation")
      .invoke("attr", "ng-reflect-date")
      .then((dataAttribute) => {
        if (!dataAttribute.includes(futureMonth)) {
          cy.get('[data-name="chevron-right"]').click();
          selectDayFromCurrent(day);
        } else {
          cy.get('.day-cell').not('.bounding-month')
            .contains(futureDay)
            .click();
        }
      });
    return dateAssert;
  }

export class DatepickerPage{
    selectDatepickerGrid(day){
        cy.contains("nb-card", "Common Datepicker")
        .find("input")
        .then((input) => {
          cy.wrap(input).click();
          let dataAssert = selectDayFromCurrent(day);
          cy.wrap(input).invoke("prop", "value").should("contain", dataAssert);
          cy.wrap(input).should('have.value', dataAssert)
        });
    }
    selectDatepickerWithRange(firstDay, secondDay){
        cy.contains("nb-card", "Datepicker With Range")
        .find("input")
        .then((input) => {
          cy.wrap(input).click();
          let dataAssertFirst = selectDayFromCurrent(firstDay);
          let dataAssertSecond = selectDayFromCurrent(secondDay);
          let finalDay = `${dataAssertFirst} - ${dataAssertSecond}`;
          cy.wrap(input).invoke("prop", "value").should("contain", finalDay);
          cy.wrap(input).should('have.value', finalDay)
        });
    }
}
export const onDatepicker = new DatepickerPage()