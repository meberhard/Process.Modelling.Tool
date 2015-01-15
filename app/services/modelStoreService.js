modellingApp.service('modelStore', function () {
    var modelStore = {};
    var store;

    modelStore.createStore = function () {
        store = new Lawnchair({name: 'modelStore', record: 'model'}, function (store) {

        });
    };

    modelStore.saveModel = function (modelName, modelInformation, currentModellingLanguage, model, elements, currentId) {

        if (typeof model === "string") {
            //console.log('the model is a string');
        } else {
            model = (new XMLSerializer()).serializeToString(model);
        }

        store.save({key: modelName, modelInformation: modelInformation, modellingLanguage: currentModellingLanguage,
            model: model, elements: elements, currentId: currentId}, function (obj) {
            //console.log(obj);
        });
    };

    /**
     *
     * @param callback
     */
    modelStore.getAllModelNames = function (callback) {
        store.keys(function (keys) {
            callback(keys);
        });
    };

    /**
     *
     * @param callback
     */
    modelStore.getAll = function (callback) {
        store.all(function (all) {
            callback(all);
        })
    };

    /**
     * Returns all saved models for the given modellingLanguage
     * @param lang
     * @param callback
     * @Todo maybe do something else than iterating over all models
     * @Todo think about defer instead of callback
     */
    modelStore.getAllByLanguage = function (lang, callback) {
        store.all(function (all) {
            var models = [];
            all.forEach(function (model) {
                if (model.modellingLanguage === lang) {
                    models.push(model);
                }
            });
            callback(models);
        });
    };

    /**
     *
     * @param key
     * @param callback
     */
    modelStore.getModel = function (key, callback) {
        store.get(key, function (entry) {
            callback(entry);
        });
    };

    modelStore.nuke = function () {
        store.nuke();
    };

    return modelStore;
});