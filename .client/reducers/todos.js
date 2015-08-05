import { ADD_TODO, DELETE_TODO, EDIT_TODO, MARK_TODO, MARK_ALL, CLEAR_MARKED, TODO_CHANGED } from '../constants/ActionTypes';

const initialState = { todos: Todo.findAll()};

export default function todos(state = initialState, action) {

  switch (action.type) {
  case ADD_TODO:
    Todos.insert({
      completed: false,
      title: action.title
    });

    return { todos: Todo.findAll()};

  case DELETE_TODO:
    Todos.remove({_id: action.id})
    return { todos: Todo.findAll()};

  case EDIT_TODO:
    Todos.update({_id: action.id}, {$set: {text: action.title}})
    return { todos: Todo.findAll()};

  case MARK_TODO:
    const todo = Todos.findOne({_id: action.id})
    Todos.update({_id: action.id}, {$set: {completed: !todo.completed}})
    return { todos: Todo.findAll()};

  case MARK_ALL:
    Todos.update({}, {$set: {completed: true}})
    return { todos: Todo.findAll()};

  case CLEAR_MARKED:
    Todos.update({}, {$set: {completed: false}})
    return { todos: Todo.findAll()};

  case TODO_CHANGED:
    return { todos: Todo.findAll()};

  default:
    return state;
  }
}
