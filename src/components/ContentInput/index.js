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
import CustomTextField from "./CustomTextField";
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
  gridHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderBottom: "1px solid #eee",
    minHeight: "45px",
  },
  label: {
    color: theme.palette.secondary.main,
    fontSize: "8.5pt",
    //fontWeight: "600",
    paddingTop: "0px",
    paddingLeft: "10px",
    paddingRight: "10px",
  },
  gridBody: {
    flexDirection: "row",
    flex: "2",
    paddingTop: "0px",
    paddingLeft: "4px",
    paddingRight: "4px",
  },
  gridNestedContent: {
    padding: "15px 4px 0px 0px",
  },
  mainList: {
    padding: 0,
  },
  movableLi: {
    listStyleType: "none",
    "&:focus-visible": {
      outline: `1px dotted ${theme.palette.primary.light}`,
    },
  },
}));

/* 

ContentInput

This component renders either the "simpleContent" input--which is just a standard textfield input, or
the "nestedContent" input--which is a more complex component that allows for structuring the input data
into sections and items, to make for a more compact layout in the actual grid.

The data of this component is managed by its parent CustomFormControlEditor component (similar to the other
inputs in BedspaceEditor). This component receives this data via props and also updates this
data via onChange callback in props as well. Therefore, in essence, both "simpleContent" and "nestedContent"
are still 'controlled' inputs.

*/

const ContentInput = ({
  id,
  initialValue,
  value: data,
  onChange = (f) => f,
  children,
}) => {
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

  const handleCloseContentInputForm = useCallback(() => {
    setSelectedSection(null);
  }, []);

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} className={classes.gridHeader}>
        <Typography variant="h6" className={classes.label}>
          Content
        </Typography>
        {children}
        <ContentInputToolbar
          contentType={id}
          onAddSection={handleOnAddSection}
          onSelectTemplate={handleOnSelectTemplate}
        />
      </Grid>
      <Grid item container xs={12} className={classes.gridBody}>
        {id === "simpleContent" ? (
          <CustomTextField
            variant="filled"
            multiline
            rows={10}
            value={data}
            onChange={onChange}
            style={{
              width: "100%",
              padding: "5px 2px 0 2px",
              fontSize: "8pt",
              lineHeight: "1.5em",
            }}
          />
        ) : (
          <>
            <Grid item xs={12} sm={6} className={classes.gridNestedContent}>
              {data instanceof Array && data?.length > 0 && (
                <MovableList
                  values={data}
                  onChange={handleMoveSection}
                  lockVertically={true}
                  renderList={({ children, props }) => (
                    <List
                      component="nav"
                      className={classes.mainList}
                      {...props}
                    >
                      {children}
                    </List>
                  )}
                  renderItem={({ value, props, isDragged }) => (
                    <li className={classes.movableLi} {...props}>
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
                  onClose={handleCloseContentInputForm}
                />
              </Fade>
            </Grid>
          </>
        )}
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
    backgroundColor: "#ffffff6b !important",
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
      {!isDragged ? (
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
      ) : (
        // Is being dragged so show this instead
        <div className={classes.contentDiv}>
          <Typography
            className={classes.sectionTopText}
            style={{
              display: "inline-block",
              maxWidth: "200px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
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
      )}
    </div>
  );
};

export default ContentInput;
