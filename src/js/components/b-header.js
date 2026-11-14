$(".burger").click(function () {
    $(".header").toggleClass("_open")
    $("body").toggleClass("fixed-body")
})

$(".catalog-btn").click(function () {
    if(window.innerWidth<=992){
        return
    }
    $(".header").toggleClass("_open-catalog")
    $("body").toggleClass("fixed-body")
})

$(document).mouseup( function(e){
    let div = $( ".header-catalog" );
    if ( !div.is(e.target)
        && div.has(e.target).length === 0 ) {
        if($(".header").hasClass("_open-catalog")){
            $(".header").removeClass("_open-catalog")
        }
    }
});
