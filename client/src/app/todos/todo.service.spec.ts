import { TestBed } from '@angular/core/testing';

import { TodoService } from './todo.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Todo } from './todo';


describe('TodoService', () => {
  let service: TodoService;

  const testTodos: Todo[] = [
    {
      _id: '58895985a22c04e761776d54',
      owner: 'Dawn',
      status: false,
      body: 'In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.',
      category: 'homework'
    },
    {
      _id: '58895985c1849992336c219b',
      owner: 'Fry',
      status: false,
      body: 'Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.',
      category: 'video games'
    },
    {
      _id: '58895985ae3b752b124e7663',
      owner: 'Fry',
      status: true,
      body: 'Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.',
      category: 'homework'
    }
  ];

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    service = new TodoService(httpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTodos()', () => {
    it('calls api/todos when getTodos() is called without parameters', () => {
      service.getTodos().subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      const req = httpTestingController.expectOne(service.todoUrl);
      expect(req.request.method).toEqual('GET');
      expect(req.request.params.keys().length).toBe(0);
    });

    describe('Calling getTodos() with parameters with http requests', () => {
      it('calls api/todos with the filter parameter "true"', () => {
      service.getTodos({ status: true }).subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      const req = httpTestingController.expectOne(
        (request) => request.url.startsWith(service.todoUrl) && request.params.has('status')
      );

      expect(req.request.method).toEqual('GET');

      expect(req.request.params.get('status')).toEqual('true');

      req.flush(testTodos);
    });

    it('calls api/todos with the filter parameter "Fry"', () => {
      service.getTodos({ owner: 'Fry'}).subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      const req = httpTestingController.expectOne(
        (request) => request.url.startsWith(service.todoUrl) && request.params.has('owner')
      );

      expect(req.request.method).toEqual('GET');

      expect(req.request.params.get('owner')).toEqual('Fry');

      req.flush(testTodos);
    });
    });
  });

  describe('GetTodoById()', () => {
    it('calls api/todos/id with the correct ID', () => {
      const targetTodo: Todo = testTodos[1];
      const targetId: string = targetTodo._id;

      service.getTodoById(targetId).subscribe(
        todos => expect(todos).toBe(targetTodo)
      );

      const expectedUrl: string = service.todoUrl + '/' + targetId;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(targetTodo);
    });
  });

  describe('filterTodos()', () => {
    it('filters by category', () => {
      const todoCategory = 'homework';
      const filteredTodos = service.filterTodos(testTodos, { category: todoCategory });

      expect(filteredTodos.length).toBe(2);

      filteredTodos.forEach(todo => {
        expect(todo.category.indexOf(todoCategory)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by body', () => {
      const todoBody = 'minim';
      const filteredTodos = service.filterTodos(testTodos, { body: todoBody });

      expect(filteredTodos.length).toBe(1);

      filteredTodos.forEach(todo => {
        expect(todo.body.indexOf(todoBody)).toBeGreaterThanOrEqual(0);
      });
    });

    it('correctly limits a search', () => {
      const limitNumber = 1;
      const filteredTodos = service.filterTodos(testTodos, { limit: limitNumber });

      expect(filteredTodos.length).toBe(1);
    });

    it('correctly limits a search after filtering by category', () => {
      const todoCategory = 'homework';
      const limitNumber = 1;
      const filteredTodos = service.filterTodos(testTodos, { category: todoCategory, limit: limitNumber});

      expect(filteredTodos.length).toBe(1);

      filteredTodos.forEach(todo => {
        expect(todo.category.indexOf(todoCategory)).toBeGreaterThanOrEqual(0);
      });
    });

    it('correctly filters by both body and category', () => {
      const todoBody = 'tempor';
      const todoCategory = 'video';
      const filteredTodos = service.filterTodos(testTodos, { body: todoBody, category: todoCategory });

      expect(filteredTodos.length).toBe(1);

      filteredTodos.forEach(todo => {
        expect(todo.category.indexOf(todoCategory) &&
        todo.body.indexOf(todoBody)).toBeGreaterThanOrEqual(0);
      });
    });

    it('addTodo() posts the todo to api/todos', () => {
      service.addTodo(testTodos[2]).subscribe(
        id => expect(id).toBe('testID')
      );

      const req = httpTestingController.expectOne(service.todoUrl);

      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testTodos[2]);

      req.flush({ id: 'testID' });
    });
  });
});
