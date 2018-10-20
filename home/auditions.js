var auditions = []

var allAuditions = {
    playbill:[],
    playbillLoaded : false,
    getPlaybill:function(){
      var xhr = new XMLHttpRequest();
      xhr.open('GET','/api/playbill',true)
      xhr.send(null)
      xhr.onload = function(){
        if(xhr.status == 200){
          if(!xhr.responseText){
            console.log("Incoming NULL")
            return
          }
          console.log(xhr.responseText)
            var data = JSON.parse(xhr.responseText);
            if (isNaN(Number(data.value))){
              allAuditions.playbillLoaded = true;
              loadingCards.playbill.showButton()
              auditions.push(data);
              allAuditions.playbill = data;
            }else{
              setTimeout(allAuditions.getPlaybill,5000)
              loadingCards.playbill.display(data.value)
            }
        }else{
          alert("Server Unresponsive");
          return null;
        }
      }
      loadingCards.playbill.display();
    },
    backstage:[],
    backstageLoaded:false,
    getBackstage:function(){
      var xhr = new XMLHttpRequest();
      xhr.open('GET','/api/backstage',true)
      xhr.send(null)
      xhr.onload = function(){
        if(xhr.status == 200){
            var data = JSON.parse(xhr.responseText);
            if (isNaN(Number(data.value))){
              allAuditions.backstageLoaded = true;
              loadingCards.backstage.showButton()
              auditions.push(data);
              allAuditions.backstage = data;
            }else{
              setTimeout(allAuditions.getBackstage,5000)
              loadingCards.backstage.display(data.value)
            }
        }else{
          alert("Server Unresponsive");
          return null;
        }
      }
      loadingCards.backstage.display();
  },
    list: [],
    createList: function(newList){
      insertNewList(allAuditions.list,newList);
    },
    display: function(){
        screen.list = allAuditions.list
        screen.display()
    },
    clearDisplay: function(){
      $(".auditionsColumn").empty();
    }
}


function insertNewList(existingList,newList){
  if (existingList.length == 0){
    allAuditions.list = [];
    for (var i in newList){
      allAuditions.list.push(newList[i]);
    }
  }else{
    for (var i =0; i<newList.length;i++){
      incomingAudition = newList[i];
      incomingDate = incomingAudition.date

      incomingMonth = Number(incomingDate.split("/")[0]);
      incomingDay = Number(incomingDate.split("/")[1]);
      incomingYear = Number(incomingDate.split("/")[2]);
  
      for(var n=0; n<existingList.length;n++){
        existingAudition = existingList[n];
        existingDate = existingAudition.date;
        existingMonth = Number(existingDate.split("/")[0]);
        existingDay = Number(existingDate.split("/")[1]);
        existingYear = Number(existingDate.split("/")[2]);
  
        if (incomingYear>=existingYear && incomingMonth>=existingMonth && incomingDay>existingDay){
          existingList.splice(n,0,incomingAudition)
          break
        }else{continue}
      }
    }
  }
}

