Todos = new Mongo.Collection("todos");

if (Meteor.isServer) {
  Meteor.publish("todos", function(){
    return Todos.find({});
  })
}

Meteor.methods({
  "/todos/delete": function(id){
    Todos.remove({_id: id});
  },
  "/todos/add": function(text){
    Todos.insert({completed: false,text: text});
  },
  "/todos/modify": function(id, text) {
    Todos.update(id, {$set: {text: text}});
  },

  "/todos/mark": function(id){
    var todo = Todos.findOne(id);
    Todos.update(id, {$set: {completed: !todo.completed}});
  },
  "/todos/mark_all": function(){
    Todos.update({}, {$set: {completed: true}})
  },

  "/todos/unmark_all": function(){
      Todos.update({}, {$set: {completed: false}})
  }

})