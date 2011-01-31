ObjectRepository = {};

function GetGlobalNamespace() {
    return this;
}

(function() {

    var repoData;

    function RepositoryError(message, name) {
        return {
            name: 'RepositoryError',
            message: message,
            objectName: name
        };
    }

    function GetObjectSpecifier(name) {
        return repoData[name];
    }

    function ObjectExists(name) {
        var objectTrail = name.split('.');
        var lastObject = GetGlobalNamespace();

        for (var i = 0, length = objectTrail.length; i < length; ++i) {
            lastObject = lastObject[objectTrail[i]];

            if (lastObject === undefined) {
                return false;
            }
        }

        return true;
    }

    function LoadJavascript(filename) {
    }

    function Require(name) {
        if (!repoData) {
            throw RepositoryError('Repository Not Ready', name);
        }

        if (typeof name != 'string') {
            throw RepositoryError('Invalid Object Name', name);
        }

        var objectSpecifier = GetObjectSpecifier(name);

        if (objectSpecifier) {
            for (var i = 0, length = objectSpecifier.dependencies.length; i < length; ++i) {
                Require(objectSpecifier.dependencies[i]);
            }

            if (!ObjectExists(name)) {
                LoadJavascript(objectSpecifier.file);
            }
        } else {
            throw RepositoryError('Object Not Found', name);
        }
    }

    function SetRepositoryData(data) {
        repoData = data;
    }

    this.Require = Require;
    this.SetRepositoryData = SetRepositoryData;

}).call(ObjectRepository);
