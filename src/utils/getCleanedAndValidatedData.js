import { hasDuplicates, DEFAULT_BED_DATA } from ".";

/* Helper function to take the imported JSON data and validate it. 
It will clean the data along the way if minor.

Current validation:
1. The imported data must be an object
2. There should be at least 1 property of the root object (no empty root object)
3. There should be no duplicate keys of the root object
4. A 'gridData' key must exist at the root
5. The value of 'gridData' must be an array and should not be empty
6. Each 'bedspace' key/value in 'gridData' should contain an object
7. Check key/values of 'bedspace' for appropriate string types and coerce to string as able
8. Check key/values of 'bedspace' for appropriate Array type
9. The contingencies key/value should be an array of strings
10. The nestedContent key/value should be an array of objects
11. Every object within nestedContent array should have an 'id' key
12. Every items array within nestedContent should have an 'id' key

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
  //console.log(`_gridData: \n${JSON.stringify(_gridData, null, 1)}`); //! DEBUG

  /* gridData's value should be an array type */
  if (!Array.isArray(_gridData)) {
    errors.push("Incorrect type for 'gridData' value. Should be an array.");
    throw new Error(errors);
  }
  /* Check if gridData array is empty */
  if (_gridData.length === 0) {
    errors.push("'gridData' array is empty.");
  } else {
    /* The gridData array is not empty. Clean/validate each bedspace object in gridData.*/

    _gridData?.forEach((_bedspace, _bedspace_index, _object) => {
      /* Each `bedspace` in the gridData array should be an object */
      if (typeof _bedspace !== "object") {
        errors.push(
          `A 'bedspace' item in the imported gridData array is not an object (at index ${_bedspace_index}). Removed from array.`
        );
        /* Remove this bedspace */
        _object.splice(_bedspace_index, 1);
        return;
      }

      /* ---- bedspace validation ---- */
      const _bedspace_keys = Object.keys(_bedspace);

      if (_bedspace_keys.length === 0) {
        errors.push(
          `A 'bedspace' item in the imported gridData array is empty (at index ${_bedspace_index}). Removed from array.`
        );
        /* Remove this bedspace (we don't want to keep bedspaces that are just empty objects) */
        _object.splice(_bedspace_index, 1);
        return;
      }

      /* We are requiring a default set of keys/properties for each bedspace object */
      const _default_bedspace_keys = Object.keys(DEFAULT_BED_DATA);
      /* Do the keys in the imported data match the default keys? */
      const keysMatchDefault =
        _bedspace_keys.length === _default_bedspace_keys.length &&
        _bedspace_keys.every((_v, _i) => _v === _default_bedspace_keys[_i]);
      if (!keysMatchDefault) {
        errors.push(
          `A 'bedspace' item in the imported gridData array has missing or incorrectly named properties (at index ${_bedspace_index})`
        );
        /* Add the missing default keys in addition to any keys that are 
         in the imported bedspace */
        _bedspace = { ...DEFAULT_BED_DATA, ..._bedspace };
      }

      /* Internal helper function to check for string type and convert if able 
       _object = the object that holds the key we are examining
       _key_within = the key which has the value we are validating
       */
      function checkForStringTypeAndConvert(_object, _key_within) {
        if (typeof _object[_key_within] !== "string") {
          errors.push(
            `The '${_key_within}' key within the imported gridData array has a value that is not a string, but will be type coerced to a string.`
          );
          let _value_modified;
          /* Will convert 'undefined' to "". Cannot type coerce an object to a string */
          if (_object[_key_within] == null) {
            _value_modified = "";
          } else if (typeof _object[_key_within] === "object") {
            errors.push(
              `Cannot convert the value associated with '${_key_within}' key within the imported gridData array to a string. The value will be labled as '${_error_label}'`
            );
            _value_modified = _error_label;
          } else {
            /* if not a string or an object, try to type coerce to a string */
            _value_modified = _object[_key_within] + "";
          }

          return _value_modified;
        } else {
          return _object[_key_within];
        }
      }

      /* bedspace - Ensure appropriate 'string' types and convert, as able */

      const shouldBeString = [
        "bed",
        "firstName",
        "lastName",
        "teamNumber",
        "oneLiner",
        "contentType",
        "simpleContent",
        "bottomText",
      ];
      shouldBeString.forEach((_s) => {
        if (_bedspace[_s]) {
          _bedspace[_s] = checkForStringTypeAndConvert(_bedspace, _s);
        }
      });

      /* bedspace - Ensure appropriate 'array' types */

      const shouldBeArray = ["contingencies", "nestedContent"];
      shouldBeArray.forEach((_a) => {
        if (_bedspace[_a] && !Array.isArray(_bedspace[_a])) {
          errors.push(
            `The '${_a}' key within the imported gridData array has a value that is not an Array. It will be set to an empty Array.`
          );
          _bedspace[_a] = [];
        }
      });

      /* bedspace - contingencies */

      const _bedspace_contingencies = _bedspace["contingencies"];

      /* Contingencies should be an Array of strings */
      _bedspace_contingencies?.forEach((_cv, _ci) => {
        if (typeof _cv !== "string") {
          errors.push(
            `A 'contingencies' key (bedspace ${_bedspace_index}, within the imported gridData array) has a value within its array that is not a string, but will be type coerced to a string.`
          );
          _bedspace["contingencies"][_ci] = _cv + "";
        }
      });

      /* NestedContent should be an Array of objects */
      const _bedspace_nestedContent = _bedspace["nestedContent"];
      _bedspace_nestedContent?.forEach((_nv, _ni) => {
        if (typeof _nv !== "object") {
          errors.push(
            `A 'nestedContent' key (bedspace ${_bedspace_index}, within the imported gridData array) has a value within its array that is not a object. It will be removed.`
          );
          // remove this element from the nestedContent array
          _bedspace["nestedContent"].splice(_ni, 1);
        }

        /* Every object in the nestedContent array should have an 'id' key */
        if (!Object.keys(_nv).includes("id")) {
          errors.push(
            `A 'nestedContent' key (bedspace ${_bedspace_index}, within the imported gridData array) is missing an 'id' key. It will be removed.`
          );
          // remove this element from the nestedContent array
          _bedspace["nestedContent"].splice(_ni, 1);
        }

        /* If nestedContent has an 'items' key it should be an array of objects with every object having an 'id' key */
        const _nestedContent_items = _nv["items"];
        // see if this key/value exists and if it is non-empty
        if (_nestedContent_items?.length !== 0) {
          _nestedContent_items.forEach((_iv, _ii) => {
            if (typeof _iv !== "object") {
              errors.push(
                `An 'items' key within 'nestedContent' (bedspace ${_bedspace_index}, within the imported gridData array) has a value within its array that is not a object. It will be removed.`
              );
              // remove this element from the nestedContent array
              _bedspace["nestedContent"][_ni]["items"].splice(_ii, 1);
            }

            /* Every object in the nestedContent array should have an 'id' key */
            if (!Object.keys(_iv).includes("id")) {
              errors.push(
                `An 'items' key within 'nestedContent' (bedspace ${_bedspace_index}, within the imported gridData array) is missing an 'id' key. It will be removed.`
              );
              // remove this element from the nestedContent array
              _bedspace["nestedContent"][_ni]["items"].splice(_ii, 1);
            }
          });
        }
      });
      _gridData[_bedspace_index] = _bedspace;
    }); //_gridData.forEach() end

    /* We have finished cleaning/validating this root key (and its value and children).
     Add it to the finished object. */
    cleanData[_gridData_key] = _gridData;
  }
  // console.log(`cleanedData: ${JSON.stringify(cleanData, null, 2)}`); //! DEBUG
  return { cleanedData: cleanData, errors: errors };
}
