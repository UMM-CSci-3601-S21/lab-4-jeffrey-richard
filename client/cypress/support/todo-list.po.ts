export class TodoListPage {
  navigateTo() {
    return cy.visit('/todos');
  }
  getUrl() {
    return cy.url();
  }
  getTodoTitle() {
    return cy.get('.todo-list-title');
  }

  getTodoCards() {
    return cy.get('.todoList app-todo-card');
  }

  getStatuses(){
    return this.getTodoCards().get('.div span h4');
  }

  clickViewProfile(card: Cypress.Chainable<JQuery<HTMLElement>>) {
    return card.find<HTMLButtonElement>('[data-test=viewProfileButton]').click();
  }
  selectRole(value: string) {
    return cy.get('[data-test=todoStatusSelect]').click().get(`mat-option[value="${value}"]`).click();
  }
}
