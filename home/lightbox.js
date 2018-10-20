$(function () {
    $(".auditionsColumn").on("click", ".commentSection", function () {

        fillLightbox($(this));
        $("#lightbox").modal();
    })
    $("#postComment").on("click", function () {
        commentDB();
    });
})

function fillLightbox(target) {
    $("#lightboxTitle").empty();
    var data = JSON.parse(target.attr("data"))
    $("#lightbox").attr("data", JSON.stringify(data))
    $("#lightboxTitle").text(data.title)
    refreshComments();
}
function commentDB() {
    //code that sends comments to the server, which will save it in a Mongo db;
    var comment = {
        username: $("#commentName").val().trim(),
        comment: $("#userComment").val().trim(),
        auditionId: JSON.parse($("#lightbox").attr("data")).id
    }
    $.post("/api/newComment", comment, function (response) {
        $("#commentName").val("");
        $("#userComment").val("");
        refreshComments();
    });
}
function refreshComments() {
    //code that will send a get request to the server, which will return all the comments about this audition;
    $("#commentDisplay").empty();
    var id = JSON.parse($("#lightbox").attr("data")).id
    $.get(`/api/comments/${id}`, function (comments) {
        createComments(comments);
        setTimeout(function () {
            $('#lightboxBody').scrollTop($('#lightboxBody')[0].scrollHeight)
        }, 100);
    });
}
function createComments(comments) {
    //code that will display comments in a nice message like format;

    var container = $("#commentDisplay")
    for (var i in comments) {
        var comment = comments[i];
        var card = $("<div>").addClass("card shadow-sm m-2")
        container.append(card);

        var topRow = $("<div>").addClass("row");
        card.append(topRow);

        var topCol = $("<div>").addClass("col-12");
        topRow.append(topCol);

        var userName = $("<div>").addClass("badge badge-pill badge-info mx-1");
        userName.text(comment.username);
        topCol.append(userName);

        var bottomRow = $("<div>").addClass("row");
        card.append(bottomRow);

        var bottomCol = $("<div>").addClass("col-12");
        bottomRow.append(bottomCol);

        var commentBody = $("<div>").text(comment.comment).addClass("m-2")
        bottomCol.append(commentBody)


    }
}