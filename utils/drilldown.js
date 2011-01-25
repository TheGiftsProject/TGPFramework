namespace('Utils');

Utils.Drilldown = function(obj)
{
    if (arguments.length > 1) {
        var current = obj;
        for (var i = 1; i < arguments.length; i++) {
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
};
