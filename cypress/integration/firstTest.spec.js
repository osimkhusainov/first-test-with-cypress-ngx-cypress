/// <reference types="cypress"/>

describe("Our first suite", () => {
  it("first test", () => {
    cy.visit("/");
    cy.contains("Form").click();
    cy.contains("Form Layouts").click();
    //Find element by:
    //by Tag name
    cy.get("input");

    //by ID
    cy.get("#inputEmail1");

    //by Class name
    cy.get(".input-full-width");

    //by Attribute name
    cy.get("[placeholder]");

    //by Attribute name and value
    cy.get('[placeholder="Email"]');

    //by Class value
    cy.get('[class="input-full-width size-medium shape-rectangle"]');

    //by Tag name and Attribute with value
    cy.get('input[placeholder="Email"]');

    //by two different attribute
    cy.get('[placeholder="Email"][type="email"]');

    //by Tag name, Attribute with value, ID and Class Name
    cy.get('input[placeholder="Email"]#inputEmail1.input-full-width');

    //The most recommended way by Cypress //нужно создавать свой собственный дата атрибут чтоб никто не трогал его
    cy.get('[data-cy="imputEmail1"');
  });

  it("Second test", () => {
    cy.visit("/");
    cy.contains("Form").click();
    cy.contains("Form Layouts").click();

    cy.get('[data-cy="signInButton"]');

    //Покажет только первую кнопку с таким названием, а не все кнопки
    cy.contains("Sign in");
    //Покажет вторую кнопку sign in
    cy.contains('[status="warning"]', "Sign in");

    //Найти button если допустим у него нет никаких атрибутов id и class, а потом checkbox и тд
    cy.get("#inputEmail3")
      .parents("form")
      .find("button")
      .should("contain", "Sign in")
      .parents("form")
      .find("nb-checkbox")
      .click();

    //будет ошибка, так как чтобы найти какой то элемент нужно пользоваться вариантом выше
    // cy.find('button')

    //Найти элемент форма емейл у формы с названием Horizontal form
    cy.contains("nb-card", "Horizontal form").find('[type="email"]');
  });

  it("then and wrap methods", () => {
    cy.visit("/");
    cy.contains("Form").click();
    cy.contains("Form Layouts").click();

    cy.contains("nb-card", "Using the Grid")
      .find('[for="inputEmail1"]')
      .should("contain", "Email");
    cy.contains("nb-card", "Using the Grid")
      .find('[for="inputPassword2"]')
      .should("contain", "Password");
    cy.contains("nb-card", "Basic form")
      .find('[for="exampleInputEmail1"]')
      .should("contain", "Email address");
    cy.contains("nb-card", "Basic form")
      .find('[for="exampleInputPassword1"]')
      .should("contain", "Password");

    //Selenium style не будет работать для cypress
    // const firstForm = cy.contains("nb-card", "Using the Grid");
    // firstForm.find('[for="inputEmail1"]').should("contain", "Email");
    // firstForm.find('[for="inputPassword2"]').should("contain", "Password");
    // const secondForm = cy.contains("nb-card", "Basic form");
    // secondForm
    //   .find('[for="exampleInputEmail1"]')
    //   .should("contain", "Email address");
    // secondForm
    //   .find('[for="exampleInputPassword1"]')
    //   .should("contain", "Password");

    //Cypress style
    cy.contains("nb-card", "Using the Grid").then((firstForm) => {
      const emailLabelFirst = firstForm.find('[for="inputEmail1"]').text();
      const passwordLabelFirst = firstForm
        .find('[for="inputPassword2"]')
        .text();
      expect(emailLabelFirst).to.equal("Email");
      expect(passwordLabelFirst).to.equal("Password");

      cy.contains("nb-card", "Basic form").then((secondForm) => {
        const passwordSecondText = secondForm
          .find('[for="exampleInputPassword1"]')
          .text();
        expect(passwordLabelFirst).to.equal(passwordSecondText);

        //chancge to cypress format
        cy.wrap(secondForm)
          .find('[for="exampleInputPassword1"]')
          .should("contain", "Password");
      });
    });
  });

  it("invoke command", () => {
    cy.visit("/");
    cy.contains("Form").click();
    cy.contains("Form Layouts").click();

    //find elements 3 variants
    //1
    cy.get('[for="exampleInputEmail1"]').should("contain", "Email address");
    //2  JQuery method
    cy.get('[for="exampleInputEmail1"]').then((label) => {
      expect(label.text()).to.equal("Email address");
    });
    //3 Invoke
    cy.get('[for="exampleInputEmail1"]')
      .invoke("text")
      .then((text) => {
        expect(text).to.equal("Email address");
      });

    // проверить что при клике на чекбокс добавится класс чекед
    cy.contains("nb-card", "Basic form")
      .find(".custom-checkbox")
      .click()
      .invoke("attr", "class")
      //   .should("contain", "checked");
      .then((classValue) => {
        expect(classValue).to.contain("checked");
      });
  });

  //DATAPICKER
  it("asserts property", () => {
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
            cy.get('nb-calendar-day-picker [class="day-cell ng-star-inserted"]')
              .contains(futureDay)
              .click();
          }
        });
      return dateAssert;
    }

    cy.visit("/");
    cy.contains("Form").click();
    cy.contains("Datepicker").click();

    cy.contains("nb-card", "Common Datepicker")
      .find("input")
      .then((input) => {
        cy.wrap(input).click();
        let dataAssert = selectDayFromCurrent(-1);
        cy.wrap(input).invoke("prop", "value").should("contain", dataAssert);
        cy.wrap(input).should('have.value', dataAssert)
      });
  });
  it("radio button", () => {
    cy.visit("/");
    cy.contains("Form").click();
    cy.contains("Form Layouts").click();

    //Работа с радио buttons
    cy.contains("nb-card", "Using the Grid")
      .find('[type="radio"]')
      .then((radioButtons) => {
        cy.wrap(radioButtons)
          .first()
          .check({ force: true })
          .should("be.checked");
        cy.wrap(radioButtons).eq(1).check({ force: true });
        cy.wrap(radioButtons).eq(0).should("not.be.checked");
        cy.wrap(radioButtons).eq(2).should("be.disabled");
      });
  });
  it("check boxes", () => {
    cy.visit("/");
    cy.contains("Modal & Overlays").click();
    cy.contains("Toastr").click();

    cy.get('[type="checkbox"]').eq(0).click({ force: true });
    cy.get('[type="checkbox"]').eq(1).check({ force: true });
  });
  it("lists and dropdown", () => {
    cy.visit("/");

    //1
    // cy.get("nav nb-select").click();
    // cy.get(".options-list").contains("Dark").click();
    // cy.get("nav nb-select").should("contain", "Dark");
    // cy.get("nb-layout-header nav").should(
    //   "have.css",
    //   "background-color",
    //   "rgb(34, 43, 69)"
    // );
    //2
    cy.get("nav nb-select").then((dropdown) => {
      cy.wrap(dropdown).click();
      cy.get(".options-list nb-option").each((listItem, index) => {
        const itemText = listItem.text().trim();
        const colors = {
          Light: "rgb(255, 255, 255)",
          Dark: "rgb(34, 43, 69)",
          Cosmic: "rgb(50, 50, 89)",
          Corporate: "rgb(255, 255, 255)",
        };
        cy.wrap(listItem).click();
        cy.wrap(dropdown).should("contain", itemText);
        cy.get("nb-layout-header nav").should(
          "have.css",
          "background-color",
          colors[itemText]
        );
        if (index < 3) {
          cy.wrap(dropdown).click();
        }
      });
    });
  });

  it("tables", () => {
    cy.visit("/");
    cy.contains("Tables & Data").click();
    cy.contains("Smart Table").click();

    // 1 Найти в таблице Larry и изменить его возраст на 25
    cy.get("tbody")
      .contains("tr", "Larry")
      .then((items) => {
        cy.wrap(items).find(".nb-edit").click();
        cy.wrap(items).find('[placeholder="Age"]').clear().type("25");
        cy.wrap(items).find(".nb-checkmark").click();
      });

    // 2 Добавить в таблицу нового человека
    cy.get("thead").find(".nb-plus").click();
    cy.get("thead")
      .find("tr")
      .eq(2)
      .then((tableRow) => {
        cy.wrap(tableRow).find('[placeholder="First Name"]').type("Osim");
        cy.wrap(tableRow).find('[placeholder="Last Name"]').type("Khusainov");
        cy.wrap(tableRow).find(".nb-checkmark").click();
      });
    cy.get("tbody tr")
      .first()
      .find("td")
      .then((tableColums) => {
        cy.wrap(tableColums).eq(2).should("have.text", "Osim");
        cy.wrap(tableColums).eq(3).should("have.text", "Khusainov");
      });

    //3
    const age = [20, 30, 40, 200];
    cy.wrap(age).each((age) => {
      cy.get('thead [placeholder="Age"]').clear().type(age);
      cy.wait(500);
      cy.get("tbody tr").each((tableRow) => {
        if (age === 200) {
          cy.wrap(tableRow).should("contain", "No data found");
        } else {
          cy.wrap(tableRow).find("td").eq(6).should("contain", age);
        }
      });
    });
  });

  it("tooltip", () => {
    cy.visit("/");
    cy.contains("Modal & Overlays").click();
    cy.contains("Tooltip").click();

    //Подтвердить что при наведении на кнопку show tooltip показывается надпись this is a tooltip
    cy.contains("nb-card", "Tooltip With Icon")
      .contains("Show Tooltip")
      .click();
    cy.get("nb-tooltip").should("contain", "This is a tooltip");
  });
  it.only("dialog box", () => {
    cy.visit("/");
    cy.contains("Tables & Data").click();
    cy.contains("Smart Table").click();

    //1
    cy.get("tbody tr").first().find(".nb-trash").click();
    cy.on("window:confirm", (confirm) => {
      expect(confirm).to.equal("Are you sure you want to delete?");
    });
    // 2 фаворитный вариант
    const stub = cy.stub();
    cy.on("window:confirm", stub);
    cy.get("tbody tr").first().find(".nb-trash").click().then(() => {
        expect(stub.getCall(0)).to.be.calledWith('Are you sure you want to delete?')
    })
    //3
    cy.get("tbody tr").first().find(".nb-trash").click();
    cy.on("window:confirm", () =>  false)
  });
});
