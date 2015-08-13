
var meteorActionName = "@@METEOREDUX/DATA_CHANGED";

function meteorData(state = {}, action) {
  if (action.type === meteorActionName) {
    //console.log("Meteor data updated.");
    let results = action.results;
    results.slice().forEach( result => {
      state[result.property] = result.value;
    })
  }
  return state;
}

export function bindMeteorData(reducers){
  return {...reducers, meteorData};
}

export function meteoredux(store){

  var _store = store;
  var _bindings = [];

  Meteor.startup(()=> {
    Tracker.autorun( computation => {
      if (_store) {
        const results = calculateResult();
        if (computation.firstRun) return;
        _store.dispatch({type: meteorActionName, results});
      }
    });
  });

  function calculateResult(){
    var results = [];
    _bindings.slice().forEach( binding => {
      let value = binding.invoker();
      let property = binding.property;

      if (Package.mongo && Package.mongo.Mongo &&
      value instanceof Package.mongo.Mongo.Cursor) {
        value = value.fetch();
      }          
      results.push({property, value});
    }); 

    return results;
  }

  function bindToState(bindings) {
    Object.keys(bindings).forEach( key => {
      const invoker = bindings[key];
      const property = key;

      _bindings.push({property, invoker});
    });

    if (_store) {
      const results = calculateResult();
      _store.dispatch({type: meteorActionName, results});
    }
  }

  return {
    bindToState
  }
}

