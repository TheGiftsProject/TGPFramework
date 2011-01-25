function makeObject(name) {
    if (!this[name]) {
        this[name] = {};
    }
}

function namespace() {
    var lastNamespace = this;

    for (var i = 0, length = arguments.length; i < length; ++i) {
        if (!lastNamespace[arguments[i]]) {
            lastNamespace[arguments[i]] = { namespace: namespace, makeObject: makeObject };
        }

        lastNamespace = lastNamespace[arguments[i]];
    }

    return lastNamespace;
}
