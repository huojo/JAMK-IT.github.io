// Shorthand for $( document ).ready()
$(function() {
    $.getJSON( "datacontent/courses.json", function( data ) {
        $.each(data.repositories, function(index, val){
            
            var repoUpdated = 'Couldnt fetch update info';
            var repoStars = 'X';
            var repoForks = 'X';
            var orderTime = 0;
            var apiGet = $.Deferred();
            
            //make sure that we will display something if getJSON fails or stalls
            setTimeout(function(){
                apiGet.resolve();
            }, 2000);
            
            var res = val.url.match(/^https:\/\/github.com\/(\S+)\/(\S+)$/);
            
            
            if(res){
                $.getJSON("https://api.github.com/repos/"+res[1]+"/"+res[2], function(data){
                    repoStars = data.stargazers_count;
                    repoForks = data.forks_count;
                    repoUpdated = $.timeago(data.pushed_at);
                    orderTime = new Date(data.pushed_at).getTime()/1000;
                    apiGet.resolve();
                });
            } else {
                apiGet.resolve();
            }
            
            $.when(apiGet).done(function(){
                if(repoStars !== 'X'){
                    $("#repositorylist").append('\
                    <div class="div3 div3-line-under div3-spaced text-left" data-reponame="' + val.name.toLocaleLowerCase() + '" data-timestamp="' + orderTime + '">\
                        <div class="text-item-link text-left no-margin"><i class="fa fa-chevron-right"></i> <span class="repolink" onclick="getModalInfo(\''+val.url+'\',true)">'+val.name+'</span></div>\
                        <div class="repoinfo">Updated '+ repoUpdated +'</div>\
                        <div class="repoinfo"><i class="fa fa-star" aria-hidden="true"></i> '+ repoStars +' <i class="fa fa-code-fork" aria-hidden="true"></i> ' + repoForks +'<span id="moreinfo" onclick="getModalInfo(\''+val.url+'\')"> <i class="fa fa-info-circle" aria-hidden="true"></i> More info</span></div>\
                    </div>\
                    ');
                } else {
                    $("#repositorylist").append('\
                    <div class="div3 div3-line-under div3-spaced text-left" data-reponame="' + val.name.toLocaleLowerCase() + '" data-timestamp="' + orderTime + '">\
                        <div class="text-item-link text-left no-margin"><i class="fa fa-chevron-right"></i> <span class="repolink" onclick="getModalInfo(\''+val.url+'\',true)">'+val.name+'</span></div>\
                        <div class="repoinfo"><span id="moreinfo" onclick="getModalInfo(\''+val.url+'\')"> <i class="fa fa-info-circle" aria-hidden="true"></i> More info</span></div>\
                    </div>\
                    ');
                }
                
                //This is a bit heavy way of displaying courses in update order
                //maybe something like this is beter? http://james.padolsey.com/javascript/sorting-elements-with-jquery/
                $("#repositorylist").html($('.div3').sort(function (a, b) {
                      var contentA =parseInt( $(a).data('timestamp'));
                      var contentB =parseInt( $(b).data('timestamp'));
                      return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
                   }));
            });
        });
    });
    
    $('[name=search]').on('keyup', function(){
        if($(this).val() == ''){
            $('[data-reponame]').show();
            return;
        }
        
        $('[data-reponame]').hide();
        $('[data-reponame*='+$(this).val().toLocaleLowerCase()+']').show();
    });
    
    $("#modal").click(function(){
        $('#modal').fadeOut();
    });
    
    $("#modalcontent").click(function(e){
        e.stopPropagation();
    });
    
    $("#modalfooter").click(function(e){
        e.stopPropagation();
    });
});

function getModalInfo(url, directlink){
    var resource = url.match(/^https:\/\/github.com\/(\S+)\/(\S+)$/);
    var manifesturl;
    
    if(resource){
        manifesturl = 'https://raw.githubusercontent.com/' + resource[1] + '/' + resource[2] + '/master/jamk_manifest.md';
    } else {
        manifesturl = url+'/jamk_manifest.md';
    }
    
    $.get(manifesturl, 
            function(data){
                if(directlink){
                    var targetRegex = data.match(/\[target_url=(\S+)\]/);
                    targetRegex ? window.location.replace(targetRegex[1]) : window.location.replace(url);
                    return;
                }
                showModal(data, url);
            }
        )
        .fail(function(){

                if(directlink){
                    window.location.replace(url);
                    return;
                }
        
            showModal('###No special information for this course :(', url);
        });
}

function showModal(modaldata, url){
    
    var targetRegex = modaldata.match(/\[target_url=(\S+)\]/);
    
    if(targetRegex){
        modaldata = modaldata.replace(/(\[target_url=\S+\])/,'');
        url = targetRegex[1];
    }
    
    var converter = new showdown.Converter();
    var html = converter.makeHtml(modaldata);
    
    $('#modalcontent').html(html);
    $('#modalfooter').html('<a href="'+url+'" class="button">Continue to course page</a>');
    $('#modal').fadeIn();
}
