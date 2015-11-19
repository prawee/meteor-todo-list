Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
    Session.set('hideCompleted',false);
    Template.body.helpers({
//        tasks:[
//            {text:"This is task 1"},
//            {text:"This is task 2"},
//            {text:"This is task 3"}
//        ]
        tasks:function(){
            if(Session.get("hideCompleted")){
                return Tasks.find({
                    checked:{$ne:true}
                },{
                    sort:{createdAt:-1},
//                    limit:5
                });
            }else{
                return Tasks.find({},{
                    sort:{createdAt:-1},
//                    limit:5
                });
            }
        },
        hidCompleted:function(){
            return Session.get("hideCompleted");
        },
        incompleteCount:function(){
            return Tasks.find({checked:{$ne:false}}).count();
        },
        allMission:function(){
            return Tasks.find().count();
        }

    });

    Template.body.events({
        "submit .new-task":function(event){
            event.preventDefault();
            var text=event.target.text.value;
            Tasks.insert({
                text:text,
                createdAt:new Date(),
                checked:false
            });

            event.target.text.value="";
        },
        "click .toggle-checked":function(){
            Tasks.update(this._id,{
                $set:{checked:!this.checked}
            });
        },
        "click .delete":function(){
            Tasks.remove(this._id);
        },
        "change .hide-completed input":function(event){
            Session.set('hideCompleted',event.target.checked);
        }
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
