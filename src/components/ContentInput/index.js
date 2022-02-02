import { useState, useEffect, useCallback, useRef, memo } from "react";

// MUI
import {
  Grid,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Fade,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import StopIcon from "@mui/icons-material/Stop";
import ClearIcon from "@mui/icons-material/Clear";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

// React Movable
import { List as MovableList, arrayMove } from "react-movable";

// Components
import ContentInputForm from "./ContentInputForm";
import ContentInputToolbar from "./ContentInputToolbar";

// lodash
import { uniqueId } from "lodash";

/* Styling - ContentInput */

const gridRootSx = {
  flexDirection: "column",
  backgroundColor: "white",
  border: "1px solid",
  borderColor: "grey.200",
  borderRadius: "4px",
  padding: "0px 0px 20px 0px",
  margin: "6px 0px 6px 0px",
  minHeight: "225px",
};

const gridHeaderSx = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  paddingTop: "10px",
  paddingBottom: "8px",
  minHeight: "45px",
};

const gridBodySx = {
  flexDirection: "row",
  flex: "2",
  padding: "0px 4px 0px 4px",
};

const nestedContentMarginTop = "15px";

const gridBodyNestedSx = {
  marginTop: nestedContentMarginTop,
};

const StyledMovableLi = styled("li", {
  name: "ContentInput",
  slot: "li",
})(() => ({
  listStyleType: "none",
  "&:focus-visible": {
    outline: `1px dotted "primary.light"`,
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

  /* Content Input */
  return (
    <Grid container sx={gridRootSx}>
      <Grid item xs={12} sx={gridHeaderSx}>
        <Typography
          variant="h6"
          sx={{
            /* needs to match font appearance of
          EditorTextField labels */
            color: "primary.light",
            px: 0.8,
            fontSize: "1rem",
            transform: "scale(0.75)",
          }}
        >
          Content
        </Typography>
        {
          /* ToggleContentType component is passed here as child from BedspaceEditor */
          children
        }
        <ContentInputToolbar
          contentType={id}
          onAddSection={handleOnAddSection}
          onSelectTemplate={handleOnSelectTemplate}
        />
      </Grid>
      <Grid item container xs={12} sx={gridBodySx} spacing={1}>
        {id === "simpleContent" ? (
          /* SIMPLE CONTENT */
          <TextField
            fullWidth
            multiline
            minRows={10}
            maxRows={20}
            value={data}
            onChange={onChange}
            sx={{
              lineHeight: "1.5em",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiOutlinedInput-input": {
                fontSize: "formFontSizeLevel1",
              },
            }}
          />
        ) : (
          /* NESTED CONTENT */
          <>
            <Grid item xs={12} sm sx={gridBodyNestedSx}>
              {data instanceof Array && data?.length > 0 && (
                <MovableList
                  values={data}
                  onChange={handleMoveSection}
                  lockVertically={true}
                  renderList={({ children, props }) => (
                    <List component="nav" sx={{ p: 0 }} {...props}>
                      {children}
                    </List>
                  )}
                  renderItem={({ value, props, isDragged }) => (
                    <StyledMovableLi {...props}>
                      <SectionContainer
                        element={value}
                        selected={selectedSection?.id === value.id}
                        subdued={
                          /* a section is selected, but not this one */
                          !Object.is(selectedSection, null) &&
                          selectedSection?.id !== value.id
                        }
                        isDragged={isDragged}
                        onClickSection={handleOnClickSectionContainer}
                        onRemoveSection={handleRemoveSection}
                      />
                    </StyledMovableLi>
                  )}
                />
              )}
            </Grid>
            {/* ContentInputForm */}
            <Grid
              item
              xs={12}
              sm={selectedSection !== null ? 7 : 5}
              sx={{ marginTop: nestedContentMarginTop }}
            >
              <Fade in={selectedSection !== null} timeout={200}>
                <div>
                  <ContentInputForm
                    initialData={selectedSection}
                    stealFocus={shouldFocusOnContentInputForm.current}
                    onContentInputFormChange={handleContentInputFormChange}
                    onClose={handleCloseContentInputForm}
                  />
                </div>
              </Fade>
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
};

/* Styling - SectionContainer */
const StyledSectionContainerRoot = styled(Box, {
  name: "SectionContainer",
  slot: "Root",
})(() => ({
  // Show buttons on SectionContainer hover; seems to work best from here
  "&:hover .MuiIconButton-root": {
    visibility: "inherit",
    opacity: 1,
  },
}));

const StyledSectionOverlayBox = styled(Box, {
  name: "SectionContainer",
  slot: "overlay",
  shouldForwardProp: (prop) => prop !== "selected",
})(({ selected }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  zIndex: 10,
  display: selected ? "flex" : "none",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "flex-start",
  backgroundColor: "#ffffff33",
  opacity: "1",
  cursor: "pointer",
}));

const SectionContainer = memo(function SectionContainer({
  element,
  selected,
  subdued,
  isDragged,
  onClickSection = (f) => f,
  onRemoveSection = (f) => f,
}) {
  return (
    <StyledSectionContainerRoot
      onClick={() => onClickSection(element.id)}
      sx={{}}
    >
      <Section
        data={element}
        selected={selected}
        isDragged={isDragged}
        subdued={subdued}
        onRemoveSection={onRemoveSection}
      />
      <StyledSectionOverlayBox selected={selected}></StyledSectionOverlayBox>
    </StyledSectionContainerRoot>
  );
});

/* Styling for Section */

const StyledSectionRoot = styled(Box, {
  name: "Section",
  slot: "Root",
  shouldForwardProp: (prop) =>
    prop !== "subdued" && prop !== "isDragged" && prop !== "selected",
})(({ theme, selected, subdued, isDragged }) => ({
  display: "flex",
  flexDirection: "row",
  paddingLeft: "9px",
  cursor: "pointer",
  // Sections that aren't selected should be subdued in appearance
  opacity: subdued ? "0.4" : "1",

  // Show a hovering color, unless currently being dragged or is selected
  ":hover": {
    backgroundColor:
      isDragged || selected ? "transparent" : theme.palette.grey[100],
  },
  ...(isDragged && {}),
}));

const StyledButtonsBox = styled(Box, {
  name: "Section",
  slot: "buttons",
})(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  zIndex: 20,
}));

const StyledSectionTopBox = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  flexGrow: "1",
  justifyContent: "flex-start",
}));

const Section = ({
  data,
  selected,
  isDragged,
  subdued,
  onRemoveSection = (f) => f,
}) => {
  const { id, title, top, items } = data;
  const isEmpty = !title && !top && items.length < 1;

  return (
    <StyledSectionRoot
      selected={selected}
      subdued={subdued}
      isDragged={isDragged}
    >
      <Box sx={{ flexGrow: 1 }}>
        <StyledSectionTopBox>
          <Typography
            sx={{
              fontSize: "formFontSizeLevel2",
              lineHeight: "1",
              whiteSpace: "pre-line",
              width: "100%",
              marginBottom: "2px",
              /* ...(isDragged === true && {
                display: "inline-block",
                maxWidth: "200px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }), */
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: "formFontSizeLevel1",
                fontWeight: "bold",
                marginRight: "5px",
                ...(isEmpty === true && {
                  fontWeight: "normal",
                  letterSpacing: "1.2px",
                }),
              }}
            >
              {title && `${title}:`}
              {isEmpty && "[empty section]"}
            </Typography>
            {top}
            <Typography
              variant="caption"
              component="span"
              sx={{
                display: selected ? "inline" : "none",
                borderRadius: "5px",
                color: "secondary.light",
                backgroundColor: "primary.main",
                fontSize: "0.7rem",
                padding: "1px 2px",
                ml: "3px",
                zIndex: 30,
              }}
            >
              EDITING
            </Typography>
          </Typography>
        </StyledSectionTopBox>

        <List component="ul" disablePadding>
          {items &&
            items.length > 0 &&
            items.map((item) => {
              const itemText = item.value !== "" ? item.value : "";
              return (
                <ListItem
                  sx={{
                    padding: "1px 0 1px 8px",
                  }}
                  key={uniqueId("sectionItem-")}
                >
                  <StopIcon
                    sx={{ fontSize: "0.8rem", color: "primary.light" }}
                  />
                  <ListItemText
                    primary={itemText}
                    sx={{
                      margin: "0",
                      paddingLeft: "3px",
                      "& .MuiListItemText-primary": {
                        fontSize: "formFontSizeLevel3",
                        lineHeight: "1",
                      },
                    }}
                  />
                </ListItem>
              );
            })}
        </List>
      </Box>
      <StyledButtonsBox>
        <IconButton
          // Remove section button (X)
          onClick={(e) => onRemoveSection(e, id)}
          sx={{
            padding: "2px",
            color: "primary.main",
            visibility: "hidden",
            opacity: 0,
            transition: "visibility 0s linear 0s, opacity 300ms",
            "&:hover": {
              backgroundColor: "transparent",
              color: "secondary.dark",
            },
            // if selected, always show the button
            ...(selected === true && {
              visibility: "inherit",
              opacity: 1,
            }),
          }}
        >
          <ClearIcon sx={{ fontSize: "1.2rem" }} />
        </IconButton>
        {selected ? (
          <DragIndicatorIcon
            data-movable-handle
            sx={{
              fontSize: "1.2rem",
              color: "primary.light",
              "&:hover": {
                color: "secondary.dark",
              },
              transform: "rotate(90deg)",
              cursor: isDragged ? "grabbing" : "grab",
            }}
          />
        ) : (
          <div data-movable-handle></div>
        )}
      </StyledButtonsBox>
    </StyledSectionRoot>
  );
};

export default ContentInput;
