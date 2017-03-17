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
// get all data in form and return object
function getFormData() {
    var elements = document.getElementById("gform").elements; // all form elements
    var fields = Object.keys(elements).map(function(k) {
        if (elements[k].name !== undefined) {
            return elements[k].name;
            // special case for Edge's html collection
        } else if (elements[k].length > 0) {
            return elements[k].item(0).name;
        }
    }).filter(function(item, pos, self) {
        return self.indexOf(item) == pos && item;
    });
    var data = {};
    fields.forEach(function(k) {
        data[k] = elements[k].value;
        if (elements[k].type === "checkbox") {
            data[k] = elements[k].checked;
            // special case for Edge's html collection
        } else if (elements[k].length) {
            for (var i = 0; i < elements[k].length; i++) {
                if (elements[k].item(i).checked) {
                    data[k] = elements[k].item(i).value;
                }
            }
        }
    });
    console.log(data);
    return data;
}


function handleFormSubmit(event) { // handles form submit withtout any jquery
    event.preventDefault(); // we are submitting via xhr below
    document.getElementById('submit').disabled = true

    var data = getFormData(); // get the values submitted in the form

    var url = event.target.action;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    // xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        console.log(xhr.status, xhr.statusText)
        console.log(xhr.responseText);
        document.getElementById('submit').disabled = false
        document.getElementById('gform').style.display = 'none'; // hide form
        document.getElementById('thank_you_message').style.display = 'block';
        ga('send', {
            hitType: 'event',
            eventCategory: 'form',
            eventAction: 'submit',
            eventLabel: xhr.statusText,
            eventValue: xhr.status
        });
        return;
    };
    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&')
    xhr.send(encoded);
}

function loaded() {
    console.log('contact form submission handler loaded successfully');
    // bind to the submit event of our form
    var form = document.getElementById('gform');
    form.addEventListener("submit", handleFormSubmit, false);
};
document.addEventListener('DOMContentLoaded', loaded, false);
