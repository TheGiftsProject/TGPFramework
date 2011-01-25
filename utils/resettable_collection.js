namespace('Utils');

Utils.ResettableCollection = function() {
    this.defaultCollection = [];
};

Utils.ResettableCollection.prototype = new Array;

(function() {
    this.Default = function(collection) {
        if (collection === undefined) { return this.defaultCollection; }

        this.defaultCollection = Utils.DeepCopyArray(collection);
        return this;
    };

    this.MakeDefault = function() {
        this.defaultCollection = Utils.DeepCopyArray(this);
        return this;
    };

    this.Add = function(name, value) {
        for(var i = 0, length = this.length; i < length; ++i) {
            if (this[i].name === name) {
                this[i].value = value;
                return this;
            }
        }

        this.push({'name': name, 'value': value});
        return this;
    };

    this.Remove = function(name) {
        for (var i = 0, collectionLength = this.length; i < collectionLength; ++i) {
            if (this[i].name === name) {
                this.splice(i, 1);
                break;
            }
        }

        return this;
    };

    this.Reset = function() {
        Utils.DeepCopyArray(this.defaultCollection, this);
        return this;
    };

    this.Clear = function() {
        this.length = 0;
        return this;
    };
}).call(Utils.ResettableCollection.prototype);
