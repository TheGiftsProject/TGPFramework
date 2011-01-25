namespace('Utils');

Utils.DeepCopyObject = function(sourceObject) {
    if (typeof sourceObject == 'object') {
        if (sourceObject instanceof Array) {
            return Utils.DeepCopyArray(sourceObject);
        } else {
            return jQuery.extend(true, {}, sourceObject);
        }
    }

    return sourceObject;
};

Utils.DeepCopyArray = function(sourceArray, destArray) {
    var newArray = destArray || [];
    newArray.length = 0;
    for (var i = 0, length = sourceArray.length; i < length; ++i) {
        newArray.push(Utils.DeepCopyObject(sourceArray[i]));
    }
    return newArray;
};
