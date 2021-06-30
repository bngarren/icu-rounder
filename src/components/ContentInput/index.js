import { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Grid,
  Typography,
  Collapse,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

// Components
import UpDownArrows from "../UpDownArrows";

// lodash
import { uniqueId } from "lodash";

const DATA = [
  {
    id: uniqueId("section-"),
    title: "NEURO",
    top: "Mo, Mz, Dex gtts, No NSAIDs",
    items: ["MR brain today"],
  },
  { id: uniqueId("section-"), title: "CV", top: "had normal ECHO", items: [] },
  {
    id: uniqueId("section-"),
    title: "RESP",
    top: "easy airway; PCV 24/8 x12 40%",
    items: ["add nebs", "wean to extubate"],
  },
  { id: uniqueId("section-"), title: "FEN", top: "PN/IL ~100mkd", items: [] },
  {
    id: uniqueId("section-"),
    title: "ID",
    top: "New fever 6/15, empiric Vanc + Cefepime",
    items: ["f/u Cx's"],
  },
  { id: uniqueId("section-"), title: "HEME", top: "7/10" },
  { id: uniqueId("section-"), title: "ACCESS", top: "PICC, AL, GT" },
];

const useStylesForContentInput = makeStyles((theme) => ({
  sectionContainer: {
    display: "flex",
    flexDirection: "row",
  },
}));

const ContentInput = () => {
  const classes = useStylesForContentInput();

  const [sections, setSections] = useState();

  useEffect(() => {
    setSections(DATA);
  }, []);

  return (
    <div>
      <List component="nav">
        {sections &&
          sections.map((element, index) => {
            return (
              <div key={element.id} className={classes.sectionContainer}>
                <UpDownArrows />
                <div>
                  <SectionList
                    title={element.title || ""}
                    top={element.top || ""}
                    items={element.items || []}
                    classes={classes}
                  />
                </div>
              </div>
            );
          })}
      </List>
    </div>
  );
};

const useStylesForSectionList = makeStyles((theme) => ({
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

const SectionList = ({ title, top, items }) => {
  const classes = useStylesForSectionList();
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
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items &&
            items.length > 0 &&
            items.map((element, index) => {
              return (
                <ListItem
                  className={classes.sectionItem}
                  key={uniqueId("sectionItem-")}
                >
                  <ListItemText
                    primary={element}
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

export default ContentInput;
