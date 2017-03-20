/*
	Fractal by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

    skel.breakpoints({
        xlarge: '(max-width: 1680px)',
        large: '(max-width: 1280px)',
        medium: '(max-width: 980px)',
        small: '(max-width: 736px)',
        xsmall: '(max-width: 480px)',
        xxsmall: '(max-width: 360px)'
    });

    $(function() {

        var $window = $(window),
            $body = $('body');

        // Disable animations/transitions until the page has loaded.
        $body.addClass('is-loading');

        $window.on('load', function() {
            window.setTimeout(function() {
                $body.removeClass('is-loading');
            }, 100);
        });

        // Mobile?
        if (skel.vars.mobile)
            $body.addClass('is-mobile');
        else
            skel
            .on('-medium !medium', function() {
                $body.removeClass('is-mobile');
            })
            .on('+medium', function() {
                $body.addClass('is-mobile');
            });

        // Fix: Placeholder polyfill.
        $('form').placeholder();

        // Prioritize "important" elements on medium.
        skel.on('+medium -medium', function() {
            $.prioritize(
                '.important\\28 medium\\29',
                skel.breakpoint('medium').active
            );
        });

        // Scrolly.
        $('.scrolly')
            .scrolly({
                speed: 1500
            });

    });
})(jQuery);

// disable google maps wheel scroll until clicked
$('.maps').click(function() {
    $('.maps iframe').css("pointer-events", "auto");
});

$(".maps").mouseleave(function() {
    $('.maps iframe').css("pointer-events", "none");
});




// form summit
$(function() {
    // Variable to hold request
    var request;
    // Bind to the submit event of our form
    $("#gform").submit(function(event) {
        // Prevent default posting of form - put here to work in case of errors
        event.preventDefault();

        if (request) {
            // Abort any pending request
            request.abort();
        }
        var $form = $(this);

        // Let's select and cache all the fields
        var $inputs = $form.find("input, select, button, textarea");
        var serializedData = $form.serialize();

        // Let's disable the inputs for the duration of the Ajax request.
        // Note: we disable elements AFTER the form data has been serialized.
        // Disabled form elements will not be serialized.
        $inputs.prop("disabled", true);

        // Fire off the request
        request = $.ajax({
            //url: "/form.php",
            url: event.target.action,
            type: "post",
            data: serializedData
        });

        request.done(function(response, textStatus, jqXHR) {
            console.log("Success: " + textStatus + " data: " + response.data);

            $("#gform").hide();
            $("#thank_you_message").show();

            ga('send', {
                hitType: 'event',
                eventCategory: 'form',
                eventAction: 'submit',
                eventLabel: 'success',
            });
        });

        request.fail(function(jqXHR, textStatus, errorThrown) {
            // Log the error to the console
            console.error(
                "The following error occurred: " +
                textStatus, errorThrown
            );
            ga('send', {
                hitType: 'event',
                eventCategory: 'form',
                eventAction: 'error',
                eventLabel: textStatus + ", " + errorThrown,
            });
        });

        request.always(function() {
            // Reenable the inputs
            $inputs.prop("disabled", false);
        });

    });
});
