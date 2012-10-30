lazy-postscribe
=====

Idea
-----

When using [postscribe](https://github.com/krux/postscribe) as tag-writer, you're most likely creating a dependency in your documents head.
With lazy-postscribe you'll have a lightweight dependency for your head, which should be included in your non-blocking js-loader-bundle.

Usage:
-----

Instead of calling postscribe directly, use:

    lp.l(element, html, options);

Furthermore add the callback to your js-loader (e.g. nbl):

    nbl.l(['postscribe.js', function() {
        lp.c();
    }];

