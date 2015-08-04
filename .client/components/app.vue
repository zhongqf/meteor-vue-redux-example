<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" autofocus autocomplete="off" placeholder="What needs to be done?" v-model="newTodo" v-on="keyup:addTodo | key 'enter'">
    </header>
    <section class="main" v-show="todos.length" v-cloak>
      <input class="toggle-all" type="checkbox" v-model="allDone">
      <ul class="todo-list">
        <li class="todo" v-repeat="todo: filteredTodos" v-class="completed: todo.completed, editing: todo == editedTodo">
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed">
            <label v-on="dblclick: editTodo(todo)">{{todo.title}}</label>
            <button class="destroy" v-on="click: removeTodo(todo)"></button>
          </div>
          <input class="edit" type="text" v-model="todo.title" v-todo-focus="todo == editedTodo" v-on="blur: doneEdit(todo), keyup: doneEdit(todo) | key 'enter', keyup: cancelEdit(todo) | key 'esc'">
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="todos.length" v-cloak>
      <span class="todo-count">
        <strong v-text="remaining"></strong> {{remaining | pluralize 'item'}} left
      </span>
      <ul class="filters">
        <li><a v-on='click: visibility = "all"' v-class="selected: visibility == 'all'">All</a></li>
        <li><a v-on='click: visibility = "active"'  v-class="selected: visibility == 'active'">Active</a></li>
        <li><a v-on='click: visibility = "completed"'  v-class="selected: visibility == 'completed'">Completed</a></li>
      </ul>
      <button class="clear-completed" v-on="click:removeCompleted" v-show="todos.length > remaining">
        Clear completed
      </button>
    </footer>
  </section>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <p>Written by <a href="http://evanyou.me">Evan You</a></p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
</template>

<script lang="babel">
import * as TodoActions from '../actions/TodoActions'
import * as CollectionActions from '../actions/CollectionActions';

import { bindActionCreators } from 'redux'

var filters = {
    all: (todos) => todos,
    active: (todos) => todos.filter(todo => !todo.completed),
    completed: (todos)=> todos.filter(todo=> todo.completed)
  };

export default {
  props: ['store'],
  data() {
    return {
      newTodo: '',
      editedTodo: null,
      visibility: 'all',
      beforeEditCache: '',

      todos: '',
      actions: ''
    }
  },
  directives: {
    'todo-focus': function(value){
      if (!value) {
        return;
      }
      var el = this.el;
      setTimeout(()=>{
        el.focus();
      }, 0);
    }
  },
  created() {
    const handleChange = this.handleChange.bind(this)
    this.unsubscribe = this.store.subscribe(handleChange)
    handleChange()
  },
  destroyed() {
    this.unsubscribe()
  },
  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
    filteredTodos(){ return filters[this.visibility](this.todos);},
    remaining(){ return filters.active(this.todos).length;},
    allDone: {
      get() { return this.remaining === 0; },
      set(value) { this.todos.forEach( todo => todo.completed = value);}
    }
  },
  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    handleChange() {
      this.todos = this.store.getState();
      this.actions = bindActionCreators({...TodoActions, ...CollectionActions}, this.store.dispatch);
    },
    addTodo() {
      var value = this.newTodo && this.newTodo.trim();
      if (!value)  return;

      this.actions.addTodo(value);
      this.newTodo = '';
    },

    removeTodo(todo) {
      this.actions.deleteTodo(todo._id);
    },

    editTodo(todo) {
      this.beforeEditCache = todo.title;
      this.editedTodo = todo;
    },

    doneEdit(todo) {
      if (!this.editedTodo) return;
      this.editedTodo = null;

      var title = todo.title.trim();
      if (!title) {
        this.actions.deleteTodo(todo._id);
        return 
      }
      this.actions.editTodo(todo._id, title);
    },

    cancelEdit(todo) {
      this.editedTodo = null;
      todo.title = this.beforeEditCache;
    },

    removeCompleted() {
      this.actions.clearMarked();
    }
  }  
}
</script>