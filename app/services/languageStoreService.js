/**
 * and additional store, which reads the languages and their elements and saves them locally.
 * Like this get can be easily called, rather than iterating over JSON objects, which are read form file everytime
 */
modellingApp.service('languageStore', function ($http, $q) {
    var languageStore = {};
    var store;

    languageStore.createStore = function (modLangFolder) {
        var deferred = $q.defer();
        store = new Lawnchair({name: 'languageStore', record: 'languages'}, function () {
            $http.get(modLangFolder + 'langs.json').success(function (langs) {
                // @TODO check for change date of file, stop if file is not new
                saveAllLangs(langs, function () {
                    deferred.resolve();
                });
            });
        });
        return deferred.promise;
    };

    languageStore.getAll = function (callback) {
        store.all(function (all) {
            callback(all);
        });
    };

    languageStore.getLanguageNames = function (callback) {
        store.keys(function (keys) {
            callback(keys);
        });
    };

    languageStore.getLanguageByName = function (languageName, callback) {
        store.get(languageName, function (language) {
            callback(language);
        });
    };


    var saveLang = function (item) {
        store.save(item, function (obj) {
        });
    };

    /**
     * This is a helper function, which saves a given array of modelling languages
     * After all of them are saved (async), the callback is called
     *
     * @TODO: check, if this works also with a lot of given modelling languages
     * @param langs
     * @param callback
     */
    var saveAllLangs = function (langs, callback) {
        var counter = 0;
        langs.forEach(function (lang) {
            store.save(lang, function () {
                counter++;
                if (counter === langs.length) {
                    callback();
                }
            });
        });
    };

    languageStore.nuke = function () {
        store.nuke();
    };

    return languageStore;
});