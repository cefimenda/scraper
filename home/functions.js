//auditionList format = [Title,Category,Organization,State,Paid?,Date,link,identifier]


$(function () {
  allAuditions.getPlaybill();
  allAuditions.getBackstage();

});

function clickMinimize() {
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
function clickExpand() {
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


//All commands to display auditions on screen will fall to the screen object. screen.list will always be updated to reflect all auditions displayed on screen.
var screen = {
  list: [],
  display: function () {
    $(".auditionsColumn").empty();
    displayCardsInList(screen.list)
    $(".auditionCount").text(screen.list.length + " Auditions Scavenged")
  },
}

function displayCardsInList(list) {
  for (var i in list) {
    displayCard(list[i])
  }
};
function displayCard(audition) {
  var container = $(".auditionsColumn");

  var cardRow = $("<div>").addClass("row shadow rounded my-2");
  container.append(cardRow);

  var cardCol = $("<div>").addClass("col-12 card auditionCard py-3");
  cardRow.append(cardCol);

  var topRow = $("<div>").addClass("row");
  cardCol.append(topRow);

  var tagsCol = $("<div>").addClass("col-10 tags float-left");
  topRow.append(tagsCol);

  var sourceDiv = $("<div>").addClass("source mx-1 badge badge-warning");
  sourceDiv.text("Source: " + audition.source);
  tagsCol.append(sourceDiv);

  if (audition.category != undefined) {
    var categoryDiv = $("<div>").addClass("category mx-1 badge badge-info");
    categoryDiv.text("Category: " + audition.category);
    tagsCol.append(categoryDiv);
  }

  var tagDiv = $("<div>").addClass("tag mx-1 badge badge-info");
  tagDiv.text(audition.tags);
  tagsCol.append(tagDiv);

  var unionDiv = $("<div>").addClass("union mx-1 badge badge-danger");
  unionDiv.text(audition.union);
  tagsCol.append(unionDiv);

  var compensationCol = $("<div>").addClass("col-2 compensation");
  topRow.append(compensationCol);

  var paidDiv = $("<div>").addClass("compensation badge badge-success float-right mt-1");
  paidDiv.html("<h6>" + audition.compensation + "</h6>");
  compensationCol.append(paidDiv);

  var titleRow = $("<div>").addClass("row");
  cardCol.append(titleRow);

  var titleDiv = $("<div>").addClass("col-10 mb-3 auditionTitle");
  titleDiv.html("<h4><a href ='" + audition.link + "' target='_blank'>" + audition.title + "</a></h4>");
  titleRow.append(titleDiv);

  var placeholderDiv = $("<div>").addClass("col-2 mb-3 commentSection text-right");
  titleRow.append(placeholderDiv);
  placeholderDiv.append("<i class='far fa-comments mt-3'></i>")
  placeholderDiv.attr('data',JSON.stringify(audition))

  var locationRow = $("<div>").addClass("row");
  cardCol.append(locationRow);

  var locationCol = $("<div>").addClass("col-8 location float-left");
  locationCol.text(audition.organization);
  locationRow.append(locationCol);

  var dateCol = $("<div>").addClass("col-4 date");
  dateCol.html("<div class = 'float-right'>" + audition.date + "</div>");
  locationRow.append(dateCol);
};