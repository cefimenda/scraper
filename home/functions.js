//auditionList format = [Title,Category,Organization,State,Paid?,Date,link,identifier]

$(function(){

  localStorage.setItem("keywordIndex",0)
  //auditionList = getPlayBillAuditions()
  var displayedAuditions = auditionList
  var table = displayTable(displayedAuditions)
  $(".auditionCount").html(String(((table.rows).length)-1)+" Auditions Listed")
  $("#filterButton").click(function(){
    $("#filterBox").show()
  });
  $(".closeCursor").click(function(){
    $("#filterBox").hide()
  });
  $("#refreshButton").click(function(){
    $("#refreshButton").html("Refresh Table")
    $(".jumbotronRow").hide()
    $("#loadingBox").show()
    $(".auditionTableContainer").hide()
    console.log($("#loadingBox").css("display"))
    getAuditionList()
  });
  $('.table > tbody > tr').click(function() {
    console.log($(this))
    var href = $(this).children(".hiddenLink").last().val()
    console.log(href)
    window.open(href)
  });
  $('#expandFilters').click(function(){
    clickExpand()
  });
  $("#minimize").click(function(){
    clickMinimize()
  })
});

function clickMinimize(){
  $(".filterBar").removeClass("col-sm-12")
  $(".filterBar").addClass("col-sm-2")
  $(".tableColumn").show()
  $("#expandFilters").show()
  $('#minimize').hide()
  $('.no-mini').addClass('d-none')
  $(".filterBar").css({
    "position": "fixed"
  });
}
function clickExpand(){
  $(".filterBar").removeClass("col-sm-2");
  $(".filterBar").addClass("col-sm-12");
  $(".filterBar").css({
    "position": "static"
  });
  $(".tableColumn").hide();
  $("#expandFilters").hide();
  $('#minimize').show();
  $('.no-mini').removeClass('d-none');

}

function loadingAnimation(){
  
  if ($("#loadingBox").css('display') != 'none'){
    setTimeout(changeLoadingText,500)
    var currentValue = $(".progress-bar").attr("aria-valuenow");
    console.log(currentValue)
    $(".progress-bar").attr({
      "aria-valuenow" : String(Number(currentValue)+30),
    });
    $(".progress-bar").css({
      "width" : String(Number(currentValue)+30),
    });
  }
}
function changeLoadingText(){
  console.log('changing text')
  var currentContent = $("#loadingText").html()
  if (currentContent == "Loading..."){
    $("#loadingText").html("Loading")
  }else{
    $("#loadingText").html(currentContent+".")
  }
  loadingAnimation()
}

//Functions for Scraping PlayBill

function getAuditionList(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET','/scrape',true)
  xhr.send(null)
  xhr.onload = function(){
      if(xhr.status == 200){
          var data = JSON.parse(xhr.responseText);
          auditionList = data
          var displayedAuditions = auditionList
          console.log(displayedAuditions)
          localStorage.setItem("displayedAuditions",JSON.stringify(displayedAuditions))
          var table = displayTable(displayedAuditions)
          $(".auditionCount").html(String(((table.rows).length)-1)+ " Auditions Listed")
          $("#loadingBox").hide()
          $(".auditionTableContainer").show()
          $(".progress-bar").attr({
            "aria-valuenow" : "100"
          });
          $(".progress-bar").css({
            "width" : "100%"
          });
          return data
      }else {
          console.log("cevap gelmedi")
          alert("Server Unresponsive")
          $("#loadingBox").hide()
      }
  }

  // $.getJSON("/", function(data){
  //   auditionList = data
  //   var displayedAuditions = auditionList
  //   console.log(displayedAuditions)
  //   localStorage.setItem("displayedAuditions",JSON.stringify(displayedAuditions))
  //   var table = displayTable(displayedAuditions)
  //   $(".auditionCount").html("Number of Auditions: "+String(((table.rows).length)-1))
  //   $("#loadingBox").hide()
  //   return data
  // });
  console.log('Animation should start now')
  loadingAnimation()
}

function getPlayBillAuditions(){
  var url = "http://www.playbill.com/job/listing"
  $.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?', function(data){
  localStorage.setItem("playBillData",data.contents)
});
  var valueList = []
  var str = localStorage.getItem("playBillData");
  var list1 = str.split('<span class="data-value">')
  for (i = 1; i < list1.length;i++){
    var value = list1[i].split("</span>")[0]
    valueList.push(value)
  }
  auditionList = reorganize(valueList)
  return auditionList
}

function reorganize(valueList){
  var audition = {}
  var keyList = ["title","category","organization","state","paid?","date","link"]
  var str = localStorage.getItem("playBillData");
  var linkList1 = str.split(`<td data-label="Title" class="col-0">`)
  var linkListFin = []
  for (i = 1; i < linkList1.length;i++){
    var linkValue = linkList1[i].split('" modifierClass')[0]
    var linkValue1 = linkValue.split('href="')[1]
    linkListFin.push(linkValue1)
    }
  var i = 0
  while(i < valueList.length/6){
    auditionList["audition"+i] = {title:valueList[0+i*6], category:valueList[1+i*6], organization:valueList[2+i*6], state:valueList[3+i*6], paid:valueList[4+i*6], date:valueList[5+i*6],link:linkListFin[i],identifier:"audition"+i}
    i ++
  }
  return auditionList
}

// Table related functions

function displayTable(auditionList){
  resetTable()
  addToTable(auditionList)
  var table = insertRowId()
  return table
}
function resetTable(){

  var tbody = $("#auditionsTable").children().first().next();
  tbody.remove();
  $("#auditionsTable").append("<tbody></tbody>")
  console.log($("#auditionsTable").html())
}
function addToTable(auditionList){
  var tbody = $("#auditionsTable").children().first().next()
  for(i in auditionList){
    var audition = auditionList[i]
    var title = audition.title
    var category = audition.category
    var organization = audition.organization
    var state = audition.state
    var paid = audition.paid
    var date = audition.date
    var link = audition.link
    var fullLink =  'http://www.playbill.com'+link
    tbody.append("<tr><td><a href="+fullLink+" target = '_blank' class = 'tableLink text-dark'>"+ title +"</a></td><td>"+category+"</td><td>"+organization+"</td><td>"+state+"</td><td>"+paid+"</td><td>"+date+"</td><td class = 'hiddenLink'><button class = action type = 'Button' id = 'backButton' onclick = openPage(" + JSON.stringify(link) + ")> Go To Page </button></td><td class = 'hiddenLink'>http://www.playbill.com" + link + "</td></tr>")
    console.log("adding to table")
  }console.log('added to table')
}

function openPage(link){
  window.open("http://www.playbill.com"+link)
}

function insertRowId(){
  var table = document.getElementById("auditionsTable");
  for (var i = 0, row; row = table.rows[i]; i++) {
    row.setAttribute("id", "rowNumber"+JSON.stringify(i), 0);
     //iterate through rows
     //rows would be accessed using the "row" variable assigned in the for loop
     for (var j = 0, col; col = row.cells[j]; j++) {

       //iterate through columns
       //columns would be accessed using the "col" variable assigned in the for loop
     }
  }
  //console.log((table.rows).length)
  //console.log($("#rowNumber50").text())
  //access any specific row with id "#rowNumber50" - available outside of function
  return table
}
