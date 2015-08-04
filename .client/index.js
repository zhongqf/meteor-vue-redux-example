import Vue from 'vue'
import app from './components/app.vue'
import { createStore } from 'redux'
import { reducers } from './reducers'
import * as CollectionActions from './actions/CollectionActions';
import 'todomvc-app-css/index.css';

const store = createStore(reducers);

Meteor.subscribe('todos');

// watch collections on Minimongo cache and trigger action on change
Meteor.startup(() => {
  Tracker.autorun(computation => {
    var docs = Todos.find({}).fetch();
    if (computation.firstRun) return; // ignore first empty run
    console.log('\n[Tracker] collection changed');
    store.dispatch(CollectionActions.todoChanged(docs));
  });
});

var rootApp = {
  data: {  store: store  },
  template: '<div><root-app store="{{store}}"></root-app></div>',
  components: { 'root-app': app }
}

Template.body.onRendered(function(){
  new Vue(rootApp).$mount('#root');
});
