import { useState, useRef, useCallback, useEffect } from "react";

// MUI
import {
  Box,
  List,
  InputAdornment,
  IconButton,
  Typography,
  Tooltip,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import StopIcon from "@mui/icons-material/Stop";
import ClearIcon from "@mui/icons-material/Clear";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import CancelIcon from "@mui/icons-material/Cancel";

// React Movable
import { List as MovableList, arrayMove } from "react-movable";

// Components
import QuickAddInput from "./QuickAddInput";

// Context
import { useDebouncedContext } from "../../pages/UpdatePage/DebouncedContext";

//lodash
import { uniqueId, debounce } from "lodash";

/* Styling */
const StyledRootBox = styled(Box, {
  name: "ContentInputForm",
  slot: "Root",
})(() => ({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  margin: 0,
  padding: "20px 10px 30px 10px",
  borderRadius: "2px",
  boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
}));

const StyledHeaderBox = styled(Box, {
  name: "ContentInputForm",
  slot: "header",
})(() => ({
  display: "flex",
  flexDirection: "row",
  position: "absolute",
  top: "5px",
  right: "10px",
  zIndex: 10,
  alignItems: "center",
}));

const StyledTextField = styled(TextField, {
  name: "ContentInputForm",
  slot: "textfield",
})(() => ({
  "& .MuiOutlinedInput-root": {
    padding: 0,
    fontSize: "1rem",
    lineHeight: "1.3rem",

    "& > fieldset": {
      border: "none",
    },
  },
  "& .MuiOutlinedInput-input": {
    borderBottom: "1px dotted transparent",
    transition: "border-color linear 0.1s",
    paddingBottom: "2px",
    paddingLeft: "4px",
    "&:hover": {
      borderColor: "#5f5f5f",
    },
    "&:focus": {
      borderStyle: "solid",
      borderColor: "#a9a9a9",
    },
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
    <StyledRootBox {...props}>
      <StyledHeaderBox>
        <Typography
          variant="h4"
          sx={{
            color: "secondary.dark",
            fontSize: {
              xs: "0.9rem",
              lg: "1.2rem",
            },
            fontWeight: "bold",
            textTransform: "uppercase",
            flexGrow: "1",
            letterSpacing: "1px",
            textAlign: "end",
          }}
        >
          Edit Section
        </Typography>
        <Tooltip title="Close">
          <IconButton
            onClick={onClose}
            size="large"
            sx={{
              padding: "0px",
              transform: "translate(6px, -2px)",
              color: "secondary.dark",

              "&:hover": {
                backgroundColor: "transparent",
                color: "primary.light",
              },
            }}
          >
            <CancelIcon sx={{ fontSize: "1.3rem" }} />
          </IconButton>
        </Tooltip>
      </StyledHeaderBox>
      <StyledTextField
        ref={refToTitle}
        placeholder="Title"
        value={title}
        onChange={(e) => handleOnTitleChange(e.target.value)}
        size="small"
        inputProps={{
          sx: { fontWeight: "bold", fontSize: "1.3rem" },
        }}
      />
      <StyledTextField
        placeholder="Content"
        multiline
        minRows={1}
        maxRows={4}
        value={topText}
        onChange={(e) => handleOnTopTextChange(e.target.value)}
        size="small"
      />
      {items?.length > 0 && (
        <MovableList
          values={items}
          onChange={handleMoveItem}
          lockVertically={true}
          renderList={({ children, props }) => (
            <List sx={{ padding: "0px 0px 10px 12px" }} {...props}>
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
              <StyledTextField
                key={value.id}
                value={value.value}
                onChange={(e) => handleOnItemChange(e.target.value, value.id)}
                size="small"
                multiline
                minRows={1}
                maxRows={10}
                sx={{
                  width: "100%",
                  padding: 0,
                  "& .MuiOutlinedInput-input": {
                    fontSize: "formFontSizeLevel1",
                  },
                  "&:hover .MuiInputAdornment-root": {
                    visibility: "inherit",
                    opacity: 1,
                  },
                }}
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
                      <StopIcon
                        sx={{
                          fontSize: "0.8rem",
                          color: "primary.light",
                        }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      sx={{
                        visibility: "hidden",
                        opacity: 0,
                        transition: "opacity linear 0.2s",
                      }}
                    >
                      <DragIndicatorIcon
                        data-movable-handle
                        sx={{
                          cursor: isDragged ? "grabbing" : "grab",
                          fontSize: "1.3rem",
                          color: "primary.main",
                          "&:hover": {
                            color: "primary.light",
                          },
                          transform: "rotate(90deg)",
                        }}
                      />
                      <IconButton
                        onClick={() => handleRemoveItem(value.id)}
                        sx={{ padding: "2px" }}
                        size="large"
                      >
                        <ClearIcon sx={{ fontSize: "1.3rem" }} />
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
          placeholder="+ Add Item"
          onSubmit={handleAddItem}
          reset={initialData}
        />
      </div>
    </StyledRootBox>
  );
};

export default ContentInputForm;
