function load_on_scroll(options = {}) {

    if (options.target == undefined) {
        options.target = window;
    }
    if (options.method == undefined) {
        options.method = "post";
    }
    if (options.data == undefined) {
        options.data = {};
    }

    if (options.data.page == undefined) {
        options.data.page = 1;
    }

    if (options.offset == undefined) {
        options.offset = 20;
    }


    var $element = $(options.target);
    if (options.clear === true) {
        $element.html("");
        options.clear = undefined;
    }

    var is_loading = false;
    function load(options = {}) {
        is_loading = true;

        if (window[`xhr_${options.target}`] != null) {
            window[`xhr_${options.target}`].abort();
        }
        $element.append("<div data-spinner class='d-flex justify-content-center my-5'><div  class='spinner-border'></div></div>");
        window[`xhr_${options.target}`] = $.ajax({
            type: options.method,
            url: options.url,
            data: options.data,
            success: function (response) {
                if (options.success != undefined) {
                    options.success(response);
                }
            },
            error: function (response) {
                if (options.error != undefined) {
                    options.error(response);
                }
            },
            complete: function (response) {
                $element.find("[data-spinner]").remove();
                is_loading = false;
                if (options.complete != undefined) {
                    options.complete(response);
                }
            }
        });
    }

    load(options);

    $element.off("scroll").scroll(function () {
        var is_window = (options.target === window);
        var scroll_top = $(this).scrollTop();
        var div_height = $(this).height();
        var scroll_height = is_window ? $(document).height() : $(this).prop('scrollHeight');


        if (scroll_top + div_height + options.offset >= scroll_height) {
            if (!is_loading || options.wait === false) {
                options.data.page++;
                options.wait = undefined;
                load(options);

            }

        }

    });
}