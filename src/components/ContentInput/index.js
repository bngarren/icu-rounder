import { useState, useEffect, useCallback, useRef, memo } from "react";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Collapse,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import StopIcon from "@material-ui/icons/Stop";
import ClearIcon from "@material-ui/icons/Clear";
import EditAttributesIcon from "@material-ui/icons/EditAttributes";

import clsx from "clsx";

// Components
import ContentInputForm from "./ContentInputForm";
import ContentInputToolbar from "./ContentInputToolbar";

// lodash
import { uniqueId } from "lodash";

const useStylesForContentInput = makeStyles((theme) => ({
  root: {
    flexDirection: "column",
    backgroundColor: "white",
    border: "1px solid #dcdcdc",
    borderRadius: "3px",
    padding: "0px 0px 20px 0px",
    margin: "2px",
    marginTop: "8px",
    minHeight: "225px",
  },
  gridBody: {
    flexDirection: "row",
    flex: "2",
    paddingTop: "15px",
  },
  mainList: {
    padding: 0,
  },
}));

const ContentInput = ({ initialValue, value: data, onChange = (f) => f }) => {
  const classes = useStylesForContentInput();

  /* we use the initialValue prop to know when to reset the content input,
  i.e., get rid of any selected section */
  useEffect(() => {
    setSelectedSection(null);
  }, [initialValue]);

  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // store the selected section
  const [selectedSection, setSelectedSection] = useState(null);

  const shouldFocusOnContentInputForm = useRef(false);

  const handleOnClickSectionContainer = useCallback(
    (id) => {
      shouldFocusOnContentInputForm.current = true;

      // if this section is already selected
      if (selectedSection !== null && selectedSection.id === id) {
        setSelectedSection(null);
        return;
      }

      const sect =
        dataRef.current?.length > 0 &&
        dataRef.current.find((element) => element.id === id);
      setSelectedSection(sect || null);
    },
    [selectedSection]
  );

  const handleContentInputFormChange = useCallback(
    (newSectionData) => {
      const index = dataRef.current.findIndex(
        (el) => el.id === newSectionData.id
      );
      if (index !== -1) {
        let arr = [...dataRef.current];
        arr[index] = newSectionData;

        // the first variable is just a dummy
        onChange(index, arr);
      }
    },
    [onChange]
  );

  /* Add a new blank Section */
  const handleOnAddSection = useCallback(
    (value) => {
      let arr = [...dataRef.current];

      const newSection = {
        id: uniqueId("section-"),
        title: value || "",
        top: "",
        items: [],
      };

      const newArr = arr.concat([newSection]);

      // the first variable is just a dummy
      onChange(0, newArr);

      /* If any empty section is created, focus the input on the ContentInputForm */
      shouldFocusOnContentInputForm.current = !value;

      // set this new section as selected so we can start typing immediately
      setSelectedSection(newSection);
    },
    [onChange]
  );

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

  const handleOnSelectTemplate = useCallback(
    (sectionTitlesArray) => {
      let arr = [];
      sectionTitlesArray.forEach((title) => {
        arr.push({
          id: uniqueId("section-"),
          title: title,
          top: "",
          items: [],
        });
      });

      // first parameter is dummy
      onChange(0, arr);

      setSelectedSection(null);
    },
    [onChange]
  );

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <ContentInputToolbar
          onAddSection={handleOnAddSection}
          onSelectTemplate={handleOnSelectTemplate}
        />
      </Grid>
      <Grid item container xs={12} className={classes.gridBody}>
        <Grid item md={6} style={{ padding: "0px 4px 0px 8px" }}>
          <List component="nav" className={classes.mainList}>
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
          <Collapse in={selectedSection !== null} unmountOnExit timeout={200}>
            <ContentInputForm
              initialData={selectedSection}
              stealFocus={shouldFocusOnContentInputForm.current}
              onContentInputFormChange={handleContentInputFormChange}
            />
          </Collapse>
        </Grid>
      </Grid>
    </Grid>
  );
};

const useStylesForSectionContainer = makeStyles((theme) => ({
  sectionContainer: {
    opacity: "0.6",
    minHeight: "20px",
    cursor: "pointer",
    borderRadius: "3px",
    "&:hover": {
      backgroundColor: "#f8f8f8",
      opacity: "0.7",
    },
    transition: "background linear 0.2s",
  },
  sectionContainerSelected: {
    opacity: "1",
    transition: "background-color 0.3s",
    "&:hover": {
      opacity: "1",
    },
  },
}));

const SectionContainer = memo(function ({
  element,
  selected,
  onClickSection = (f) => f,
  onRemoveSection = (f) => f,
}) {
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
});

const useStylesForSection = makeStyles((theme) => ({
  root: {
    "&:hover $sectionListItemSecondaryAction": {
      visibility: "inherit",
      opacity: 1,
    },
  },
  sectionListItemContainer: {
    padding: "0px",
  },
  sectionListItemRoot: {
    padding: "0px",
  },
  sectionListItemSecondaryAction: {
    right: "2px",
    top: "-2px",
    transform: "none",
    visibility: "hidden",
    opacity: 0,
    transition: "visibility 0s linear 0s, opacity 300ms",
  },
  emptySection: {},
  sectionTopDiv: {
    display: "flex",
    flexDirection: "row",
    flexGrow: "1",
    justifyContent: "space-between",
    paddingRight: "25px",
  },
  sectionTitleText: {
    fontSize: "10pt",
    fontWeight: "bold",
    marginRight: "5px",
  },
  sectionTopText: {
    fontSize: "9pt",
    lineHeight: "1",
    whiteSpace: "pre-line",
  },
  sectionItem: {
    padding: "0 0 0 6px",
  },
  sectionItemTextRoot: {
    margin: "0",
  },
  sectionItemTextPrimary: {
    fontSize: "9pt",
    lineHeight: "1",
  },
  sectionRemoveIconButton: {
    padding: "2px",
    color: theme.palette.secondary.light,
    "&:hover": {
      backgroundColor: theme.palette.secondary.faint,
    },
  },
  sectionEditIcon: {
    alignSelf: "flex-start",
    color: theme.palette.primary.main,
  },
}));

const Section = ({ data, selected, onRemoveSection = (f) => f }) => {
  const classes = useStylesForSection();
  const [open, setOpen] = useState(true);

  const { id, title, top, items } = data;
  const isEmpty = !title && !top && items.length < 1;

  const handleOnClickTitle = () => {
    setOpen((prevValue) => !prevValue);
  };

  return (
    <div className={classes.root}>
      <ListItem
        onClick={handleOnClickTitle}
        classes={{
          root: classes.sectionListItemRoot,
          container: clsx(classes.sectionListItemContainer, {
            [classes.emptySection]: isEmpty,
          }),
        }}
      >
        <div className={classes.sectionTopDiv}>
          <Typography className={classes.sectionTopText}>
            <Typography component="span" className={classes.sectionTitleText}>
              {title && `${title}:`}
              {isEmpty && <i>empty section</i>}
            </Typography>
            {top}
          </Typography>
          {selected && (
            <EditAttributesIcon className={classes.sectionEditIcon} />
          )}
        </div>

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

export default ContentInput;
