// Shorthand for $( document ).ready()
$(function() {
    var repoCountGet = new $.Deferred();
    $.getJSON( "datacontent/courses.json", function( data ) {
        $('#repositoriescount').text(data.repositories.length);
        repoCountGet.resolve();
    });
    
    var docuCountGet = new $.Deferred();
    $.getJSON( "datacontent/documents.json", function( data ) {
        $('#documentscount').text(data.documents.length);
        docuCountGet.resolve();
    });
    
    var showcaseCountGet = new $.Deferred();
    $.getJSON( "datacontent/showcases.json", function( data ) {
        $('#showcasescount').text(data.showcases.length);
        showcaseCountGet.resolve();
    });
    
    $.when(repoCountGet, docuCountGet, showcaseCountGet).done(function(){
        $('.number').each(function () {
            $(this).prop('Counter',0).animate({
                Counter: $(this).text()
            }, {
                duration: 1000,
                easing: 'swing',
                step: function (now) {
                    $(this).text(Math.ceil(now));
                }
            });
        });
    });
});