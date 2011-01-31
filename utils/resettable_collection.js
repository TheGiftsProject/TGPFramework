TGP.Namespace('Utils');

TGP.Utils.ResettableCollection = function() {
    this.defaultCollection = [];
};

TGP.Utils.ResettableCollection.prototype = new Array;

TGP.Utils.ResettableCollection.prototype.Default = function(collection) {
    if (collection === undefined) { return this.defaultCollection; }

    this.defaultCollection = TGP.Core.DeepCopy(collection);
    return this;
};

TGP.Utils.ResettableCollection.prototype.MakeDefault = function() {
    this.defaultCollection = TGP.Core.DeepCopy(this);
    return this;
};

TGP.Utils.ResettableCollection.prototype.Add = function(name, value) {
    for(var i = 0, length = this.length; i < length; ++i) {
        if (this[i].name === name) {
            this[i].value = value;
            return this;
        }
    }

    this.push({'name': name, 'value': value});
    return this;
};

TGP.Utils.ResettableCollection.prototype.Remove = function(name) {
    for (var i = 0, collectionLength = this.length; i < collectionLength; ++i) {
        if (this[i].name === name) {
            this.splice(i, 1);
            break;
        }
    }

    return this;
};

TGP.Utils.ResettableCollection.prototype.Reset = function() {
    TGP.Core.DeepCopy(this.defaultCollection, this);
    return this;
};

TGP.Utils.ResettableCollection.prototype.Clear = function() {
    this.length = 0;
    return this;
};
