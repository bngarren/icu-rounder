import { hasDuplicates, DEFAULT_GRID_DATA_ELEMENT_DATA } from ".";

import { difference } from "lodash-es";

/* Helper function to take the imported JSON data and validate it. 
It will clean the data along the way if minor.

Current validation:
- The imported data must be an object
- There should be at least 1 property of the root object (no empty root object)
- There should be no duplicate keys of the root object
- A 'gridData' key must exist at the root
- The value of 'gridData' must be an array and should not be empty
- Each 'gridDataElement' in 'gridData' should contain an object
- If an 'id' key is present in 'gridDataElement', it should be emptied
- Check key/values of 'gridDataElement' for appropriate string types and coerce to string as able
- Check key/values of 'gridDataElement' for appropriate Array type
- The contingencies key/value should be an array of strings
- The nestedContent key/value should be an array of objects
- Every object within nestedContent array should have an 'id' key
- Every items array within nestedContent should have an 'id' key

 */
export default function getCleanedAndValidated(rawData) {
  const cleanData = {};
  const errors = [];
  /* the label we will use in a property that isn't valid */
  const _error_label = "ERR";

  /* Since we performed JSON.parse() on the imported data, we expect an object here. 
   Would not expect it to make it here but then still fail...*/
  if (!(rawData && typeof rawData === "object")) {
    errors.push("Invalid root. Not an object.");
    throw new Error(errors);
  }

  /* These are the keys are the root */
  const rootKeys = Object.keys(rawData);

  /* There should be at least 1 key at the root. */
  if (rootKeys.length < 1) {
    errors.push("Cannot import an empty object.");
    throw new Error(errors);
  }

  /* There should not be duplicate keys (root).
   We shouldn't even get to fail here because it seems
   that JSON.parse() will only choose 1 if duplicates are present. */
  if (hasDuplicates(rootKeys)) {
    errors.push("Cannot have duplicate keys.");
    throw new Error(errors);
  }

  /* gridData */
  const _gridData_key = "gridData";
  const _gridData_exists = rootKeys.includes(_gridData_key);
  /* Ensure that gridData key exists */
  if (!_gridData_exists) {
    errors.push("A 'gridData' property is required but was not found.");
    throw new Error(errors);
  }
  const _gridData = rawData[_gridData_key];
  //console.debug(`_gridData: \n${JSON.stringify(_gridData, null, 1)}`); //! DEBUG

  /* gridData's value should be an array type */
  if (!Array.isArray(_gridData)) {
    errors.push("Incorrect type for 'gridData' value. Should be an array.");
    throw new Error(errors);
  }
  /* Check if gridData array is empty */
  if (_gridData.length === 0) {
    errors.push("'gridData' array is empty.");
  } else {
    /* The gridData array is not empty. Clean/validate each element in gridData.*/

    _gridData?.forEach((_gridDataElement, _gridDataElement_index, _object) => {
      /* Each `gridDataElement` in the gridData array should be an object */
      if (typeof _gridDataElement !== "object") {
        errors.push(
          `A 'gridDataElement' item in the imported gridData array is not an object (at index ${_gridDataElement_index}). Removed from array.`
        );
        /* Remove this gridDataElement */
        _object.splice(_gridDataElement_index, 1);
        return;
      }

      /* ---- gridDataElement validation ---- */
      const _gridDataElement_keys = Object.keys(_gridDataElement);
      //console.debug(_gridDataElement_keys); //! DEBUG

      if (_gridDataElement_keys.length === 0) {
        errors.push(
          `A 'gridDataElement' item in the imported gridData array is empty (at index ${_gridDataElement_index}). Removed from array.`
        );
        /* Remove this gridDataElement (we don't want to keep gridDataElements that are just empty objects) */
        _object.splice(_gridDataElement_index, 1);
        return;
      }

      /* We are requiring a default set of keys/properties for each gridDataElement object */
      const _default_gridDataElement_keys = Object.keys(
        DEFAULT_GRID_DATA_ELEMENT_DATA
      );
      /* Do the keys in the imported data match the default keys? */
      const keysMatchDefault =
        _gridDataElement_keys.length === _default_gridDataElement_keys.length &&
        _gridDataElement_keys.every((_gdek) => {
          return _default_gridDataElement_keys.includes(_gdek);
        });
      if (!keysMatchDefault) {
        errors.push(
          `A 'gridDataElement' item in the imported gridData array has missing propertie(s) (at index ${_gridDataElement_index})`
        );

        /* Remove the unexpected keys, using lodash 'difference' function */
        let unexpectedKeys = difference(
          _gridDataElement_keys,
          _default_gridDataElement_keys
        );
        //console.debug(unexpectedKeys); //! DEBUG
        unexpectedKeys.forEach((_uk) => {
          delete _gridDataElement[_uk];
        });

        /* Add the missing default keys in addition to any keys that are 
         in the imported gridDataElement */
        _gridDataElement = {
          ...DEFAULT_GRID_DATA_ELEMENT_DATA,
          ..._gridDataElement,
        };
      }

      /* If an 'id' value is present in gridDataElement, it should be emptied */
      if (_gridDataElement.id) {
        _gridDataElement.id = "";
      }

      /* Internal helper function to check for string type and convert if able 
       _objectBeingChecked = the object that holds the key we are examining
       _key_within = the key which has the value we are validating
       */
      function checkForStringTypeAndConvert(_objectBeingChecked, _key_within) {
        if (typeof _objectBeingChecked[_key_within] !== "string") {
          errors.push(
            `The '${_key_within}' key within the imported gridData array has a value that is not a string, but will be type coerced to a string.`
          );
          let _value_modified;
          /* Will convert 'undefined' to "". Cannot type coerce an object to a string */
          if (_objectBeingChecked[_key_within] == null) {
            _value_modified = "";
          } else if (typeof _objectBeingChecked[_key_within] === "object") {
            errors.push(
              `Cannot convert the value associated with '${_key_within}' key within the imported gridData array to a string. The value will be labled as '${_error_label}'`
            );
            _value_modified = _error_label;
          } else {
            /* if not a string or an object, try to type coerce to a string */
            _value_modified = _objectBeingChecked[_key_within] + "";
          }

          return _value_modified;
        } else {
          return _objectBeingChecked[_key_within];
        }
      }

      /* gridDataElement - Ensure appropriate 'string' types and convert, as able */

      const shouldBeString = [
        "location",
        "firstName",
        "lastName",
        "team",
        "summary",
        "contentType",
        "simpleContent",
        "bottomText",
      ];
      shouldBeString.forEach((_s) => {
        if (_gridDataElement[_s]) {
          _gridDataElement[_s] = checkForStringTypeAndConvert(
            _gridDataElement,
            _s
          );
        }
      });

      /* gridDataElement - Ensure appropriate 'array' types */

      const shouldBeArray = ["contingencies", "nestedContent"];
      shouldBeArray.forEach((_a) => {
        if (_gridDataElement[_a] && !Array.isArray(_gridDataElement[_a])) {
          errors.push(
            `The '${_a}' key within the imported gridData array has a value that is not an Array. It will be set to an empty Array.`
          );
          _gridDataElement[_a] = [];
        }
      });

      /* gridDataElement - contingencies */

      const _gridDataElement_contingencies = _gridDataElement["contingencies"];

      /* Contingencies should be an Array of strings */
      _gridDataElement_contingencies?.forEach((_cv, _ci) => {
        if (typeof _cv !== "string") {
          errors.push(
            `A 'contingencies' key (element ${_gridDataElement_index}, within the imported gridData array) has a value within its array that is not a string, but will be type coerced to a string.`
          );
          _gridDataElement["contingencies"][_ci] = _cv + "";
        }
      });

      /* NestedContent should be an Array of objects */
      const _gridDataElement_nestedContent = _gridDataElement["nestedContent"];
      _gridDataElement_nestedContent?.forEach((_nv, _ni) => {
        if (typeof _nv !== "object") {
          errors.push(
            `A 'nestedContent' key (element ${_gridDataElement_index}, within the imported gridData array) has a value within its array that is not a object. It will be removed.`
          );
          // remove this element from the nestedContent array
          _gridDataElement["nestedContent"].splice(_ni, 1);
        }

        /* Every object in the nestedContent array should have an 'id' key */
        if (!Object.keys(_nv).includes("id")) {
          errors.push(
            `A 'nestedContent' key (element ${_gridDataElement_index}, within the imported gridData array) is missing an 'id' key. It will be removed.`
          );
          // remove this element from the nestedContent array
          _gridDataElement["nestedContent"].splice(_ni, 1);
        }

        /* If nestedContent has an 'items' key it should be an array of objects with every object having an 'id' key */
        const _nestedContent_items = _nv["items"];
        // see if this key/value exists and if it is non-empty
        if (_nestedContent_items?.length !== 0) {
          _nestedContent_items.forEach((_iv, _ii) => {
            if (typeof _iv !== "object") {
              errors.push(
                `An 'items' key within 'nestedContent' (element ${_gridDataElement_index}, within the imported gridData array) has a value within its array that is not a object. It will be removed.`
              );
              // remove this element from the nestedContent array
              _gridDataElement["nestedContent"][_ni]["items"].splice(_ii, 1);
            }

            /* Every object in the nestedContent array should have an 'id' key */
            if (!Object.keys(_iv).includes("id")) {
              errors.push(
                `An 'items' key within 'nestedContent' (element ${_gridDataElement_index}, within the imported gridData array) is missing an 'id' key. It will be removed.`
              );
              // remove this element from the nestedContent array
              _gridDataElement["nestedContent"][_ni]["items"].splice(_ii, 1);
            }
          });
        }
      });
      _gridData[_gridDataElement_index] = _gridDataElement;
    }); //_gridData.forEach() end

    /* We have finished cleaning/validating this root key (and its value and children).
     Add it to the finished object. */
    cleanData[_gridData_key] = _gridData;
  }
  // console.log(`cleanedData: ${JSON.stringify(cleanData, null, 2)}`); //! DEBUG
  return { cleanedData: cleanData, errors: errors };
}
