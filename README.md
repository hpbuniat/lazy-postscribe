lazy-postscribe
=====

Idea
-----

When using [postscribe](https://github.com/krux/postscribe) as tag-writer, you're most likely creating a dependency in your document-head.
lazy-postscribe is a lightweight dependency, which can be included in your non-blocking js-loader-bundle.

'''lazy-postscribe''' also allows to use postscribe with another tag-writer.

Usage:
-----

Instead of calling postscribe directly, use:

    lp.l(element, html, options);

Add the callback to your js-loader (e.g. nbl):

    nbl.l(['postscribe.js', function() {
        lp.c();
    }]);

