namespace('Utils').makeObject('Core');

(function() {

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

    function DeepCopyArray(sourceArray, destArray) {
        var newArray = destArray || [];
        newArray.length = 0;
        for (var i = 0, length = sourceArray.length; i < length; ++i) {
            newArray.push(Utils.DeepCopyObject(sourceArray[i]));
        }
        return newArray;
    }

    function DeepCopy(sourceObject, destObject) {
        var type = GetType(sourceObject);
        var result = sourceObject;

        if (type == 'object') {
            result = jQuery.extend(true, destObject || {}, sourceObject);
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
                    break;
                }
            }

            return current;
        } else {
            return obj;
        }
    }

    function Inherit(child, parent) {
        for (var property in parent.prototype) {
            if (typeof child.prototype[property] == "undefined") {
                child.prototype[property] = parent.prototype[property];
            }
        }
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

    function MakeAccessor(param, container) {
        return function(p) {
            if (p === undefined) { return container[param]; }

            container[param] = p;
            return this;
        };
    }

    this.GetType       = GetType;
    this.DeepCopy      = DeepCopy;
    this.Drilldown     = Drilldown;
    this.Inherit       = Inherit;
    this.InheritObject = InheritObject;
    this.MakeAccessor  = MakeAccessor;

}).call(Utils.Core);
