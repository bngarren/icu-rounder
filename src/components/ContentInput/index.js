import { useState, useEffect, useCallback, useRef } from "react";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Collapse,
  TextField,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import AddBoxIcon from "@material-ui/icons/AddBox";
import StopIcon from "@material-ui/icons/Stop";
import ClearIcon from "@material-ui/icons/Clear";

import clsx from "clsx";

// lodash
import { uniqueId, debounce } from "lodash";

const useStylesForContentInput = makeStyles((theme) => ({
  root: {
    backgroundColor: "white",
    border: "1px solid #dcdcdc",
    borderRadius: "3px",
    padding: "2px 4px 2px 8px",
    margin: "2px",
    marginTop: "8px",
    minHeight: "200px",
  },
}));

const ContentInput = ({ value: data, onChange = (f) => f }) => {
  const classes = useStylesForContentInput();

  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const [selectedSection, setSelectedSection] = useState(null);

  const handleOnClickSectionContainer = (id) => {
    // if this section is already selected
    if (selectedSection !== null && selectedSection.id === id) {
      setSelectedSection(null);
      return;
    }
    // otherwise set the selectedSection to this id's corresponding section
    const sect = data.find((element) => element.id === id);
    setSelectedSection(sect || null);
  };

  const handleContentInputFormChange = useCallback(
    (data, newSectionData) => {
      const index = data.findIndex((el) => el.id === newSectionData.id);
      if (index !== -1) {
        let arr = [...data];
        arr[index] = newSectionData;

        // the first variable is just a dummy
        onChange(index, arr);
      }
    },
    [onChange]
  );

  /* Add a new blank Section */
  const handleOnClickAddSection = useCallback(() => {
    let arr = [...dataRef.current];
    const l = arr.push({
      id: uniqueId("section-"),
      title: "",
      top: "",
      items: [],
    });
    // the first variable is just a dummy
    onChange(l, arr);
  }, [onChange]);

  /* Remove a section, by id */
  const handleRemoveSection = useCallback(
    (e, id) => {
      let arr = [...dataRef.current];
      const index = arr.findIndex((el) => el.id === id);
      if (index === -1) return;

      arr.splice(index, 1);

      // the first variable is just a dummy
      onChange(index, arr);

      e.stopPropagation();

      if (selectedSection?.id === id) {
        setSelectedSection(null);
      }
    },
    [onChange, selectedSection]
  );

  return (
    <Grid container className={classes.root} spacing={1}>
      <Grid item md={6}>
        <IconButton onClick={handleOnClickAddSection}>
          <AddBoxIcon />
        </IconButton>
        <List component="nav">
          {data &&
            data.map((element) => {
              const selected = selectedSection?.id === element.id;
              return (
                <SectionContainer
                  element={element}
                  key={element.id}
                  selected={selected}
                  onClickSection={handleOnClickSectionContainer}
                  onRemoveSection={handleRemoveSection}
                />
              );
            })}
        </List>
      </Grid>
      <Grid item md>
        <Collapse in={selectedSection !== null} unmountOnExit>
          <ContentInputForm
            initialData={selectedSection}
            onContentInputFormChange={(newData) =>
              handleContentInputFormChange(dataRef.current, newData)
            }
          />
        </Collapse>
      </Grid>
    </Grid>
  );
};

const useStylesForSectionContainer = makeStyles((theme) => ({
  sectionContainer: {
    cursor: "pointer",
    borderRadius: "3px",
    padding: "2px",
    "&:hover": {
      border: `2px dotted ${theme.palette.secondary.veryVeryLight}`,
      padding: 0,
    },
  },
  sectionContainerSelected: {
    border: `2px dotted ${theme.palette.primary.main}`,
    transition: "background-color 0.3s",
    "&:hover": {
      borderColor: theme.palette.primary.light,
      padding: "2px",
    },
  },
}));

const SectionContainer = ({
  element,
  selected,
  onClickSection = (f) => f,
  onRemoveSection = (f) => f,
}) => {
  const classes = useStylesForSectionContainer();

  return (
    <div
      className={clsx(classes.sectionContainer, {
        [classes.sectionContainerSelected]: selected,
      })}
      onClick={() => onClickSection(element.id)}
    >
      <Section
        data={element}
        selected={selected}
        onRemoveSection={onRemoveSection}
      />
    </div>
  );
};

const useStylesForSection = makeStyles((theme) => ({
  sectionListItemContainer: {
    padding: "0px",
    minHeight: "15px",
    "&:hover $sectionListItemSecondaryAction": {
      visibility: "inherit",
      opacity: 1,
    },
  },
  sectionListItemRoot: {
    padding: "0px",
  },
  sectionListItemSecondaryAction: {
    right: "2px",
    visibility: "hidden",
    opacity: 0,
    transition: "visibility 0s linear 0s, opacity 300ms",
  },
  emptySection: {
    backgroundColor: "#eee",
  },
  sectionTitleText: {
    fontSize: "10pt",
    fontWeight: "bold",
    marginRight: "5px",
  },
  sectionTopText: {
    fontSize: "9pt",
  },
  sectionItem: {
    padding: "0 0 0 6px",
  },
  sectionItemTextRoot: {
    margin: "0",
  },
  sectionItemTextPrimary: {
    fontSize: "9pt",
  },
  sectionRemoveIconButton: {
    padding: "2px",
  },
}));

const Section = ({ data, onRemoveSection = (f) => f }) => {
  const classes = useStylesForSection();
  const [open, setOpen] = useState(true);

  const { id, title, top, items } = data;
  const isEmpty = !title && !top && items.length < 1;

  const handleOnClickTitle = () => {
    setOpen((prevValue) => !prevValue);
  };

  return (
    <div>
      <ListItem
        onClick={handleOnClickTitle}
        classes={{
          root: classes.sectionListItemRoot,
          container: clsx(classes.sectionListItemContainer, {
            [classes.emptySection]: isEmpty,
          }),
        }}
      >
        <Typography className={classes.sectionTitleText}>
          {title && `${title}:`}
        </Typography>
        <Typography className={classes.sectionTopText}>{top}</Typography>
        <ListItemSecondaryAction
          className={classes.sectionListItemSecondaryAction}
        >
          <IconButton
            className={classes.sectionRemoveIconButton}
            onClick={(e) => onRemoveSection(e, id)}
          >
            <ClearIcon style={{ fontSize: "20px" }} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={true} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items &&
            items.length > 0 &&
            items.map((item, index) => {
              const itemText = item.value !== "" ? item.value : "";
              return (
                <ListItem
                  className={classes.sectionItem}
                  key={uniqueId("sectionItem-")}
                >
                  <StopIcon style={{ fontSize: "9px", color: "#8e8e8e" }} />
                  <ListItemText
                    primary={itemText}
                    classes={{
                      root: classes.sectionItemTextRoot,
                      primary: classes.sectionItemTextPrimary,
                    }}
                  />
                </ListItem>
              );
            })}
        </List>
      </Collapse>
    </div>
  );
};

const useStylesForContentInputForm = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
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
  text: {
    fontSize: "9pt",
    fontWeight: "bold",
    color: theme.palette.primary.main,
    letterSpacing: "0.137573px",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
}));

/* - - - CONTENT INPUT FORM - - -  */
const ContentInputForm = ({
  initialData,
  onContentInputFormChange = (f) => f,
}) => {
  const classes = useStylesForContentInputForm();

  const [title, setTitle] = useState("");
  const [topText, setTopText] = useState("");
  const [items, setItems] = useState([]);

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
  }, [initialData]);

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

  const handleAddItem = () => {
    setItems((prevValue) => {
      let arr = [...prevValue];
      arr.push({ id: uniqueId("item-"), value: "" });

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
      <CustomTextField
        label="Title"
        variant="filled"
        value={title}
        onChange={(e) => handleOnTitleChange(e.target.value)}
      />
      <CustomTextField
        label="Content"
        variant="filled"
        value={topText}
        onChange={(e) => handleOnTopTextChange(e.target.value)}
      />
      <div>
        <IconButton
          className={classes.addIconButton}
          onClick={(e) => handleAddItem(e)}
        >
          <AddBoxIcon />
        </IconButton>
        <span className={classes.text}>Items</span>
      </div>
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
    </div>
  );
};

const useStylesForCustomTextField = makeStyles((theme) => ({
  textFieldRoot: {
    borderBottom: "1.4px dotted #e2e2e1",
    overflow: "hidden",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "white",
    },
    "&$textFieldFocused": {
      backgroundColor: "#fff",
      borderColor: theme.palette.secondary.light,
    },
    paddingBottom: "2px",
    marginBottom: "4px",
  },
  textFieldFocused: {},
  textFieldInputLabelRoot: {
    color: theme.palette.primary.main,
    fontSize: "11pt",
    fontWeight: "bold",
    "&$textFieldInputLabelFocused": {
      color: theme.palette.primary.light,
    },
  },
  textFieldInputLabelFocused: {},
  textFieldInputLabelFilled: {
    "&.MuiInputLabel-shrink.MuiInputLabel-marginDense": {
      transform: "translate(4px, 6px) scale(0.75)",
    },
  },
}));

const CustomTextField = ({ InputProps, InputLabelProps, ...props }) => {
  const classes = useStylesForCustomTextField();
  return (
    <TextField
      InputProps={{
        ...InputProps,
        classes: {
          root: classes.textFieldRoot,
          focused: classes.textFieldFocused,
        },
        disableUnderline: true,
        inputProps: {
          style: {
            fontSize: "10pt",
            paddingBottom: "2px",
            paddingLeft: "4px",
          },
        },
      }}
      InputLabelProps={{
        ...InputLabelProps,
        classes: {
          root: classes.textFieldInputLabelRoot,
          focused: classes.textFieldInputLabelFocused,
          filled: classes.textFieldInputLabelFilled,
        },
        shrink: true,
      }}
      size="small"
      {...props}
    />
  );
};

export default ContentInput;
