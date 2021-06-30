import { useState, useEffect, useCallback, useRef } from "react";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
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
  },
}));

const ContentInput = () => {
  const classes = useStylesForContentInput();

  const [sections, setSections] = useState();
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    setSections(DATA);
  }, []);

  const handleOnClickSectionContainer = (id) => {
    // if this section is already selected
    if (selectedSection !== null && selectedSection.id === id) {
      setSelectedSection(null);
      return;
    }
    // otherwise set the selectedSection to this id's corresponding section
    const sect = sections.find((element) => element.id === id);
    setSelectedSection(sect || null);
  };

  const handleContentInputFormChange = (newSectionData) => {
    const index = sections.findIndex((el) => el.id === newSectionData.id);
    if (index !== -1) {
      setSections((prevValue) => {
        let arr = [...prevValue];
        arr[index] = newSectionData;
        return arr;
      });
    }
  };

  return (
    <Grid container className={classes.root} spacing={1}>
      <Grid item md={6}>
        <List component="nav">
          {sections &&
            sections.map((element) => {
              const selected = selectedSection?.id === element.id;
              return (
                <SectionContainer
                  element={element}
                  key={element.id}
                  selected={selected}
                  onClickSection={handleOnClickSectionContainer}
                />
              );
            })}
        </List>
      </Grid>
      <Grid item md>
        <Collapse in={selectedSection !== null} unmountOnExit>
          <ContentInputForm
            initialData={selectedSection}
            onContentInputFormChange={handleContentInputFormChange}
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

const SectionContainer = ({ element, selected, onClickSection = (f) => f }) => {
  const classes = useStylesForSectionContainer();

  return (
    <div
      className={clsx(classes.sectionContainer, {
        [classes.sectionContainerSelected]: selected,
      })}
      onClick={() => onClickSection(element.id)}
    >
      <Section
        title={element.title || ""}
        top={element.top || ""}
        items={element.items || []}
        selected={selected}
      />
    </div>
  );
};

const useStylesForSection = makeStyles((theme) => ({
  sectionTitle: {
    padding: "0px",
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
}));

const Section = ({ title, top, items }) => {
  const classes = useStylesForSection();
  const [open, setOpen] = useState(true);

  const handleOnClickTitle = () => {
    setOpen((prevValue) => !prevValue);
  };

  return (
    <>
      <ListItem onClick={handleOnClickTitle} className={classes.sectionTitle}>
        <Typography className={classes.sectionTitleText}>{title}:</Typography>
        <Typography className={classes.sectionTopText}>{top}</Typography>
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
    </>
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

const DATA = [
  {
    id: uniqueId("section-"),
    title: "NEURO",
    top: "Mo, Mz, Dex gtts, No NSAIDs",
    items: [{ id: uniqueId("item-"), value: "MR brain today" }],
  },
  { id: uniqueId("section-"), title: "CV", top: "had normal ECHO", items: [] },
  {
    id: uniqueId("section-"),
    title: "RESP",
    top: "easy airway; PCV 24/8 x12 40%",
    items: [
      { id: uniqueId("item-"), value: "add nebs" },
      { id: uniqueId("item-"), value: "wean to extubate" },
    ],
  },
  { id: uniqueId("section-"), title: "FEN", top: "PN/IL ~100mkd", items: [] },
  {
    id: uniqueId("section-"),
    title: "ID",
    top: "New fever 6/15, empiric Vanc + Cefepime",
    items: [{ id: uniqueId("item-"), value: "f/u Cx's" }],
  },
  { id: uniqueId("section-"), title: "HEME", top: "7/10" },
  { id: uniqueId("section-"), title: "ACCESS", top: "PICC, AL, GT" },
];

export default ContentInput;
