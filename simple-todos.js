Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
    Meteor.subscribe("tasks");

    Session.set('hideCompleted',false);
    Template.body.helpers({
        tasks:function(){
            if(Session.get("hideCompleted")){
                return Tasks.find({
                    checked:{$ne:true}
                },{
                    sort:{createdAt:-1}
                });
            }else{
                return Tasks.find({},{
                    sort:{createdAt:-1}
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
        "submit .new-task": function (event){
            event.preventDefault();
            var text=event.target.text.value;
            /*Tasks.insert({
                text:text,
                createdAt:new Date(),
                checked:false,
                owner:Meteor.userId(),
                username:Meteor.user().username
            });*/
            Meteor.call("addTask", text);


            event.target.text.value="";
        },
        "click .toggle-checked":function(){
            /*Tasks.update(this._id,{
                $set:{checked:!this.checked}
            });*/
            Meteor.call("setChecked",this._id,!this.checked);
        },
        "click .delete":function(){
            /*Tasks.remove(this._id);*/
            Meteor.call("deleteTask",this._id);
        },
        "change .hide-completed input":function(event){
            Session.set('hideCompleted',event.target.checked);
        },
        "click .toggle-private":function(){
            Meteor.call("setPrivate",this._id,!this.private);
        }
    });

    Template.task.helpers({
        isOwner:function(){
            return this.owner === Meteor.userId();
        }
    });

    Accounts.ui.config({
        passwordSignupFields:"USERNAME_ONLY"
    });
}

Meteor.methods({
    addTask:function(text) {
        if(!Meteor.userId()){
            throw new Meteor.Error('not-authorized');
        }

        Tasks.insert({
            text: text,
            createdAt:new Date(),
            checked:false,
            owner:Meteor.userId(),
            username:Meteor.user().username
        });
    },
    deleteTask:function(taskId){
        var task=Tasks.findOne(taskId);
        if(task.private && task.owner !== Meteor.userId()){
            throw new Meteor.Error("not-authorized");
        }
        Tasks.remove(taskId);
    },
    setChecked:function(taskId,setChecked){
        var task=Tasks.findOne(taskId);
        if(task.private && task.owner !== Meteor.userId()){
            throw new Meteor.Error("not-authorized");
        }
        Tasks.update(taskId,{$set:{checked:setChecked}});
    },
    setPrivate:function(taskId,setToPrivate){
        var task=Tasks.findOne(taskId);
        if(task.owner !== Meteor.userId()){
            throw new Meteor.Error("not-authorized");
        }
        Tasks.update(taskId,{$set:{private:setToPrivate}});
    }
});

if (Meteor.isServer) {
  Meteor.publish("tasks",function(){
      return Tasks.find({
          $or:[
              {private:{$ne:true}},
              {owner:this.userId}
          ]
      });
  });
}
