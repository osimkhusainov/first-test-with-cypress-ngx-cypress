import { onDatepicker } from "../support/page_objects/datepickerPage";
import { onLayoutsForm } from "../support/page_objects/layoutsFormPages";
import { navigateTo } from "../support/page_objects/navigation-page";
import { onSmartTablePage } from "../support/page_objects/smartTablePage";
describe("First test page object", () => {
  beforeEach("open application", () => {
    cy.goToHomePage();
  });

    it("verify navigation across the pages", () => {
      navigateTo.formLayoutsPage();
      navigateTo.datepickerPage();
      navigateTo.toastrPage();
      navigateTo.smartTablePage();
      navigateTo.tooltipPage();
    });

  it.only("select forms Inline from and Basic form", () => {
    navigateTo.formLayoutsPage();
    onLayoutsForm.selectInlineForm("Osim", "keedice@gmail.com");
    onLayoutsForm.selectBasicForm("Osim", "keedice@gmail.com");
    navigateTo.datepickerPage();
    onDatepicker.selectDatepickerGrid(3);
    onDatepicker.selectDatepickerWithRange(3, 5);
    navigateTo.smartTablePage();
    onSmartTablePage.updateAgebyName("30");
    onSmartTablePage.addNewUserForTable("Osim", "Khusainov");
    onSmartTablePage.deleteRowByIndex(2);
  });
});
