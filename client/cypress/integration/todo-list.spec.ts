import { TodoListPage } from '../support/todo-list.po';

const page = new TodoListPage();

describe('Todo list', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should show all todos', () => {
    page.getTodoCards().should('have.length', 300);
  });

  it('Should type something in the owner filter and check that it returned correct elements', () => {
    // Filter for owner 'Barry'
    cy.get('[data-test=ownerInput]').type('Barry');

    page.getTodoCards().should('have.length.above', 0);

    // All of the user cards should have the name we are filtering by
    page.getTodoCards().each(e => {
      cy.wrap(e).find('.todo-card-owner').should('have.text', 'Barry');
    });

    // (We check this two ways to show multiple ways to check this)
    page.getTodoCards().find('.todo-card-owner').each(el =>
      expect(el.text()).to.equal('Barry')
    );
  });

  it('Should type something into the body filter and check that it returned correct elements', () => {
    cy.get('[data-test=bodyInput]').type('reprehenderit des');

    page.getTodoCards().should('have.length.above', 0);

    page.getTodoCards().each(e => {
      cy.wrap(e).find('.body').should('contain.text', 'reprehenderit des');
    });
  });

  it('Should filter by complete and return the correct elements', () => {
    page.selectStatus('true');

    page.getTodoCards().should('have.length.above', 0);

    page.getTodoCards().each(e => {
      cy.wrap(e).find('#span').should('contain.text', 'Complete');
    });
  });

  it('Should filter by incomplete and return the correct elements', () => {
    page.selectStatus('false');

    page.getTodoCards().should('have.length.above', 0);

    page.getTodoCards().each(e => {
      cy.wrap(e).find('#span').should('contain.text', 'Incomplete');
    });
  });

  it('should type in a limit and return the correct number of todos', () => {
    cy.get('[data-test=limitInput]').type('13');

    page.getTodoCards().should('have.lengthOf', 13);
  });

  it('should click on a todo and lead to the correct todo', () => {
    page.getTodoCards().first().then((card) => {
      const owner = card.find('.todo-card-owner').text();
      const body = card.find('.body').text();

      page.clickViewProfile(page.getTodoCards().first());

      cy.url().should('match', /\/todos\/[0-9a-fA-F]{24}$/);

      cy.get('.todo-card-name').first().should('have.text', owner);
      cy.get('.body').first().should('contain.text', body);
    });
  });


});
