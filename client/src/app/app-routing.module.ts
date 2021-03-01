import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './users/user-list.component';
import { UserProfileComponent } from './users/user-profile.component';
import { AddUserComponent } from './users/add-user.component';
import { TodoListComponent } from './todos/todo-list/todo-list.component';
import { TodoProfileComponent } from './todos/todo-profile/todo-profile.component';
import { AddTodoComponent } from './todos/add-todo/add-todo.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'users', component: UserListComponent},
  {path: 'users/new', component: AddUserComponent},
  {path: 'users/:id', component: UserProfileComponent},
  {path: 'todos', component: TodoListComponent},
  {path: 'todos/:id', component: TodoProfileComponent},
  {path: 'todos/new', component: AddTodoComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
