import Vue from 'vue'
import { combineReducers } from 'redux'
import app from './components/app.vue'
import  * as reducers  from './reducers'
import * as CollectionActions from './actions/CollectionActions';
import vuedux from './lib/vuedux'

Meteor.subscribe('todos');

const combined = combineReducers(reducers);
vuedux.createStore(combined);

//watch collections on Minimongo cache and trigger action on change
Meteor.startup(() => {
  Tracker.autorun(computation => {
    var docs = Todos.find({}).fetch();
    if (computation.firstRun) return; // ignore first empty run
    console.log('\n[Tracker] collection changed');
    vuedux.store.dispatch(CollectionActions.todoChanged(docs));
  });
});

Template.body.onRendered(function(){
  new Vue(app).$mount('#root');
});
