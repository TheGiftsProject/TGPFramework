namespace('Utils');

Utils.ResettableCollection = function() {
    this.defaultCollection = [];
};

Utils.ResettableCollection.prototype = new Array;

Utils.ResettableCollection.prototype.Default = function(collection) {
    if (collection === undefined) { return this.defaultCollection; }

    this.defaultCollection = Utils.Core.DeepCopy(collection);
    return this;
};

Utils.ResettableCollection.prototype.MakeDefault = function() {
    this.defaultCollection = Utils.Core.DeepCopy(this);
    return this;
};

Utils.ResettableCollection.prototype.Add = function(name, value) {
    for(var i = 0, length = this.length; i < length; ++i) {
        if (this[i].name === name) {
            this[i].value = value;
            return this;
        }
    }

    this.push({'name': name, 'value': value});
    return this;
};

Utils.ResettableCollection.prototype.Remove = function(name) {
    for (var i = 0, collectionLength = this.length; i < collectionLength; ++i) {
        if (this[i].name === name) {
            this.splice(i, 1);
            break;
        }
    }

    return this;
};

Utils.ResettableCollection.prototype.Reset = function() {
    Utils.Core.DeepCopy(this.defaultCollection, this);
    return this;
};

Utils.ResettableCollection.prototype.Clear = function() {
    this.length = 0;
    return this;
};
