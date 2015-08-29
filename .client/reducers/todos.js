import { ADD_TODO, DELETE_TODO, EDIT_TODO, MARK_TODO, MARK_ALL, CLEAR_MARKED } from '../constants/ActionTypes';
import { bindReactiveData } from 'meteoredux'

const initialState = {};

function todos(state = initialState, action) {

  switch (action.type) {
  case ADD_TODO:
    Meteor.call("/todos/add", action.text);
    //We have not changed the state here, so we return original state.
    return state;

  case DELETE_TODO:
    Meteor.call("/todos/delete", action.id);
    return state;

  case EDIT_TODO:
    Meteor.call("/todos/modify", action.id, action.text);
    return state;

  case MARK_TODO:
    Meteor.call("/todos/mark", action.id);
    return state;

  case MARK_ALL:
    Meteor.call("/todos/mark_all");
    return state;

  case CLEAR_MARKED:
    Meteor.call("/todos/unmark_all");
    return state;


  default:
    return state;
  }
}

function reactiveData(){
  return {
    todos: Todos.find({}).fetch()
  }
}
export default bindReactiveData(todos, reactiveData);