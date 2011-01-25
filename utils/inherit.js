namespace('Utils');

Utils.Inherit = function(child, parent) {
    for (var property in parent.prototype) {
        if (typeof child.prototype[property] == "undefined") {
            child.prototype[property] = parent.prototype[property];
        }
    }
    return child;
};

Utils.InheritObject = function(child, parent) {
    for (var property in parent) {
        if (typeof child[property] == "undefined") {
            child[property] = parent[property];
        }
    }
    return child;
};
