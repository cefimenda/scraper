

var filter={
  list:[],
  run: function(){
    // filter.title();
    // filter.category();
    for (var i in allAuditions.list){
      var audition = allAuditions.list[i]
      if (checkSource(audition,input.source()) && checkTitle(audition,input.title()) && checkPlaybillCategory(audition,input.playbillCategory()) && checkBackstageCategory(audition,input.backstageCategory()) && checkState(audition,input.state()) && checkPaid(audition,input.paid())){
        filter.list.push(audition)
      }
    }
    filter.display()
  },
  hasNoResult: function(){
    if (filter.list.length==0){
      alert("There are no results that match your criteria. Please use a different filter and try again.")
      return true
    };
  },
  title:function(){
    if (input.title() == ""){return}
    for(var i in screen.list){
      var audition = screen.list[i];
      if (contains(audition.title,input.title())){
        filter.list.push(audition);
      };
    };
    filter.display()
  },
  category: function(){
    var thisCount = 0;
    var catInputList = input.category()
    if(catInputList.length == 0){return}
    for(var i in screen.list){
      var audition = screen.list[i];
      for(var n in catInputList){
        if(contains(audition.category,catInputList[n])){
          filter.list.push(audition)
        };
      };
    };
    filter.display()
  },
  display: function(){
    if (filter.hasNoResult()){
      screen.list = allAuditions.list;
      screen.display();
    }else{
      screen.list = filter.list;
      screen.display();
      filter.list = [];
    }
  }
};
//object that gets user inputs in different sections of the filterbar
var input ={
  source:function(){
    var checkedList = $('input[name="sourceCheck"]:checked').next();
    var sList = [];
    for(var i=0; i<checkedList.length ; i++){
      sList.push(checkedList[i].innerText.toLowerCase());
    }
    return sList
  },
  title:function(){ //returns the input in title input
    return $("#titleFilterInput").val().toLowerCase();
  },
  playbillCategory:function(){ //returns list of checked categories
    var checkedList = $('input[name="catCheckPlaybill"]:checked').next();
    var catList = [];
    for (var i = 0; i<checkedList.length;i++){
      catList.push(checkedList[i].innerText.toLowerCase());
    }
    return catList
  },
  backstageCategory:function(){
    var checkedList = $('input[name="catCheckBackstage"]:checked').next();
    var catList = [];
    for (var i = 0; i<checkedList.length;i++){
      catList.push(checkedList[i].innerText.toLowerCase());
    }
    return catList
  },
  state: function(){
    return $("#stateFilterInput").val().toLowerCase();
  },
  paid: function(){
    return $('#isAuditionPaid').find(":selected").text().toLowerCase()
  }
}
function checkSource(audition,condition){
  for(var n in condition){
    if(audition.source.toLowerCase() == condition[n]){
      return true
    }
  }
}
function checkTitle(audition,condition){
  if (condition ==""){return true}
  if (contains(audition.title,condition)){
    return true;
  };
}
function checkPlaybillCategory(audition,condition){
  if (condition.length == 0){return true}
  if (audition.source.toLowerCase() == "backstage"){return true}
  console.log(audition)
  console.log(condition)
  for(var n in condition){
    if(contains(audition.category,condition[n])){
      return true;
    };
  };
}
function checkBackstageCategory(audition,condition){
  if (condition.length == 0){return true}
  if (audition.source.toLowerCase() == "playbill"){return true}
  console.log(audition.tags)
  console.log(condition)
  for(var n in condition){
    for (var y in audition.tags){
      if(contains(audition.tags[y],condition[n])){
        return true;
      };
    };
  };
}
function checkState(audition,condition){
  if (condition ==""){return true}
  if(contains(audition.state,"nationwide")){return true}
  if (contains(audition.state,condition)){
    return true;
  };
}
function checkPaid(audition,condition){
  if (condition =="either"){return true};
  if(audition.compensation.toLowerCase()===condition){
    return true;
  }
}
function contains(target,condition){
  if (target == undefined){return false}
  if (target.toLowerCase().search(condition)>-1){
    return true
  }else{return false}
}


$(function(){
  $("#submitButton").on("click",function(){
    filter.run()
  });
})
