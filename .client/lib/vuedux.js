import Vue from 'vue'
import { createStore, bindActionCreators } from 'redux'

var _ = Vue.util;

function Vuedux(options = {}){
  this.state = null;
  this.store = null;
  this.actions = null;
  this.mixin = createMixin(this);
  this.createStore = function(reducers){
    if (this.store) 
      process.env.NODE_ENV !== 'production' && _.warn('Duplicated stores.')
    else
      this.store = createStore(reducers);

    return this.store;
  }
}

function actionDirective() {
  var actionRE = /^([\w_$]+)(\(.*\))?$/
  var action = _.extend({}, Vue.directive('on'))

  action.bind = function () {
    var exp = this.expression
    var actionMatch = exp.match(actionRE)
    if (actionMatch) {
      var actionName = actionMatch[1]
      var action = this.vm.$actions[actionName]
      if (action) {
        this._watcherExp = this.expression = '$actions.' + exp
      } else {
        process.env.NODE_ENV !== 'production' && _.warn(
          'Unknown action: ' + actionName
        )
      }
    } else {
      process.env.NODE_ENV !== 'production' && _.warn(
        'Invalid v-action expression: ' + exp
      )
    }
  }  

  return action;
}

function createMixin(vuedux) {
  return {
    bindActions: function(actions){
      return {
        data(){
          return {
            state: ''
          }
        },
        created() {
          const handleChange = this.handleChange.bind(this)
          this.unsubscribe = vuedux.store.subscribe(handleChange)
          handleChange()        
        },
        destroyed() {
          this.unsubscribe();
        }, 
        methods: {
          handleChange() {
            this.state = vuedux.store.getState()
            vuedux.actions = bindActionCreators(actions, vuedux.store.dispatch);
            this.$actions = vuedux.actions;
          }        
        },
        directives: {
          action: actionDirective()
        }
      }
    }
  }
}

export default new Vuedux();