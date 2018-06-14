//auditionList format = [Title,Category,Organization,State,Paid?,Date,link,identifier]

$(function(){

  localStorage.setItem("keywordIndex",0)
  //auditionList = getPlayBillAuditions()
  var displayedAuditions = auditionList
  var table = displayTable(displayedAuditions)
  $(".auditionCount").html("Number of Auditions: "+String(((table.rows).length)-1))
  $("#filterButton").click(function(){
    $("#filterBox").show()
  });
  $(".closeCursor").click(function(){
    $("#filterBox").hide()
  });
  $("#refreshButton").click(function(){
    $("#refreshButton").html("Refresh Table")
    $("#loadingBox").show()
    console.log($("#loadingBox").css("display"))
    getAuditionList()
  });
});

function loadingAnimation(){
  if ($("#loadingBox").css('display') != 'none'){
    setTimeout(changeLoadingText,500)
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
          var data = xhr.responseText;
          console.log(response)
          auditionList = data
            var displayedAuditions = auditionList
            console.log(displayedAuditions)
            localStorage.setItem("displayedAuditions",JSON.stringify(displayedAuditions))
            var table = displayTable(displayedAuditions)
            $(".auditionCount").html("Number of Auditions: "+String(((table.rows).length)-1))
            $("#loadingBox").hide()
            return data
      }else {
          console.log( "cevap gelmedi")
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
  $("#auditionsTable").html(`    <tr>
        <th><strong>Title</strong></th>
        <th><strong>Category</strong></th>
        <th><strong>Organization</strong></th>
        <th><strong>State</strong></th>
        <th><strong>Paid?</strong></th>
        <th><strong>Date Posted</strong></th>
        <th><strong>Link</strong></th>
      </tr>`)
}
function addToTable(auditionList){
  var currentContent = $("#auditionsTable").html()
  for(i in auditionList){
    var audition = auditionList[i]
    var title = audition.title
    var category = audition.category
    var organization = audition.organization
    var state = audition.state
    var paid = audition.paid
    var date = audition.date
    var link = audition.link
    $("#auditionsTable").html(currentContent + "<tr><td>"+ title +"</td><td>"+category+"</td><td>"+organization+"</td><td>"+state+"</td><td>"+paid+"</td><td>"+date+"</td><td><button class = action type = 'Button' id = 'backButton' onclick = openPage(" + JSON.stringify(link) + ")> Go To Page </button></td><td class = 'hiddenLink'>http://www.playbill.com" + audition[6] + "</td></tr>")
    currentContent = $("#auditionsTable").html()
  }
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
