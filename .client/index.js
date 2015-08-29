import Vue from 'vue'
import { createStore, combineReducers } from 'redux';
import app from './components/app.vue'
import  * as reducers  from './reducers'
import vuedux from './lib/vuedux'
import { connectToMeteor } from 'meteoredux'

//Vue defined Object.$set method, 
//but in Meteor it maybe be treated as Collection modifier, 
//So we need delete this method.
//https://github.com/vuejs/vue-webpack-meteor-example/issues/2
delete Object.prototype.$set;

Meteor.subscribe('todos');

let combinedReducers = combineReducers(reducers);
let store = createStore(combinedReducers);

vuedux.attachStore(store);
connectToMeteor(store);


Template.body.onRendered(function(){
  new Vue(app).$mount('#root');
});
