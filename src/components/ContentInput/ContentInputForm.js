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
import AddBoxIcon from "@mui/icons-material/AddBox";

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
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  margin: 0,
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0px 3px 7px -2px rgba(0,0,0,0.30)",
}));

const StyledHeaderBox = styled(Box, {
  name: "ContentInputForm",
  slot: "header",
})(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  padding: "4px 6px",
  alignItems: "center",
  backgroundColor: theme.palette.primary.light,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
}));

const StyledContentBox = styled(Box, {
  name: "ContentInputForm",
  slot: "body",
})(() => ({
  display: "flex",
  flexDirection: "column",
  padding: "8px 8px 20px 14px",
}));

const StyledTextField = styled(TextField, {
  name: "ContentInputForm",
  slot: "textfield",
})(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    padding: 0,
    fontSize: "1rem",
    lineHeight: "1.2rem",

    "& > fieldset": {
      border: "none",
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "1px 2px 1px 2px",
    //paddingBottom: "2px",
    //paddingLeft: "4px",
    "&:hover": {
      backgroundColor: theme.palette.grey[100],
    },
    "&:focus": {
      color: theme.palette.primary.light,
      backgroundColor: "transparent",
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

  const handleAddItem = (value = "") => {
    setItems((prevValue) => {
      let arr = [...prevValue];
      arr.push({ id: uniqueId("item-"), value: value });

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
            mr: "1rem",
            color: "secondary.light",
            fontSize: {
              xs: "0.85rem",
              lg: "1rem",
            },
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Edit Section
        </Typography>
        <Tooltip title="Close">
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              padding: "0px",
              color: "grey.200",

              "&:hover": {
                backgroundColor: "transparent",
                color: "secondary.light",
              },
            }}
          >
            <CancelIcon sx={{ fontSize: "1.1rem" }} />
          </IconButton>
        </Tooltip>
      </StyledHeaderBox>
      <StyledContentBox>
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
              <List
                sx={{ mt: "0.5rem", padding: "0px 0px 10px 12px" }}
                {...props}
              >
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

        <div style={{}}>
          {/* <QuickAddInput
            label="Balls"
            placeholder="+ Add Item"
            onSubmit={handleAddItem}
            reset={initialData}
          /> */}
          <IconButton onClick={() => handleAddItem()}>
            <AddBoxIcon />
          </IconButton>
        </div>
      </StyledContentBox>
    </StyledRootBox>
  );
};

export default ContentInputForm;
