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
        s: [],

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
                this.s.push([target, source, options]);
            }
        },

        /**
         * The nbl-callback, which will clear the stack
         */
        c: function() {
            while(this.s.length > 0) {
                var a = this.s.shift();
                postscribe(a[0], a[1], a[2]);
            }
        }
    };
}(window));
