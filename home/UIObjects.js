

var loadingCards={

    backstage:{
        card: function(){
            return $(".loadingCardBackstage")
        },
        button: function(){
            return $(".loadingButtonBackstage")
        },
        display:function(increment){
            $(".loadingCardBackstage").removeClass("d-none");
            loadingAnimation(loadingCards.backstage.card(),$(".backstageProgress"),increment,"backstage")
        },
        showButton:function(){
            $(".backstageBar").addClass("d-none");
            $(".loadingButtonBackstage").removeClass("d-none");
            $("#loadingTextBackstage").text("Backstage Loaded!");
            $("#loadingTextBackstage").addClass("text-center");
        },
        hide:function(){
            $(".loadingCardBackstage").addClass("d-none");
        },
        
    },
    playbill:{
        card: function(){
            return $(".loadingCardPlaybill")
        },
        button: function(){
            return $(".loadingButtonPlaybill")
        },
        display:function(increment){
            $(".loadingCardPlaybill").removeClass("d-none");
            loadingAnimation(loadingCards.playbill.card(),$(".playbillProgress"),increment,"playbill")
        },
        showButton:function(){
            $(".playbillBar").addClass("d-none")
            $(".loadingButtonPlaybill").removeClass("d-none");
            $("#loadingTextPlaybill").text("Playbill Loaded!")
            $("#loadingTextPlaybill").addClass("text-center")
        },
        hide:function(){
            $(".loadingCardPlaybill").addClass("d-none");
        },
    }
};

function loadingAnimation(loadingCard,progressBar,increment,source){

    if(allAuditions[source].length==0){
        progressBar.attr({
            "aria-valuenow" :increment,
        });
        progressBar.css({
            "width" : increment+"%",
        });
    }

  };

$(function(){


    $(".loadingButtonPlaybill").on("click",function(){
        allAuditions.createList(allAuditions.playbill)
        allAuditions.display()
        $(this).parent().hide()
    });
    $(".loadingButtonBackstage").on("click",function(){
        allAuditions.createList(allAuditions.backstage)
        allAuditions.display()
        $(this).parent().hide()
    });

});