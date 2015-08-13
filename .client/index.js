import Vue from 'vue'
import { combineReducers } from 'redux'
import app from './components/app.vue'
import  * as reducers  from './reducers'
import vuedux from './lib/vuedux'
import {bindMeteorData, meteoredux } from './lib/meteoredux'

Meteor.subscribe('todos');

const combined = combineReducers(bindMeteorData(reducers));
const store = vuedux.createStore(combined);

meteoredux(store).bindToState({
  todos: ()=> Todos.find({})
})

Template.body.onRendered(function(){
  new Vue(app).$mount('#root');
});
