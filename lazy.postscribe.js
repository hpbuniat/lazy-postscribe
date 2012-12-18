/*!
 * lazy-postscribe
 *
 * A simple wrapper to use postscribe with a non-blocking js-loader
 *
 * @author Hans-Peter Buniat <hpbuniat@googlemail.com>
 * @copyright 2012 Hans-Peter Buniat <hpbuniat@googlemail.com>
 * @license http://opensource.org/licenses/BSD-3-Clause
 */

/*global window, document, postscribe */
;(function(window, document) {
    "use strict";

    window.lp = {
        /**
         * The stack for postscribe calls, until postscribe is ready
         */
        p: [],

        /**
         * Callback stack for functions
         */
        f: [],

        /**
         * Proxy for postscribe.
         * - use the stack, until postscribe is ready
         *
         * @param target
         * @param source
         * @param options
         */
        l: function(target, source, options) {
            if (typeof postscribe === 'function') {
                postscribe(target, source, options);
            }
            else {
                this.p.push([target, source, options]);
            }
        },

        /**
         * The nbl-callback, which will clear the stack
         */
        c: function() {
            var a;
            while(this.p.length > 0) {
                a = this.p.shift();
                postscribe(a[0], a[1], a[2]);
            }

            this.b();
        },

        /**
         * Check if document.write is native code
         *
         * @return {Boolean}
         */
        n: function() {
            return (document.write.toString().indexOf('[native code]') > -1);
        },

        /**
         * When document.write was restored (after the last postscribe-activity), proceed with the callbacks
         */
        b: function() {
            var f, t = this;
            if (this.n() === false) {
                window.setTimeout(function() {
                    t.b();
                }, 100);
            }
            else {
                while(this.f.length > 0) {
                    f = this.f.shift();
                    f();
                }
            }
        },

        /**
         * Get the size of the stack
         *
         * @return int
         */
        s: function() {
            return this.p.length;
        },

        /**
         * Add a callback
         *
         * @param f
         */
        a: function(f) {
            if (typeof f === "function") {
                this.f.push(f);
            }
        }
    };
}(window, document));
