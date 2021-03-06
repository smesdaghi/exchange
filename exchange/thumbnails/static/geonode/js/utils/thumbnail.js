/*
 * Create a thumbnal based on the center of an OL3 
 * map canvas.
 */

var getThumbnailPathFromUrl = function() {
    // determine the object type and id from the URL 
    var path_info = window.location.pathname.split('/').slice(-2)

    // put it together in a URL
    return '/thumbnails/' + path_info[0] + '/' + path_info[1];
}

var refreshThumbnail = function() {
        var thumb = $('#thumbnail');
        var time_str = (new Date()).getTime();
        thumb.attr('src', thumb.attr('src').split('?')[0] + '?.ck=' + time_str);
}

var createMapThumbnail = function() {
    var canvas = $('.ol-viewport canvas');

    // first, calculate the center 'thumbnail'
    //   of the image.
    var thumb_w = 240, thumb_h = 180;
    var w = canvas.width(), h = canvas.height();

    // create a temporary canvas for the 
    //  new thumbnail.
    var thumb_canvas = $('<canvas>').appendTo('body');
    thumb_canvas[0].width = thumb_w;
    thumb_canvas[0].height = thumb_h;
    thumb_canvas[0].getContext('2d').drawImage(canvas[0], 0, 0, w, h, 0, 0, thumb_w, thumb_h);

    // get the PNG for saving...
    var png_data = thumb_canvas[0].toDataURL('image/png');

    // and remove the element from the DOM.
    thumb_canvas.remove();

    var url = getThumbnailPathFromUrl();

    $.ajax({
        type: "POST",
        url: url,
        data: png_data,
        success: function(data, status, jqXHR) {
            refreshThumbnail();
            return true;
        }
    });
    return true;
}

var uploadThumbnail = function(inputId) {
    var url = getThumbnailPathFromUrl();

    var reader = new FileReader();

    var input = document.getElementById(inputId);

    // when the file reader gets the new file,
    //  send it up to the server.
    //reader.onload = function(e) {
    var upload = function() {
        $.ajax({
            type: "POST",
            url: url,
            data: input.files[0],
            processData: false,
            success: function(data, status, jqXHR) {
                refreshThumbnail();
            }
        });
    }


    // use jquery to normalize the event handling
    $('#'+inputId).on('change', function() {
        //reader.readAsBinaryString(input.files[0]);
        upload();
    });

    // use the click event to open the file upload dialog.
    $('#'+inputId).click();
    return true;
}
