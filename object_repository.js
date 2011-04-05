/* repoData format:
*
* { ##name##: {
*     file: ##filename##,
*     dependencies: [ ##dependency_name1##, ##dependency_name2##, ... ]
*   },
*   ...
* }
*/
"strict mode";
ObjectRepository = {};

/**
 * @returns the global object.
 */
function GetGlobalNamespace() {
    return this;
}

(function() {

    var repoData = {};
    var globalNamespace = GetGlobalNamespace();

    /**
     * @returns A standard object for all repository errors
     */
    function RepositoryError(message, data) {
        var errorObject = {
            name: 'RepositoryError',
            message: message,
            data: data
        };

        if (console && console.dir) {
            console.dir(errorObject);
        }

        return errorObject;
    }

    /**
     * Appends more object data to the repository
     * @param {object} data The new data to add to the repository
     */
    function AddRepositoryData(basePath, data) {
        for (var i in data) {
            if (repoData[i] === undefined) {
                data[i].file = "/javascripts" + basePath + data[i].file;
                repoData[i] = data[i];
            } else {
                throw RepositoryError('Repository Data Conflict', data);
            }
        }
    }

    /**
     * @returns An object specifier from the repository object data collection
     */
    function GetObjectSpecifier(name) {
        return repoData[name];
    }

    /**
     * Checks if an object already exists based on a string representation of that object
     */
    function ObjectExists(name) {
        var objectTrail = name.split('.');
        var lastObject = globalNamespace;

        for (var i = 0, length = objectTrail.length; i < length; ++i) {
            lastObject = lastObject[objectTrail[i]];

            if (lastObject === undefined) {
                return false;
            }
        }

        return true;
    }

    /**
     * Loads javascript files via labjs
     * @param {array} files A flat array of filenames - duplicates will be removed automatically
     * @param {function} callback This function will be called after execution of all the js files
     * @returns {array} Filenames that were sent to labjs
     */
    function LoadJavascript(files, callback) {

        // Remove duplicates
        for (var i = 0; i < files.length; ++i) {
            for (var j = i+1; j < files.length; ++j) {
                if (files[j] == files[i]) {
                    files.splice(j, 1);
                    j--;
                }
            }
        }

        $LAB.setOptions({AlwaysPreserveOrder: true, AllowDuplicates: true}).script(files).wait(callback);

        return files;
    }

    /**
     * @returns An array of filenames that are required by objectName
     */
    function FetchDependencies(objectName, dependenciesOnly) {
        var dependencyList = [];

        var objectSpecifier = GetObjectSpecifier(objectName);

        if (!objectSpecifier) {
            throw RepositoryError('Object Not Found', objectName);
        }

        if (!ObjectExists(objectName) && dependenciesOnly !== true) {
            dependencyList.unshift(objectSpecifier.file);
        }

        for (var i = 0, length = objectSpecifier.dependencies.length; i < length; ++i) {
            dependencyList = FetchDependencies(objectSpecifier.dependencies[i]).concat(dependencyList);
        }

        return dependencyList;
    }

    /**
     * Loads objects including dependencies
     * @param {array} names An array of object names to load
     * @param {function} callback This function will be called when the objects and their dependencies are ready
     * @param {boolean} dependenciesOnly Do not load the actual object - should be used in the file where each object is created
     */
    function Require(names, callback, dependenciesOnly) {
        if (!repoData) {
            throw RepositoryError('Repository Not Ready', name);
        }

        var dependencyList = [];

        if (typeof names == 'string') {
            names = [names];
        }

        for (var i = 0, length = names.length; i < length; ++i) {
            dependencyList = dependencyList.concat(FetchDependencies(names[i], dependenciesOnly));
        }

        var loadedFiles = LoadJavascript(dependencyList, callback);

        if (typeof __debugging__ !== 'undefined' && console && console.groupCollapsed && console.groupEnd) {
            console.groupCollapsed(loadedFiles.length + " FILES LOADED - " + names.join());
            console.dir(loadedFiles);
            console.groupEnd();
        }
    }

    this.Require = Require;
    this.AddRepositoryData = AddRepositoryData;
    this.GlobalNamespace = globalNamespace;

}).call(ObjectRepository);
