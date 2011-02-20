ObjectRepository.Require('TGP.Core', function() {

    TGP.MakeObject('Core');

    (function() {

        /**
         * Unlike typeof, this can distinguish between 'object', 'array' and 'null'
         * @returns A string representing the type of the object
         */
        function GetType(obj) {
            var s = typeof obj;
            if (s === 'object') {
                if (obj) {
                    if ((obj instanceof Array) || Object.prototype.toString.call(obj) === '[object Array]') {
                        return 'array';
                    }
                } else {
                    return 'null';
                }
            }

            return s;
        }

        // Taken from the jQuery source
        function jQueryExtend() {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if ( typeof target === "boolean" ) {
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                i = 2;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if ( typeof target !== "object" && GetType(target) != 'function') {
                target = {};
            }

            // extend jQuery itself if only one argument is passed
            if ( length === i ) {
                target = this;
                --i;
            }

            for ( ; i < length; i++ ) {
                // Only deal with non-null/undefined values
                if ( (options = arguments[ i ]) != null ) {
                    // Extend the base object
                    for ( name in options ) {
                        src = target[ name ];
                        copy = options[ name ];

                        // Prevent never-ending loop
                        if ( target === copy ) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                            if ( copyIsArray ) {
                                copyIsArray = false;
                                clone = src && jQuery.isArray(src) ? src : [];
                            } else {
                                clone = src && jQuery.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[ name ] = jQuery.extend( deep, clone, copy );

                        // Don't bring in undefined values
                        } else if ( copy !== undefined ) {
                            target[ name ] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        }

        function DeepCopyArray(sourceArray, destArray) {
            var newArray = destArray || [];
            newArray.length = 0;
            for (var i = 0, length = sourceArray.length; i < length; ++i) {
                newArray.push(DeepCopy(sourceArray[i]));
            }
            return newArray;
        }

        function DeepCopy(sourceObject, destObject) {
            var type = GetType(sourceObject);
            var result = sourceObject;

            if (type == 'object') {
                result = jQueryExtend(true, destObject || {}, sourceObject);
            } else if (type == 'array') {
                result = DeepCopyArray(sourceObject, destObject);
            }

            return result;
        }

        function Drilldown(obj) {
            if (arguments.length > 1) {
                var current = obj;
                for (var i = 1, length = arguments.length; i < length; i++) {
                    if (typeof current == 'object' && obj !== null) {
                        current = current[arguments[i]];
                    } else {
                        return undefined;
                    }
                }

                return current;
            } else {
                return obj;
            }
        }

        function Inherit(child, parent) {
            for (var key in parent) {
                if (Object.prototype.hasOwnProperty.call(parent, key)) {
                    child[key] = parent[key];
                }
            }

            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        }

        function InheritObject(child, parent) {
            for (var property in parent) {
                if (typeof child[property] == "undefined") {
                    child[property] = parent[property];
                }
            }
            return child;
        }

        function MakeAccessor(param, container, changeCallback) {
            return function(p) {
                if (p === undefined) { return container[param]; }

                var lastValue = container[param];
                container[param] = p;

                if (changeCallback && (lastValue !== p)) {
                    changeCallback(param, lastValue, p);
                }
                return this;
            };
        }

        function BindThis(boundThis, func) {
            return function() {
                func.apply(boundThis, arguments);
            };
        }

        this.GetType       = GetType;
        this.DeepCopy      = DeepCopy;
        this.Drilldown     = Drilldown;
        this.Inherit       = Inherit;
        this.InheritObject = InheritObject;
        this.MakeAccessor  = MakeAccessor;
        this.BindThis      = BindThis;

    }).call(TGP.Core);

}, true);
