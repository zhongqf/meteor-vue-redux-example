import Vue from 'vue'
var _ = Vue.util;

function Meteuv(options = {}){
	this.mixin = createMixin(this);
}

function meteorCallDirective() {

  var calleeRE = /^(([\w_$]+)|'([\w_\/$]+)'|"([\w_\/$]+)")(\((.*)\))?$/
  var meteorCall = _.extend({}, Vue.directive('on'))

  meteorCall.bind = function () {

    var exp = this.expression
    var expMatch = exp.match(calleeRE)
    if (expMatch) {
      var methodName = expMatch[2] || expMatch[3] || expMatch[4];
      this._watcherExp = this.expression = '$mcall_wrapper("'+methodName+'",'+expMatch[6]+')';
    } else {
      process.env.NODE_ENV !== 'production' && _.warn(
        'Invalid v-mcall expression: ' + exp
      )
    }
  }  

  return meteorCall;
}

function createMixin(meteuv){
	return {
		methods: {
			$mcall_wrapper: function(method, ...args){
				Meteor.call(method, ...args);
			}
		},
		directives: {
			mcall: meteorCallDirective()
		}
	}
}

export default new Meteuv();