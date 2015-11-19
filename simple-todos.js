Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
    Template.body.helpers({
//        tasks:[
//            {text:"This is task 1"},
//            {text:"This is task 2"},
//            {text:"This is task 3"}
//        ]
        tasks:function(){
            return Tasks.find({},{sort:{createdAt:-1}});
        }
    });

    Template.body.events({
        "submit .new-task":function(event){
            event.preventDefault();
            var text=event.target.text.value;
            Tasks.insert({
                text:text,
                createdAt:new Date()
            });

            event.target.text.value="";
        },
        "click .toggle-checked":function(){
            Tasks.update({
                $set:{checked:!this.checked}
            });
        },
        "click .delete":function(){
            Tasks.remove(this._id);
        }
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
