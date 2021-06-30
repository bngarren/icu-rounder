import { useState, useEffect, useCallback, useRef, memo } from "react";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Fade,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import StopIcon from "@material-ui/icons/Stop";
import ClearIcon from "@material-ui/icons/Clear";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

import clsx from "clsx";

// React Movable
import { List as MovableList, arrayMove } from "react-movable";

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
    paddingLeft: "4px",
    paddingRight: "8px",
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

  const handleMoveSection = useCallback(
    ({ oldIndex, newIndex }) => {
      onChange(0, arrayMove(dataRef.current, oldIndex, newIndex));
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
        <Grid item xs={12} sm={6} style={{ padding: "0px 4px 0px 0px" }}>
          {data?.length > 0 && (
            <MovableList
              values={data}
              onChange={handleMoveSection}
              lockVertically={true}
              renderList={({ children, props }) => (
                <List component="nav" className={classes.mainList} {...props}>
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
                  <SectionContainer
                    element={value}
                    selected={selectedSection?.id === value.id}
                    isDragged={isDragged}
                    onClickSection={handleOnClickSectionContainer}
                    onRemoveSection={handleRemoveSection}
                  />
                </li>
              )}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Fade in={selectedSection !== null} timeout={200}>
            <ContentInputForm
              initialData={selectedSection}
              stealFocus={shouldFocusOnContentInputForm.current}
              onContentInputFormChange={handleContentInputFormChange}
            />
          </Fade>
        </Grid>
      </Grid>
    </Grid>
  );
};

const useStylesForSectionContainer = makeStyles((theme) => ({
  sectionContainer: {
    backgroundColor: "white",
    opacity: "0.6",
    minHeight: "20px",
    marginBottom: "5px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f8f8f8",
      opacity: "0.7",
    },
    transition: "background linear 0.2s",
  },
  sectionContainerSelected: {
    opacity: "1",
    transition: "background-color 0.3s",
    boxShadow:
      "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.04) 0px 0px 0px 1px",
    "&:hover": {
      opacity: "1",
    },
  },
  sectionContainerDragged: {
    border: "1px dashed #988b8b",
    opacity: 1,
  },
}));

const SectionContainer = memo(function ({
  element,
  selected,
  isDragged,
  onClickSection = (f) => f,
  onRemoveSection = (f) => f,
}) {
  const classes = useStylesForSectionContainer();

  return (
    <div
      className={clsx(classes.sectionContainer, {
        [classes.sectionContainerSelected]: selected,
        [classes.sectionContainerDragged]: isDragged,
      })}
      onClick={() => onClickSection(element.id)}
    >
      <Section
        data={element}
        selected={selected}
        isDragged={isDragged}
        onRemoveSection={onRemoveSection}
      />
    </div>
  );
});

const useStylesForSection = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    "&:hover $sectionRemoveIconButton": {
      visibility: "inherit",
      opacity: 1,
    },
  },
  buttonsDiv: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRight: "3px solid transparent",
  },
  buttonsDivSelected: {},
  contentDiv: {
    marginLeft: "6px",
    flexGrow: 1,
  },
  emptySection: {},
  sectionTopDiv: {
    display: "flex",
    flexDirection: "row",
    flexGrow: "1",
    justifyContent: "flex-start",
  },
  sectionDragIndicatorIcon: {
    fontSize: "20px",
    color: "#626060",
    "&:hover": {
      color: theme.palette.secondary.light,
    },
    transform: "rotate(90deg)",
  },
  sectionRemoveIconButton: {
    padding: "2px",
    color: theme.palette.secondary.light,
    visibility: "hidden",
    opacity: 0,
    transition: "visibility 0s linear 0s, opacity 300ms",
    "&:hover": {
      backgroundColor: theme.palette.secondary.faint,
    },
  },
  sectionRemoveIconButtonSelected: {
    visibility: "inherit",
    opacity: 1,
  },
  sectionTitleText: {
    fontSize: "10pt",
    fontWeight: "bold",
    marginRight: "5px",
  },
  sectionTitleTextEmpty: {
    fontWeight: "normal",
    letterSpacing: "2px",
  },
  sectionTopText: {
    fontSize: "9pt",
    lineHeight: "1",
    whiteSpace: "pre-line",
    width: "100%",
    marginBottom: "2px",
  },
  sectionItem: {
    padding: "1px 0 1px 8px",
  },
  sectionItemTextRoot: {
    margin: "0",
    paddingLeft: "3px",
  },
  sectionItemTextPrimary: {
    fontSize: "9pt",
    lineHeight: "1",
  },
}));

const Section = ({ data, selected, isDragged, onRemoveSection = (f) => f }) => {
  const classes = useStylesForSection();

  const { id, title, top, items } = data;
  const isEmpty = !title && !top && items.length < 1;

  return (
    <div className={classes.root}>
      <div
        className={clsx(classes.buttonsDiv, {
          [classes.buttonsDivSelected]: selected,
        })}
      >
        <IconButton
          className={clsx(classes.sectionRemoveIconButton, {
            [classes.sectionRemoveIconButtonSelected]: selected,
          })}
          onClick={(e) => onRemoveSection(e, id)}
        >
          <ClearIcon style={{ fontSize: "20px" }} />
        </IconButton>
        {selected ? (
          <DragIndicatorIcon
            data-movable-handle
            className={classes.sectionDragIndicatorIcon}
            style={{ cursor: isDragged ? "grabbing" : "grab" }}
          />
        ) : (
          <div data-movable-handle></div>
        )}
      </div>
      <div className={classes.contentDiv}>
        <div
          className={clsx(classes.sectionTopDiv, {
            [classes.emptySection]: isEmpty,
          })}
        >
          <Typography className={classes.sectionTopText}>
            <Typography
              component="span"
              className={clsx(classes.sectionTitleText, {
                [classes.sectionTitleTextEmpty]: isEmpty,
              })}
            >
              {title && `${title}:`}
              {isEmpty && <i>empty section</i>}
            </Typography>
            {top}
          </Typography>
        </div>
        <List component="ul" disablePadding>
          {items &&
            items.length > 0 &&
            items.map((item, index) => {
              const itemText = item.value !== "" ? item.value : "";
              return (
                <ListItem
                  className={classes.sectionItem}
                  key={uniqueId("sectionItem-")}
                >
                  <StopIcon style={{ fontSize: "9px", color: "#626060" }} />
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
      </div>
    </div>
  );
};

export default ContentInput;
