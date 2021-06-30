import { useState, useRef, useCallback, useEffect } from "react";

import { InputAdornment, IconButton, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import StopIcon from "@material-ui/icons/Stop";
import ClearIcon from "@material-ui/icons/Clear";

// components
import CustomTextField from "./CustomTextField";
import QuickAddInput from "./QuickAddInput";

//lodash
import { uniqueId, debounce } from "lodash";

const useStylesForContentInputForm = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    paddingLeft: "4px",
  },
  header: {
    color: theme.palette.primary.main,
    fontSize: "11pt",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: "4px",
  },
  addIconButton: {
    padding: 6,
  },
  removeIconButton: {
    padding: 2,
  },
  inputItem: {
    marginLeft: "15px",
  },
}));

/* - - - CONTENT INPUT FORM - - -  */
const ContentInputForm = ({
  initialData,
  stealFocus = false,
  onContentInputFormChange = (f) => f,
}) => {
  const classes = useStylesForContentInputForm();

  const [title, setTitle] = useState("");
  const [topText, setTopText] = useState("");
  const [items, setItems] = useState([]);

  const refToTitle = useRef();

  const getSectionObject = () => {
    return {
      id: initialData.id,
      title: title,
      top: topText,
      items: items,
    };
  };

  useEffect(() => {
    setTitle(initialData?.title || "");
    setTopText(initialData?.top || "");
    setItems(initialData?.items || []);

    if (refToTitle?.current !== null && stealFocus) {
      refToTitle.current.focus();
    }
  }, [initialData, stealFocus]);

  const handleOnTitleChange = (val) => {
    setTitle(val);
    debouncedNotifyParent({ ...getSectionObject(), title: val });
  };
  const handleOnTopTextChange = (val) => {
    setTopText(val);
    debouncedNotifyParent({ ...getSectionObject(), top: val });
  };

  const handleOnItemChange = (val, id) => {
    setItems((prevValue) => {
      let arr = [...prevValue];
      const index = arr.findIndex((el) => el.id === id);
      if (index === -1) return;
      arr[index] = { id: id, value: val || "" };

      debouncedNotifyParent({ ...getSectionObject(), items: arr });
      return arr;
    });
  };

  const handleAddItem = (value) => {
    setItems((prevValue) => {
      let arr = [...prevValue];
      arr.push({ id: uniqueId("item-"), value: value || "" });

      debouncedNotifyParent({ ...getSectionObject(), items: arr });
      return arr;
    });
  };

  const handleRemoveItem = (id) => {
    setItems((prevValue) => {
      let arr = [...prevValue];

      const index = arr.findIndex((el) => el.id === id);
      if (index === -1) return;
      arr.splice(index, 1);

      debouncedNotifyParent({ ...getSectionObject(), items: arr });
      return arr;
    });
  };

  const debouncedNotifyParentFunction = useRef();

  // the function we want to debounce
  debouncedNotifyParentFunction.current = (sectionData) => {
    onContentInputFormChange(sectionData);
  };

  // the debounced function
  const debouncedNotifyParent =
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback(
      debounce(debouncedNotifyParentFunction.current, 400, {
        leading: true,
      }),
      []
    );

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.header}>
        Edit Section
      </Typography>
      <CustomTextField
        ref={refToTitle}
        placeholder="Title"
        value={title}
        onChange={(e) => handleOnTitleChange(e.target.value)}
        inputProps={{
          style: { fontWeight: "bold" },
        }}
      />
      <CustomTextField
        placeholder="Content"
        multiline
        rows={2}
        value={topText}
        onChange={(e) => handleOnTopTextChange(e.target.value)}
      />
      {items?.length > 0 &&
        items.map((item, index) => {
          return (
            <CustomTextField
              className={classes.inputItem}
              key={item.id}
              value={item.value}
              onChange={(e) => handleOnItemChange(e.target.value, item.id)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StopIcon style={{ fontSize: "10px", color: "#8e8e8e" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleRemoveItem(item.id)}
                      className={classes.removeIconButton}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          );
        })}
      <div style={{ marginLeft: 10 }}>
        <QuickAddInput placeholder="Add Item" onSubmit={handleAddItem} />
      </div>
    </div>
  );
};

export default ContentInputForm;
