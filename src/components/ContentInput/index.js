import { useState, useEffect, useCallback, useRef } from "react";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  Collapse,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import clsx from "clsx";

// lodash
import { uniqueId, debounce } from "lodash";

const useStylesForContentInput = makeStyles((theme) => ({}));

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
    <Grid container>
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
    "&:hover": {
      backgroundColor: "#dcdcdc",
    },
  },
  sectionContainerSelected: {
    backgroundColor: "#9a9a9a6a",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#9a9a9a",
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
      />
    </div>
  );
};

const useStylesForSection = makeStyles((theme) => ({
  sectionTitle: {
    padding: "0px",
  },
  sectionTitleText: {
    fontSize: "9pt",
    fontWeight: "bold",
    marginRight: "5px",
  },
  sectionTopText: {
    fontSize: "8pt",
  },
  sectionItem: {
    padding: "0 0 0 6px",
  },
  sectionItemTextRoot: {
    margin: "0",
  },
  sectionItemTextPrimary: {
    fontSize: "8pt",
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
              return (
                <ListItem
                  className={classes.sectionItem}
                  key={uniqueId("sectionItem-")}
                >
                  <ListItemText
                    primary={item.value}
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
  inputItem: {
    marginLeft: "10px",
  },
}));

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
    let arr = [];
    setItems((prevValue) => {
      arr = [...prevValue];
      const index = arr.findIndex((el) => el.id === id);
      if (index === -1) return;
      arr[index] = { id: id, value: val || "" };
      return arr;
    });
    debouncedNotifyParent({ ...getSectionObject(), items: arr });
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
      <input
        value={title}
        onChange={(e) => handleOnTitleChange(e.target.value)}
      />
      <input
        value={topText}
        onChange={(e) => handleOnTopTextChange(e.target.value)}
      />
      {items?.length > 0 &&
        items.map((item, index) => {
          return (
            <input
              className={classes.inputItem}
              key={item.id}
              value={item.value}
              onChange={(e) => handleOnItemChange(e.target.value, item.id)}
            />
          );
        })}
    </div>
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
