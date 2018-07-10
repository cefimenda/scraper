

var loadingCards={

    backstage:{
        card: function(){
            return $(".loadingCardBackstage")
        },
        button: function(){
            return $(".loadingButtonBackstage")
        },
        display:function(){
            $(".loadingCardBackstage").removeClass("d-none");
            loadingAnimation(loadingCards.backstage.card(),$(".backstageProgress"),2,"backstage")
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
        display:function(){
            $(".loadingCardPlaybill").removeClass("d-none");
            loadingAnimation(loadingCards.playbill.card(),$(".playbillProgress"),10,"playbill")
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
    setTimeout(function(){
        if(allAuditions[source].length==0){
            var currentValue = progressBar.attr("aria-valuenow");
            progressBar.attr({
                "aria-valuenow" : String(Number(currentValue)+increment),
            });
            progressBar.css({
                "width" : String(Number(currentValue)+increment),
            });
            loadingAnimation(loadingCard,progressBar,increment,source)
        }
    },500);
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