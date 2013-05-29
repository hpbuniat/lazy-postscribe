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
         * A semaphore to indicate, that the settimeout-callback is active
         *
         * @var boolean
         */
        sem: false,

        /**
         * The stack for postscribe calls, until postscribe is ready
         *
         * @var array
         */
        p: [],

        /**
         * Callback stack for functions
         *
         * @var array
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
            var t = this;
            if (t.pf(false) && t.n() === true) {
                try {
                    postscribe(target, source, options);
                }
                catch(e) {}
            }
            else {
                this.p.push([target, source, options]);
            }

            if (t.pf(false)) {
                t.c();
            }

            return t;
        },

        /**
         * The nbl-callback, which will clear the stack
         *
         * @return this
         */
        c: function(s) {
            var a, t = this;

            if (s === true || t.sem === false) {
                t.sem = false;

                if (t.n() === false) {
                    t.t();
                }
                else if (t.pf(false)) {
                    if (t.p.length > 0) {
                        while(t.p.length > 0) {
                            a = t.p.shift();
                            try {
                                postscribe(a[0], a[1], a[2]);
                            }
                            catch(e) {
                                alert(e);
                            }
                        }

                        t.t();
                    }
                    else {
                        // When document.write was restored (after the last postscribe-activity), proceed with the callbacks
                        while(t.f.length > 0) {
                            (t.f.shift())();
                        }
                    }
                }
            }

            return t;
        },

        /**
         * Add a timeout loop to ensure document.write is a native function
         *
         * @returns this
         */
        t: function() {
            var t = this;
            t.sem = true;
            window.setTimeout(function() {
                t.c(true);
            }, 100);
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
         * @param  f
         *
         * @return this
         */
        a: function(f) {
            var t = this;
            if (t.pf(f)) {
                t.f.push(f);
            }

            return t;
        },

        /**
         * Test if a parameter or postscribe is a function (and so defined)
         *
         * @param  p
         *
         * @return boolean
         */
        pf: function(p) {
            var t = (typeof postscribe !== 'undefined') ? postscribe : false;
            return typeof (p ? p : t) === 'function';
        }
    };
}(window, document));
