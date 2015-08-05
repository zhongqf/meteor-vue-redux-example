import Vue from 'vue'
import app from './components/app.vue'
import { reducers } from './reducers'
import * as CollectionActions from './actions/CollectionActions';
import vuedex from './lib/vuedux'

vuedex.createStore(reducers);

Meteor.subscribe('todos');

// watch collections on Minimongo cache and trigger action on change
Meteor.startup(() => {
  Tracker.autorun(computation => {
    var docs = Todos.find({}).fetch();
    if (computation.firstRun) return; // ignore first empty run
    console.log('\n[Tracker] collection changed');
    vuedex.store.dispatch(CollectionActions.todoChanged(docs));
  });
});


var rootApp = {
  template: '<div><root-app></root-app></div>',
  components: { 'root-app': app }
}

Template.body.onRendered(function(){
  new Vue(rootApp).$mount('#root');
});
