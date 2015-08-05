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
      this.store = createStore(reducers)
  }
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
          }        
        }
      }
    }
  }
}

export default new Vuedux();