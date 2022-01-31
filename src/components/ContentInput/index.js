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
  borderBottom: "1px solid #eee",
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
            <Grid item xs={12} sm={6} sx={gridBodyNestedSx}>
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
              sm={6}
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

// eslint-disable-next-line react/display-name
const SectionContainer = memo(function ({
  element,
  selected,
  isDragged,
  onClickSection = (f) => f,
  onRemoveSection = (f) => f,
}) {
  return (
    <Box
      onClick={() => onClickSection(element.id)}
      sx={{
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
        ...(selected === true && {
          opacity: "1",
          transition: "background-color 0.3s",
          boxShadow:
            "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.04) 0px 0px 0px 1px",
          "&:hover": {
            opacity: "1",
          },
        }),
        ...(isDragged === true && {
          border: "1px dashed #988b8b",
          opacity: 1,
          backgroundColor: "#ffffff6b !important",
        }),
      }}
    >
      <Section
        data={element}
        selected={selected}
        isDragged={isDragged}
        onRemoveSection={onRemoveSection}
      />
    </Box>
  );
});

/* Styling */

const StyledRootBox = styled(Box, {
  name: "Section",
  slot: "Root",
})(() => ({
  display: "flex",
  flexDirection: "row",
  "&:hover .MuiIconButton-root": {
    visibility: "inherit",
    opacity: 1,
  },
}));

const StyledButtonsBox = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  borderRight: "3px solid transparent",
}));

const StyledSectionTopBox = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  flexGrow: "1",
  justifyContent: "flex-start",
}));

const Section = ({ data, selected, isDragged, onRemoveSection = (f) => f }) => {
  const { id, title, top, items } = data;
  const isEmpty = !title && !top && items.length < 1;

  return (
    <StyledRootBox>
      <StyledButtonsBox>
        <IconButton
          onClick={(e) => onRemoveSection(e, id)}
          sx={{
            padding: "2px",
            color: "primary.main",
            visibility: "hidden",
            opacity: 0,
            transition: "visibility 0s linear 0s, opacity 300ms",
            "&:hover": {
              color: "secondary.dark",
            },
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
      <Box sx={{ flexGrow: 1 }}>
        <StyledSectionTopBox>
          <Typography
            sx={{
              fontSize: "formFontSizeLevel2",
              lineHeight: "1",
              whiteSpace: "pre-line",
              width: "100%",
              marginBottom: "2px",
              ...(isDragged === true && {
                display: "inline-block",
                maxWidth: "200px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }),
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
                  letterSpacing: "2px",
                }),
              }}
            >
              {title && `${title}:`}
              {isEmpty && <i>empty section</i>}
            </Typography>
            {top}
          </Typography>
        </StyledSectionTopBox>
        {!isDragged && (
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
        )}{" "}
      </Box>
    </StyledRootBox>
  );
};

export default ContentInput;
