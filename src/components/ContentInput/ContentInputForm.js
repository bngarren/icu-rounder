import { useState, useRef, useCallback, useEffect } from "react";

import {
  List,
  InputAdornment,
  IconButton,
  Typography,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import StopIcon from "@material-ui/icons/Stop";
import ClearIcon from "@material-ui/icons/Clear";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import CancelIcon from "@material-ui/icons/Cancel";

// React Movable
import { List as MovableList, arrayMove } from "react-movable";

// components
import CustomTextField from "./CustomTextField";
import QuickAddInput from "./QuickAddInput";

// context
import { useDebouncedContext } from "../../pages/UpdatePage/DebouncedContext";

//lodash
import { uniqueId, debounce } from "lodash";

const useStylesForContentInputForm = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    borderLeft: `4px solid ${theme.palette.secondary.light}`,
    borderImageSource: theme.palette.primary.verticalGradient,
    borderImageSlice: 1,
    marginTop: "4px",
    padding: "2px 4px 30px 4px",
    boxShadow:
      "rgb(0 0 0 / 7%) 0px 6px 24px 0px, rgb(0 0 0 / 35%) 0px 0px 0px 1px",
    borderRadius: "4px",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: theme.palette.primary.main,
    fontSize: "11pt",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: "4px",
    flexGrow: "1",
    textAlign: "center",
    letterSpacing: "1px",
  },
  closeButton: {
    padding: "4px",
    transform: "translate(6px, -2px)",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.light,
    },
  },
  closeButtonIcon: {
    fontSize: "14pt",
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
  inputItem: {
    width: "100%",
  },
  bullet: {
    fontSize: "10px",
    color: "#626060",
  },
  quickAddInput: {
    width: "85%",
  },
}));

/* - - - CONTENT INPUT FORM - - -  */
const ContentInputForm = ({
  initialData,
  stealFocus = false,
  onContentInputFormChange = (f) => f,
  onClose = (f) => f,
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

  /* Keep reference to this debounced function's id so it can be tracked in DebouncedContext */
  const debouncedFunctionId = useRef(uniqueId("ContentInputForm"));

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

  const { addDebouncedFunction, removeDebouncedFunction } =
    useDebouncedContext();
  /* Add this debounced function to an array held by DebouncedContext so that it
    can be flushed/canceled if needed */
  useEffect(() => {
    const id = debouncedFunctionId.current;
    addDebouncedFunction(debouncedNotifyParent, id);
    return () => {
      removeDebouncedFunction(id);
    };
  }, [addDebouncedFunction, removeDebouncedFunction, debouncedNotifyParent]);

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
      <div className={classes.header}>
        <Typography variant="h4" className={classes.headerText}>
          Edit Section
        </Typography>
        <Tooltip title="Close">
          <IconButton className={classes.closeButton} onClick={onClose}>
            <CancelIcon className={classes.closeButtonIcon} />
          </IconButton>
        </Tooltip>
      </div>
      <CustomTextField
        ref={refToTitle}
        placeholder="Title"
        tooltip="Section Title"
        value={title}
        onChange={(e) => handleOnTitleChange(e.target.value)}
        inputProps={{
          style: { fontWeight: "bold", fontSize: "11.5pt" },
        }}
      />
      <CustomTextField
        placeholder="Content"
        tooltip="Content"
        multiline
        rows={2}
        rowsMax={3}
        value={topText}
        onChange={(e) => handleOnTopTextChange(e.target.value)}
        style={{ paddingTop: "5px" }}
      />
      {items?.length > 0 && (
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
                multiline
                rows={1}
                rowsMax={3}
                style={{ padding: 0 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      style={{
                        marginRight: "2px",
                        alignSelf: "flex-start",
                        marginTop: "10px",
                      }}
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
      )}

      <div style={{ marginTop: 10, marginLeft: 10 }}>
        <QuickAddInput
          className={classes.quickAddInput}
          placeholder="Add Item"
          tooltip="Add Item"
          onSubmit={handleAddItem}
        />
      </div>
    </div>
  );
};

export default ContentInputForm;
