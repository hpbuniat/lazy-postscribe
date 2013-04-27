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
         *
         * @return this
         */
        l: function(target, source, options) {
            var t = this, f = typeof postscribe === 'function';
            if (f && t.n() === true) {
                postscribe(target, source, options);
            }
            else {
                this.p.push([target, source, options]);
            }

            if (f === true) {
                t.c();
            }

            return t;
        },

        /**
         * The nbl-callback, which will clear the stack
         *
         * @return this
         */
        c: function() {
            var a, f, t = this;
            if (t.n() === false) {
                window.setTimeout(function() {
                    t.c();
                }, 100);
            }
            else {
                while(t.p.length > 0) {
                    a = t.p.shift();
                    postscribe(a[0], a[1], a[2]);
                }

                // When document.write was restored (after the last postscribe-activity), proceed with the callbacks
                while(t.f.length > 0) {
                    f = t.f.shift();
                    f();
                }
            }

            return t;
        },

        /**
         * Check if document.write is native code
         *
         * @return {Boolean}
         */
        n: function() {
            return (typeof document.write === "object" || (document.write.toString().indexOf('[native code]') > -1));
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
         *
         * @return this
         */
        a: function(f) {
            if (typeof f === "function") {
                this.f.push(f);
            }

            return this;
        }
    };
}(window, document));
