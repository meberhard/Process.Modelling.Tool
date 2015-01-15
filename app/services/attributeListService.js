modellingApp.service('attributeList', function () {
    var attributeList = {};

    /**
     * The following function prepares and adds an attribute to the provided array "attributes".
     * Currently, the following types are implemented and may be used as types in the modeling language specification
     * file:
     * * String
     * * Integer
     * * Bool
     * * Time (combines a date and certain time)
     * * Duration
     *
     * @param key
     * @param type
     * @param value
     * @param attributes
     */
    attributeList.addAttribute = function (key, type, value, attributes) {
        switch (type) {
            case "String":
                attributes.push({
                    "key": key,
                    "type": "String",
                    "value": value
                });
                break;
            case "Bool":
                if (parseInt(value) !== 0 && parseInt(value) !== 1) {
                    console.warn("Error in attribute " + key + ", please check the value");
                    break;
                }
                attributes.push({
                    "key": key,
                    "type": "Bool",
                    "value": parseInt(value)
                });
                break;
            case "Integer":
                if (isNaN(parseInt(value))) {
                    console.warn("Error in attribute " + key + ", please check the value");
                    break;
                }
                attributes.push({
                    "key": key,
                    "type": "Integer",
                    "value": parseInt(value)
                });
                break;
            case "Time":
                var stringArray = value.split('-');
                var date = new Date(parseInt(stringArray[0]), parseInt(stringArray[1]-1), parseInt(stringArray[2]),
                    parseInt(stringArray[3]));
                var time = new Date(parseInt(stringArray[4]), parseInt(stringArray[5]));
                attributes.push({
                    "key": key,
                    "type": "Time",
                    "value": {
                        "date": date,
                        "time": time
                    }
                });
                break;
            case "Duration":
                var stringArray = value.split('-');
                if (isNaN(parseInt(stringArray[0])) || isNaN(stringArray[1])) {
                    console.warn("Error in attribute " + key + ", please check the value");
                }
                var duration = new Date();
                duration.setHours(stringArray[0]);
                duration.setMinutes(stringArray[1]);
                attributes.push({
                    "key": key,
                    "type": "Duration",
                    "value": duration
                });
                break;
            default:
                break;
        }
    };

    /**
     * This function is used, when a notation symbol is added to the workspace. It gets the attributes for its
     * type from the modelling specification file and prepares the attributes for the notation symbol.
     *
     * @param attributesArray
     * @returns {Array}
     */
    attributeList.importAllAttributes = function (attributesArray) {
        var attributes = [];
        for (var i = 0; i < attributesArray.length; i++) {
            attributeList.addAttribute(attributesArray[i].key, attributesArray[i].type, attributesArray[i].value, attributes)
        }
        return attributes;
    };

    /**
     * This function should be used if a model is loaded from the database. Since a JSON database is used, all types
     * which are implement in this service, as "Date" and "Integer" will be stringified and parsed to JSON. In order
     * to created the according objects again, the following method will parse the string value of the JSON and
     * return the needed objects for the attributes.
     *
     * @param attrs
     * @returns {*}
     */
    attributeList.prepareAttributes = function (attrs) {
        for (var attrId in attrs) {
            switch (attrs[attrId].type) {
                case "Time":
                    attrs[attrId].value.date = Date.parse(attrs[attrId].value.date);
                    attrs[attrId].value.time = Date.parse(attrs[attrId].value.time);
                    break;
                case "Duration":
                    attrs[attrId].value = Date.parse(attrs[attrId].value);
                    break;
                case "Integer":
                    attrs[attrId].value = parseInt(attrs[attrId].value);
                    break;
            }
        }
        return attrs;
    };


    return attributeList;
});