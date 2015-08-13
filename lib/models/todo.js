Todos = new Mongo.Collection("todos");



Todo = {
  findAll: function() {
    return Todos.find({}).fetch();
  }
}

Meteor.methods({
	"/todos/delete": function(id){
		Todos.remove({_id: id});
	}

})