import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo } from './todo';


@Injectable({
  providedIn: 'root'
})
export class TodoService {
  readonly todoUrl: string = environment.apiUrl + 'todos';

  constructor(private httpClient: HttpClient) { }

  getTodos(filters?: { owner?: string; status?: string }): Observable<Todo[]> {
    let httpParams: HttpParams = new HttpParams();
    if(filters) {
      if(filters.status) {
        httpParams = httpParams.set('status', filters.status);
      }
      if(filters.owner) {
        httpParams = httpParams.set('owner', filters.owner);
      }
    }
    return this.httpClient.get<Todo[]>(this.todoUrl, {
      params: httpParams,
    });
  }

  getTodoById(id: string): Observable<Todo> {
    return this.httpClient.get<Todo>(this.todoUrl + '/' + id);
  }

  filterTodos(todos: Todo[], filters: { category?: string; body?: string; limit?: number }): Todo[] {
    let filteredTodos = todos;

    if(filters.category) {
      filters.category = filters.category.toLowerCase();

      filteredTodos = filteredTodos.filter(todo => todo.category.toLowerCase().indexOf(filters.category) !== -1);
    }
    if(filters.body) {
      filters.body = filters.body.toLowerCase();

      filteredTodos = filteredTodos.filter(todo => todo.body.toLowerCase().indexOf(filters.body) !== -1);
    }
    if(filters.limit) {
      filteredTodos = filteredTodos.slice(0,filters.limit);
    }
    return filteredTodos;
  }
}
