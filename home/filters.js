

var filter={
  list:[],
  run: function(){
    // filter.title();
    // filter.category();
    for (var i in allAuditions.list){
      var audition = allAuditions.list[i]
      if (checkTitle(audition,input.title()) && checkCategory(audition,input.category()) && checkState(audition,input.state()) && checkPaid(audition,input.paid())){
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
  title:function(){ //returns the input in title input
    return $("#titleFilterInput").val().toLowerCase();
  },
  category:function(){ //returns list of checked categories
    var checkedList = $("input:checked").next();
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

function checkTitle(audition,condition){
  if (condition ==""){return true}
  if (contains(audition.title,condition)){
    return true;
  };
}
function checkCategory(audition,condition){
  if (condition.length == 0){return true}
  for(var n in condition){
    if(contains(audition.category,condition[n])){
      return true;
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
  if(audition.paid.toLowerCase()===condition){
    return true;
  }
}
function contains(target,condition){
  if (target.toLowerCase().search(condition)>-1){
    return true
  }else{return false}
}


$(function(){
  $("#submitButton").on("click",function(){
    filter.run()
  });
})





function listSelector(){ //this will become a way to seperate "AND" filters from "OR" filter --> "AND" filter uses filteredList, "OR" filter uses auditionList
  if (filteredList.isEmpty){
      return auditionList
  }else return filteredList
}

function objectTransfer(origin, target){
//for OR Filter
/*
for (item in origin){
  target[item] = origin[item]
}*/
//for AND Filter
  target = {}
  for (item in origin){
      target[item] = origin[item]
  }
  filteredList = target
  return filteredList
}

function activateFilter(){
  andFilter = {}
  andFilter['isEmpty'] = false

  filteredList = {}
  filteredList.isEmpty = true

  //syncronous filters

  filterTitle(listSelector(),undefined,andFilter)
  andFilter = {}
  andFilter['isEmpty'] = false
  filterCategory(listSelector(),andFilter)
  andFilter = {}
  andFilter['isEmpty'] = false
  filterState(listSelector(),andFilter)
  andFilter = {}
  andFilter['isEmpty'] = false
  filterPaid(listSelector(),andFilter)


  //async filters
  // if (isAsyncNecessary()){
  //   var collector = {}
  //   collector['isEmpty'] = false
  //   $("#loadingBox").show()
  //   $("#filterBox").hide()
  //   for (var auditionNumber in listSelector()){
  //       var audition = auditionList[auditionNumber]
  //       runAsyncFilters(audition,listSelector(),collector)
  //   }
  // }
  $("#auditionsTable").show()
  $(".warningMessage").hide()
  displayFilteredTable(filteredList)
  clickMinimize()
}

function isAsyncNecessary(){
  if ($("#descriptionFilterInput").val()!= undefined && ("#keywordFilterInput1").val() != undefined ){
    var descriptionInput = $("#descriptionFilterInput").val().toLowerCase()
    var keywordInput = $("#keywordFilterInput1").val()

    if (keywordInput != "" || descriptionInput != ""){
      return true
    }
    else return false
  } else return false
}
function runAsyncFilters(audition,filteredList,collector){
  var link = "http://www.playbill.com"+audition.link
  $.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent(link) + '&callback=?', function(data){
    var HTMLString = data.contents
    var description = isolateDescription(HTMLString)
    collector = filterDescription(audition,undefined,description,filteredList,collector)
    //============
    var keywordCount = Number(localStorage.getItem("keywordIndex"))
    for (var i = 1 ; i <= keywordCount ; i++){
      filterKeyword(audition,i,keywordCount,description,filteredList, collector) //for multiple filters it collects the audition if keyword1 OR keyword2 exists in the title OR the description of audition
    }
    //=============
    setTimeout(removeLoadingBox,3000)
    displayFilteredTable(collector)
  });
}
function removeLoadingBox(){
$("#loadingBox").hide()
}

function displayFilteredTable(filteredList){
  if (filteredList.isEmpty){
    var table = displayTable(auditionList)
    $(".auditionCount").html(String(((table.rows).length)-1)+" Auditions Listed")
  } else if (Object.keys(filteredList).length < 2){
    $("#auditionsTable").hide()
    $(".warningMessage").show()
  } else {
    var table = displayTable(filteredList)
    $(".auditionCount").html(String(((table.rows).length)-2)+" Auditions Listed")
    $("#rowNumber1").hide() // hides the row that was created due to filteredList.isEmpty = 'false'
  }
  $("#filterBox").hide()
  filteredList = {}
  filteredList.isEmpty = true
}

function filterTitle(auditionList, condition,andFilter){
  if (condition == undefined){
    var titleInput = $("#titleFilterInput").val().toLowerCase()
  } else{
    var titleInput = condition
  }
  if (titleInput != ""){
    for (i in auditionList){
      if (auditionList[i].title == undefined){continue}
      var title = auditionList[i].title.toLowerCase()
      if (title.search(titleInput)>-1 || title == titleInput){
        andFilter[i] = auditionList[i]
      }
    }
    objectTransfer(andFilter,filteredList)
  }
}

function filterCategory(auditionList,andFilter){
  var checkedList = []
  var optionsList = ['Performer','Technical','Other','Administrative','Editorial/Writing','Directorial','Design','Internship','Classes','Non-Theatrical','Academic/Instructor','Coaching','Musician','Festival/Competition Submissions']
  var index = 1
  $.each(optionsList,function(){
    if ($("input[id = checkbox"+index+"]").prop('checked') == true){
      checkedList.push(($('label[id = checkboxLabel'+index+']').html().split(`
        <input type="checkbox"`)[0]))
    }
    index++
  });
  if (checkedList.length != 0 && checkedList.length != 10){
    for (i in auditionList){
      if (auditionList[i].title == undefined){continue}
      if(checkedList.indexOf(auditionList[i].category)>-1){
        andFilter[i] = auditionList[i]
      }
    }
    objectTransfer(andFilter,filteredList)
  }
}

function filterState(auditionList,andFilter){
  var stateInput = $("#stateFilterInput").val().toLowerCase()
  if (stateInput != ""){
    for (i in auditionList){
      if (auditionList[i].title == undefined){continue}
      var state = auditionList[i].state.toLowerCase()
      if (state.search(stateInput) > -1){
        andFilter[i] = auditionList[i]
      }
    }
    objectTransfer(andFilter,filteredList)
  }
}

function filterPaid(auditionList,andFilter){
  var paidInput = $("#isAuditionPaid").find(":selected").text()
  if (paidInput != "Either"){
    for (i in auditionList){
      if (auditionList[i].title == undefined){continue}
      var paid = auditionList[i].paid
      if(paid.search(paidInput)>-1)
      andFilter[i] = auditionList[i]
    }
    objectTransfer(andFilter,filteredList)
  }
}

function filterDescription(audition,condition,description,filteredList,collector){
  //check if condition is provided within argumentList
  if (condition == undefined){
    var descriptionInput = $("#descriptionFilterInput").val().toLowerCase()
  } else{
    var descriptionInput = condition
  }
  if (descriptionInput !=""){ // checks if the description input is blank
    var result = checkDescription (description, descriptionInput)
    if (result == true){
      collector[audition.identifier] = audition
    }
  }return collector
}

function getHTMLString(link){
  $.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent(link) + '&callback=?', function(data){
    var HTMLString = data.contents
    var description = isolateDescription(HTMLString)
    return HTMLString
  });
}
function isolateDescription(HTMLString){
  var data1 = JSON.stringify(HTMLString.split("<h4>DESCRIPTION</h4>")[1])
  var truData = JSON.stringify(data1.split("</section>")[0])
  return truData
}

function checkDescription(description,descriptionInput){
  if (description.toLowerCase().search(descriptionInput) > -1){
    return true
  }else return false
}

function addToFilteredAuditions(audition,filteredAuditions){
  filteredAuditions[audition.identifier] = audition
  return filteredAuditions
}

function addKeyword(){
  var i = Number(localStorage.getItem("keywordIndex"))
  i++
  var currentContent = $(".filterInputContainer").html()
  var endingHTML = `<button class = action type = "button" id = "submitButton" onclick = "activateFilter()">Activate Filter</button>
  <button class = action type = "button" id = "displayFilteredTableButton" onclick = "displayFilteredTable()">Display Table</button>
  <button class = action type = "button" id = "addKeywordButton" onclick="addKeyword()">Add Keyword to Filter</button>
  <button class = action type = "button" id = "removeKeywordButton" onclick="removeKeyword()">Remove Last Keyword</button>
  `
  var newContent = `<label for = "filterField" class = "filterLabel">Filter Keyword </label><input class = "filterInput" id = "keywordFilterInput`+i+`"></input>`
  $(".filterInputContainer").html(currentContent.split("<button")[0]+newContent+endingHTML)
  localStorage.setItem("keywordIndex",i)
}

function removeKeyword(){
  var i = Number(localStorage.getItem("keywordIndex"))
  var currentContent = $(".filterInputContainer").html()
  var endingHTML = `<button class = action type = "button" id = "submitButton" onclick = "activateFilter()">Activate Filter</button>
  <button class = action type = "button" id = "displayFilteredTableButton" onclick = "displayFilteredTable()">Display Table</button>
  <button class = action type = "button" id = "addKeywordButton" onclick="addKeyword()">Add Keyword to Filter</button>
  <button class = action type = "button" id = "removeKeywordButton" onclick="removeKeyword()">Remove Last Keyword</button>
  `
  var keywordRemovedHTML = currentContent.split(`<label for="filterField" class="filterLabel">Filter Keyword </label><input class="filterInput" id="keywordFilterInput`+i+`">`)[0]
  if (keywordRemovedHTML == currentContent){
    alert("No Keyword to Remove")
    return
  }
  $(".filterInputContainer").html(keywordRemovedHTML+endingHTML)
  i--
  localStorage.setItem("keywordIndex",i)
}

function filterKeyword(audition,index,keywordCount,description,filteredList,collector){
  if (keywordCount == 0){return}
  var keywordInput = $("#keywordFilterInput"+index).val().toLowerCase()
  if (keywordInput == ""){return}
  if (audition.title.search(keywordInput)>-1 || audition.title == keywordInput){
    collector[audition.identifier] = audition
  }
  collector = filterDescription(audition,keywordInput,description,filteredList,collector)
  return collector
}
