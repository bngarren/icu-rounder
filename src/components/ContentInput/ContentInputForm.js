import { useState, useRef, useCallback, useEffect } from "react";

import {
  List,
  InputAdornment,
  IconButton,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import StopIcon from "@material-ui/icons/Stop";
import ClearIcon from "@material-ui/icons/Clear";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

// React Movable
import { List as MovableList, arrayMove } from "react-movable";

// components
import CustomTextField from "./CustomTextField";
import QuickAddInput from "./QuickAddInput";

//lodash
import { uniqueId, debounce } from "lodash";

const useStylesForContentInputForm = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    borderLeft: `3px solid ${theme.palette.secondary.main}`,
    padding: "4px 4px 8px 4px",
    boxShadow:
      "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
  },
  header: {
    color: theme.palette.primary.main,
    fontSize: "10pt",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: "4px",
    textAlign: "center",
  },
  itemList: {
    padding: "0px 0px 10px 12px",
  },
  addIconButton: {
    padding: 6,
  },
  removeIconButton: {
    padding: 2,
  },
  removeIcon: {
    fontSize: "18px",
  },
  dragIcon: {
    fontSize: "18px",
    color: "#626060",
    "&:hover": {
      color: theme.palette.secondary.light,
    },
    transform: "rotate(90deg)",
  },
  inputItem: {},
  bullet: {
    fontSize: "10px",
    color: "#626060",
  },
}));

/* - - - CONTENT INPUT FORM - - -  */
const ContentInputForm = ({
  initialData,
  stealFocus = false,
  onContentInputFormChange = (f) => f,
  ...props
}) => {
  const classes = useStylesForContentInputForm();

  const [title, setTitle] = useState("");
  const [topText, setTopText] = useState("");
  const [items, setItems] = useState([]);

  const refToTitle = useRef();

  const getSectionObject = useCallback(() => {
    return {
      id: initialData?.id,
      title: title,
      top: topText,
      items: items,
    };
  }, [initialData?.id, items, title, topText]);

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

  const handleMoveItem = useCallback(
    ({ oldIndex, newIndex }) => {
      setItems((prevValue) => {
        let arr = arrayMove(prevValue, oldIndex, newIndex);
        debouncedNotifyParent({
          ...getSectionObject(),
          items: arr,
        });
        return arr;
      });
    },
    [debouncedNotifyParent, getSectionObject]
  );

  return (
    <div className={classes.root} {...props}>
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
        rows={1}
        rowsMax={2}
        value={topText}
        onChange={(e) => handleOnTopTextChange(e.target.value)}
      />
      <MovableList
        values={items}
        onChange={handleMoveItem}
        lockVertically={true}
        renderList={({ children, props }) => (
          <List className={classes.itemList} {...props}>
            {children}
          </List>
        )}
        renderItem={({ value, props, isDragged }) => (
          <li
            {...props}
            style={{
              ...props.style,
              listStyleType: "none",
            }}
          >
            <CustomTextField
              className={classes.inputItem}
              key={value.id}
              value={value.value}
              onChange={(e) => handleOnItemChange(e.target.value, value.id)}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    style={{ marginRight: "2px" }}
                  >
                    <StopIcon className={classes.bullet} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <DragIndicatorIcon
                      className={classes.dragIcon}
                      data-movable-handle
                      style={{ cursor: isDragged ? "grabbing" : "grab" }}
                    />
                    <IconButton
                      onClick={() => handleRemoveItem(value.id)}
                      className={classes.removeIconButton}
                    >
                      <ClearIcon className={classes.removeIcon} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </li>
        )}
      />

      <div style={{ marginLeft: 10 }}>
        <QuickAddInput placeholder="Add Item" onSubmit={handleAddItem} />
      </div>
    </div>
  );
};

export default ContentInputForm;
