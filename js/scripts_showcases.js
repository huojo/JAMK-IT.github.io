// Shorthand for $( document ).ready()
$(function() {
    $.getJSON( "datacontent/showcases.json", function( data ) {
        $.each(data.showcases, function(index, val){
            var img_url = val.image_url || "http://placehold.it/350x150";
            $("#showcaselist").append('\
            <div class="div3 div3-lines">\
                <a href="' + val.url + '">\
                <div id="showcaseimgcontainer"><img src="' + img_url +'"></div>\
                <div class="text-item-link"><i class="fa fa-chevron-right"></i>'+val.name+'</div></a>\
                <div class="text-item">' + val.description + '</div>\
            </div>\
            ');
        });
    });
});