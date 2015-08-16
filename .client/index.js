import Vue from 'vue'
import { createStore, combineReducers } from 'redux';
import app from './components/app.vue'
import  * as reducers  from './reducers'
import vuedux from './lib/vuedux'
import { connectToMeteor } from './lib/meteorredux2'

Meteor.subscribe('todos');

let combinedReducers = combineReducers(reducers);
let store = createStore(combinedReducers);

vuedux.attachStore(store);
connectToMeteor(store);


Template.body.onRendered(function(){
  new Vue(app).$mount('#root');
});
