/*!
 * lazy-postscribe
 *
 * A simple wrapper to use postscribe with a non-blocking js-loader
 *
 * @author Hans-Peter Buniat <hpbuniat@googlemail.com>
 * @copyright 2012 Hans-Peter Buniat <hpbuniat@googlemail.com>
 * @license http://opensource.org/licenses/BSD-3-Clause
 */

/*global window, postscribe */
;(function(window) {
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
            while(this.p.length > 0) {
                var a = this.p.shift();
                postscribe(a[0], a[1], a[2]);
            }

            while(this.f.length > 0) {
                var f = this.f.shift();
                f();
            }
        },

        /**
         * Get the size of the stack
         *
         * @return int
         */
        s: function() {
            return this.s.length;
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
}(window));
