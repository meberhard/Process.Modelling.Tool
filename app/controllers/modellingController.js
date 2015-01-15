/**
 * Created by meberhard on 6/29/14.
 */
/**
 * @TODO add model (prototype) for modelEntries in the DB
 */
modellingApp.controller('ModellingController', function ($scope, $http, $modal, $timeout, $q, $compile, modelStore, languageStore, serviceCurrentModel, serviceElements, serviceImportModel, serviceUniqueId, serviceModellingRules, serviceAlertMessages) {

    // the following variable holds the alert-messages output to the user
    $scope.alerts = [];

    /**
     * following the scaling configuration
     * @type {number}
     */
    $scope.currentScale = 1.0;
    $scope.currentScale_upperBound = 1.0;
    $scope.currentScale_lowerBound = 0.1;
    $scope.currentScale_scalingSteps = 0.1;

    $scope.translateX = 0;
    $scope.translateY = 0;
    $scope.panningSteps = 50;

    /**
     * Name of the folder, where the application finds the modelling languages
     * The folder must contain the file 'langs.json', which lists all modelling languages used by the application
     * and further paths to the files, which desribe the syntax of the modelling language
     * @type {string}
     */
    $scope.modLangFolder = "modLangs/";

    /**
     * The following variable saves, what modelling language is currently loaded.
     * @type {string}
     */
    $scope.currentModellingLanguage = "";

    $scope.showPointsOnLine = undefined;

    /**
     * The user can select any element, the id of the selected element is saved in this variable
     * @type {undefined}
     */
    $scope.idOfSelectedElement = undefined;

    /**
     * An array which holds the name of the calendar, which should be opened. This is used to edit the attributes,
     * see template partial view/partials/attributes.html
     * @type {Array}
     */
    $scope.openedCalendar = [];

    /**
     * The path to the helper script, which loads the constraints back to this controller
     * @type {string}
     */
    $scope.constraintHelperScript = "app/utility/constraintHelper.js";

    /**
     * On load of the application we show the user, which modelling languages he can choose from
     * All available languages must be present in model/langs.json and defined in the model/data/ folder
     * Furthermore we check on initialization, if either indexeddb or websql is offered by the browser, so
     * models may be persisted client-sided
     *
     * @TODO validate the json files in model, to make sure all file exist
     */
    $scope.init = function () {
        if (!$scope.checkBrowserWebSqlCompatibility() && !$scope.checkBrowserIndexedDBCompatibility()) {
            $scope.alerts.push({
                type: 'danger',
                msg: "Your browser does not support either IndexedDB or Sqlite, which are used by this application as client side storage. Please switch to a browser which supports either one of the two."
            });
            return;
        }

        modelStore.createStore();
        var languageStoreCreated = languageStore.createStore($scope.modLangFolder);
        languageStoreCreated.then(function () {
            languageStore.getAll(function (modellingLanguages) {
                var modalInstance = $modal.open({
                    templateUrl: 'view/modals/selectlanguage.html',
                    controller: 'SelectLanguageModalController',
                    size: "",
                    resolve: {
                        modellingLanguages: function () {
                            return modellingLanguages;
                        }
                    }
                });
                modalInstance.result.then(function (modellingLanguage) {
                    $http.get($scope.modLangFolder + modellingLanguage.pathModellingLanguages).success(function (data) {
                        $scope.currentModellingLanguage = modellingLanguage.key;
                        $scope.processSvgElements(data);
                        $scope.constraints = data.constraints;
                        $scope.addMarkerDef();
                        /* this is the end of controller initialization */
                    });
                });
            });
            languageStore.getLanguageNames(function (languageNames) {
                $scope.availableModellingLanguages = languageNames;
            });
        });

    };

    /**
     * Initializes the controller and loads a given modellingLanguage and model.
     * If the modellingLanguage is already active, nothing will happen.
     *
     * @TODO check, if scope needs to be destroyed
     * @param model
     * @param languageName
     */
    $scope.initWithModellingLanguageAndModel = function (languageName, model, elements, currentId) {
        modelStore.createStore();
        if ((languageName === $scope.currentModellingLanguage)) {
            // nothing needs to be done!
        } else if ((languageName !== undefined) && (model === undefined)) {
            delete $scope.constraints;
            $scope.resetSvgWorkspace();
            languageStore.getLanguageByName(languageName, function (language) {
                $http.get($scope.modLangFolder + language.pathModellingLanguages).success(function (data) {
                    $scope.currentModellingLanguage = languageName;
                    $scope.processSvgElements(data);
                    $scope.constraints = data.constraints;
                    $scope.currentModellingLanguage = languageName;
                });
            });
        } else if ((languageName !== undefined) && (model !== undefined)) {
            delete $scope.constraints;
            $scope.resetSvgWorkspace();
            languageStore.getLanguageByName(languageName, function (language) {
                $http.get($scope.modLangFolder + language.pathModellingLanguages).success(function (data) {
                    $scope.currentModellingLanguage = language.key;
                    $scope.processSvgElements(data);
                    $scope.constraints = data.constraints;
                    $scope.$broadcast('loadModelEvent', [model]);
                    serviceElements.setElements(elements);
                    serviceUniqueId.setStartId(currentId);
                    /* this is the end of controller initialization */
                });
            });
        }
    };

    /**
     * Reads the defined types of the JSON file.
     * Effectively takes care for inheriting associations, attributes and constraints from abstract types
     *
     * @param types
     */
    $scope.processTypes = function (types) {

        var mergeHelper = function (currentTypes, mergedType) {
            var nextParentTypes = [];

            for (var i = 0; i < currentTypes.length; i++) {
                // merge associations
                for (var outAssoc in currentTypes[i].rules.out) {
                    mergedType.rules.out[outAssoc] = currentTypes[i].rules.out[outAssoc];
                }
                for (var inAssoc in currentTypes[i].rules.in) {
                    mergedType.rules.in[inAssoc] = currentTypes[i].rules.in[inAssoc];
                }
                //merge attributes
                for (var j = 0; j < currentTypes[i].attributes.length; j++) {
                    mergedType.attributes.push(currentTypes[i].attributes[j]);
                }
                //merge constraints
                for (var j = 0; j < currentTypes[i].constraints.length; j++) {
                    mergedType.constraints.push(currentTypes[i].constraints[j]);
                }
                //merge parentTypes
                for (var j = 0; j < currentTypes[i].parentTypes.length; j++) {
                    mergedType.parentTypes.push(currentTypes[i].parentTypes[j]);
                    nextParentTypes.push(currentTypes[i].parentTypes[j]);
                }

            }

            if (nextParentTypes.length === 0) {
                return mergedType;
            } else {
                var tempTypes = [];
                for (var i = 0; i < nextParentTypes.length; i++) {
                    tempTypes.push(types[nextParentTypes[i]]);
                }
                return mergeHelper(tempTypes, mergedType);
            }
        };

        var rTypes = {};
        for (var rkey in types) {
            if ((types[rkey].isAbstract === false) && !(rkey in rTypes)) {
                var mergedType = {
                    "name": types[rkey].name,
                    "isAbstract": false,
                    "parentTypes": [],
                    "rules": {
                        "out": {},
                        "in": {}
                    },
                    "attributes": [],
                    "constraints": []
                };
                rTypes[rkey] = mergeHelper([types[rkey]], mergedType);
            }
        }

        $scope.symbolTypes = rTypes;
        serviceModellingRules.setRules(rTypes);
    };

    /**
     * Takes the json input of the definition file of the modelling language
     * @param jsonInput
     */
    $scope.processSvgElements = function (jsonInput) {
        delete $scope.tempSymbols;
        $scope.svgNotationSymbols = jsonInput.symbols;
        $scope.svgEdges = jsonInput.edges;
        $scope.processTypes(jsonInput.types);

        // added logic, assign the name of the type and the name of the modelling language to the type, so it gets an unique identifier
        // otherwise the frontend doesn't refresh the symbols, when the user changes from one modelling language to another one
        // where two types have the same name
        for (var key in $scope.symbolTypes) {
            $scope.symbolTypes[key].typeId = $scope.currentModellingLanguage + key;
        }
    };

    /**
     * Function is used in ng-init in index.html. It gets all symbols for a certain type,
     * so the symbols can be sorted for the types in the user interface
     *
     * @param type
     * @returns {Array}
     */
    $scope.getSymbolForType = function (type) {
        var temp = [];
        for (var d = 0, len = $scope.svgNotationSymbols.length; d < len; d += 1) {
            if ($scope.svgNotationSymbols[d].type === type.name) {
                temp.push($scope.svgNotationSymbols[d]);
            }
        }
        return temp;
    };

    /**
     * Adds a given svg element to the working space and places it on the x and y coordinates.
     * The type parameters defines, if the current element is either a symbol or a connector
     * This function is also used in the index.html
     *
     * @param item
     * @param xCoord
     * @param yCoord
     * @param type
     */
    $scope.addElementToSvg = function (item, xCoord, yCoord, type) {
        switch (type) {
            case "symbols":
                $scope.$broadcast('addSvgElementEvent', [item, xCoord, yCoord, type]);
                break;
            case "connectors":
                $scope.$broadcast('addConnectorEvent', [item, xCoord, yCoord, type]);
                break;
        }
    };

    /**
     * This function loads a svg symbol from the filesystem.
     *
     * @param id
     * @param callback
     */
    $scope.getSvg = function (id, callback) {
        for (var d = 0, len = $scope.svgNotationSymbols.length; d < len; d += 1) {
            if ($scope.svgNotationSymbols[d].id === id) {
                $http.get($scope.modLangFolder + "languages/" + $scope.svgNotationSymbols[d].svgPath).success(function (data) {
                    callback(data, id);
                });
            }
        }
    };

    /**
     * This function returns the type of a symbol
     *
     * @param id
     * @returns {*}
     */
    $scope.getSymbolType = function (id) {
        for (var d = 0, len = $scope.svgNotationSymbols.length; d < len; d += 1) {
            if ($scope.svgNotationSymbols[d].id === id) {
                return $scope.svgNotationSymbols[d].type;
            }
        }
    };

    /**
     * This function returns the type of an edge - in case different types of edges are used.
     *
     * @param id
     * @returns {*}
     */
    $scope.getConnectorType = function (id) {
        for (var d = 0, len = $scope.svgEdges.length; d < len; d += 1) {
            if ($scope.svgEdges[d].id === id) {
                return $scope.svgEdges[d].type;
            }
        }
    };

    /**
     * Gets the properties (attributes) of an edge.
     *
     * @param id
     * @returns {Document.properties|properties|*}
     */
    $scope.getConnectorAttributes = function (id) {
        for (var d = 0, len = $scope.svgEdges.length; d < len; d += 1) {
            if ($scope.svgEdges[d].id === id) {
                return $scope.svgEdges[d].attributes;
            }
        }
    };

    /**
     * Gets the style of an edge - the user is able to define the style of an edge in the JSON description file
     * of the modelling language.
     *
     * @param id
     * @returns {*}
     */
    $scope.getEdgeStyle = function (id) {
        for (var d = 0, len = $scope.svgEdges.length; d < len; d += 1) {
            if ($scope.svgEdges[d].id === id) {
                return $scope.svgEdges[d].edgeStyle;
            }
        }
    };

    /**
     * This function resets the workspace and removes all elements
     *
     */
    $scope.resetSvgWorkspace = function () {
        serviceElements.resetElements();
        $scope.$broadcast('resetWorkspaceEvent');
    };

    /**
     * This function opens the load modal dialogue. It is used to see models, which are saved in the local database.
     *
     * @param size
     */
    $scope.openLoadModal = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'view/modals/loadmodal.html',
            controller: 'LoadModalController',
            size: size
        });
        modalInstance.result.then(function (modelEntry) {
            if ($scope.currentModellingLanguage !== modelEntry.modellingLanguage) {
                languageStore.getLanguageByName(modelEntry.modellingLanguage, function (modellingLanguage) {
                    if (modellingLanguage) {
                        $scope.initWithModellingLanguageAndModel(modelEntry.modellingLanguage, modelEntry.model, modelEntry.elements, modelEntry.currentId);
                    } else {
                        $scope.alerts.push({
                            type: 'danger',
                            msg: 'The modellingLanguage of the model you try to load does not exist, please check your modelling language definitions'
                        });
                    }
                });
            } else {
                serviceElements.setElements(modelEntry.elements);
                serviceUniqueId.setStartId(modelEntry.currentId);
                $scope.$broadcast('loadModelEvent', [modelEntry.model]);
            }
        });
    };

    /**
     * This function opens the save modal dialogue. It is used to save the current model.
     *
     * @param size
     */
    $scope.openSaveModal = function (size) {
        if (serviceCurrentModel.getCurrentModel() === undefined) {
            $scope.alerts.push({
                type: 'danger',
                msg: 'Your working space is empty - please add at least one symbol in order to save.'
            });
        } else {
            $modal.open({
                templateUrl: 'view/modals/savemodal.html',
                controller: 'SaveModalController',
                size: size,
                resolve: {
                    currentModel: function () {
                        return serviceCurrentModel.getCurrentModel();
                    },
                    currentModellingLanguage: function () {
                        return $scope.currentModellingLanguage;
                    }
                }
            });
        }
    };

    /**
     * This function opens an export modal dialogue. It is used to export models, which are in the local database as JSON.
     *
     * @param size
     */
    $scope.openExportModal = function (size) {
        var exportModel = $modal.open({
            templateUrl: 'view/modals/exportmodal.html',
            controller: 'ExportModalController',
            size: size
        });
        exportModel.result.then(function (model) {
            $scope.$broadcast('downloadModelEvent', [model]);
        });
    };

    /**
     * This function opens the import modal dialogue. It is used to import models as JSON files. After import, they will
     * be written to the local database.
     *
     * @param size
     */
    $scope.openImportModal = function (size) {
        var importModal = $modal.open({
            templateUrl: 'view/modals/importmodal.html',
            controller: 'ImportModalController',
            size: size
        });
        importModal.result.then(function () {
            if (serviceImportModel.getImportModel() !== undefined) {
                var reader = new FileReader();
                reader.onloadend = function (e) {
                    var data = e.target.result;
                    var newModelObj = JSON.parse(data);
                    modelStore.saveModel(newModelObj.key, newModelObj.modelInformation, newModelObj.modellingLanguage,
                        newModelObj.model, newModelObj.elements, newModelObj.currentId);
                    //@TODO callback for saveModel and success message
                };
                reader.readAsText(serviceImportModel.getImportModel());
            } else {
                //@todo write error
            }
            serviceImportModel.setImportModel(undefined);
        });
    };

    /**
     * Closes the current alert message to the user.
     * This function is used in the HTML of the alert box - it is linked to the close button of the alert box.
     *
     * @param index
     */
    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    /**
     * Add an alert message to the user
     *
     * @param message
     */


    /**
     * The following $watch instruction is a workaround, to put the central alert message handling in a service.
     */
    $scope.$watch(
        function () {
            return serviceAlertMessages.getAlert();
        },
        function (newVal) {
            if (newVal !== undefined) {
                $scope.alerts.push(serviceAlertMessages.getAlert());
            }
        });

    /**
     * The following function is used for testing purposes - it wipes the two databases used in this application.
     */
    $scope.nukeStore = function () {
        modelStore.nuke();
        languageStore.nuke();
    };

    $scope.destroySvgArea = function () {
        $scope.$broadcast('destroySvgAreaEvent');
    };

    /**
     * Zoom-in handler for the user interface
     */
    $scope.zoomIn = function () {
        if (!(($scope.currentScale + $scope.currentScale_scalingSteps) > $scope.currentScale_upperBound)) {
            $scope.currentScale = parseFloat(($scope.currentScale + $scope.currentScale_scalingSteps).toFixed(1));
        }
    };

    /**
     * Zoom-out handler for the user interface
     */
    $scope.zoomOut = function () {
        if (!(($scope.currentScale - $scope.currentScale_scalingSteps) < $scope.currentScale_lowerBound)) {
            $scope.currentScale = parseFloat(($scope.currentScale - $scope.currentScale_scalingSteps).toFixed(1));
        }
    };

    /**
     * This function reset the zoom to the initial values.
     */
    $scope.zoomReset = function () {
        $scope.currentScale = 1;
        $scope.translateX = 0;
        $scope.translateY = 0;
    };

    /**
     * Panning handler for the svg area, it is used to move the whole model
     * @param direction
     */
    $scope.pan = function (direction) {
        switch (direction) {
            case 'left':
                $scope.translateX -= $scope.panningSteps;
                break;
            case 'right':
                $scope.translateX += $scope.panningSteps;
                break;
            case 'up':
                $scope.translateY -= $scope.panningSteps;
                break;
            case 'down':
                $scope.translateY += $scope.panningSteps;
                break;
        }
    };

    /**
     * This functions checks, whether the browser supports IndexedDb.
     *
     * @returns Bool
     */
    $scope.checkBrowserIndexedDBCompatibility = function () {
        return window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.oIndexedDB || window.msIndexedDB;
    };

    /**
     * This function checks, whether the browser supports websql.
     *
     * @returns Bool
     */
    $scope.checkBrowserWebSqlCompatibility = function () {
        return window.openDatabase;
    };

    /**
     * This functions alters the redrawing of an edge.
     *
     * @param id
     * @param xCoord
     * @param yCoord
     * @param type
     */
    $scope.redrawConnectorLine = function (id, xCoord, yCoord, type) {
        $scope.$broadcast('updateSvgConnectorLine', [id, xCoord, yCoord, type]);
    };

    /**
     * This function adds the marker definition, which is used for the edges. It implements the arrow heads.
     */
    $scope.addMarkerDef = function () {
        $http.get($scope.modLangFolder + "connectors/markers.svg").success(function (data) {
            $scope.$broadcast('insertMarkerDef', [data]);
        });
    };

    /**
     * This function broadcasts, that the dockers on a certain symbol should be shown.
     *
     * @param id
     */
    $scope.showDockersOnGroup = function (id) {
        $scope.$broadcast('showDockersOnGroupEvent', [id]);
    };

    /**
     * This functions broadcasts, that the dockers on a certain symbol should be hidden.
     *
     * @param id
     */
    $scope.hideDockersOnGroup = function (id) {
        $scope.$broadcast('hideDockersOnGroupEvent', [id]);
    };

    /**
     * This function broadcasts, that a certain symbol should be highlighted (marked).
     *
     * @param id
     */
    $scope.markThisSymbol = function (id) {
        $scope.$broadcast('markSymbolEvent', [id]);
    };

    /**
     * Updates the attributes of a certain element.
     *
     * @param id
     * @param type should be either connector or symbol
     */
    $scope.updateProperties = function (id, type) {
        if (id !== undefined && type === "symbol") {
            $scope.currentSelectedElement = serviceElements.getSymbol(id);
            $scope.currentSelectedElementType = "symbols";
            //$scope.$apply();
            $scope.safeApply();
        } else if (id !== undefined && type === "connector") {
            $scope.currentSelectedElement = serviceElements.getConnector(id);
            $scope.currentSelectedElementType = "connectors";
            //$scope.$apply();
            $scope.safeApply();
        } else {
            $scope.currentSelectedElement = undefined;
        }
    };

    /**
     * This function is used to remove an elemnt from the svg area.
     *
     * @param id
     * @param type
     */
    $scope.removeElement = function (id, type) {
        if (type === "symbols") {
            serviceElements.removeSymbol(id);
        } else if (type === "connectors") {
            serviceElements.removeConnector(id);
        }
        $scope.$broadcast('removeSvgElementEvent', [id, type]);
    };

    /**
     * This function opens a calendar in the attributes, in case a date object is used as an attribute of an element.
     *
     * @param $event
     * @param key
     */
    $scope.openCalendar = function ($event, key) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.openedCalendar[key] = true;
    };

    $scope.loadConstraints = function () {
        var constraintScript = document.createElement("script");
        constraintScript.setAttribute("type", "text/javascript");
        constraintScript.setAttribute("src", $scope.constraintHelperScript);
        var bodyTag = document.getElementById("mainController");
        $compile(constraintScript)($scope);
        bodyTag.appendChild(constraintScript);
    };

    /**
     * This functions sets the constraints.
     *
     * @param constraints
     */
    $scope.setConstraints = function (constraints) {
        $scope.modLangConstraints = constraints;
    };

    /**
     * This function is connected to the validate button of the user interface. It validates the created model
     * against the meta model and the constraints.
     */
    $scope.validateModel = function () {
        var tempIdFromConstraints = serviceElements.postConstraintValidation($scope.constraints, $scope.modLangConstraints);
        if (parseInt(tempIdFromConstraints)) {
            $scope.markThisSymbol(tempIdFromConstraints);
            return false;
        }
        var tempIdFromMM = serviceElements.postValidateMetamodel();
        if (parseInt(tempIdFromMM)) {
            $scope.markThisSymbol(tempIdFromMM);
            return false;
        }
    };

    /**
     * Copied from
     * http://stackoverflow.com/questions/16611350/digest-already-running-angularjs
     */
    $scope.safeApply = function () {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            // skip
        } else {
            this.$apply();
        }
    };

    // initialize the controller
    $scope.init();
});