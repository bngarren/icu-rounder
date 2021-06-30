import { useState } from "react";
import { List, ListItem, ListItemText, Collapse } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  sectionTitle: {
    padding: "0px",
  },
  sectionTitleTextRoot: {
    margin: 0,
  },
  sectionTitleTextPrimary: {
    fontSize: "8pt",
  },
  sectionItem: {
    padding: "0 0 0 6px",
  },
  sectionItemTextRoot: {
    margin: "0",
  },
  sectionItemTextPrimary: {
    fontSize: "7pt",
  },
}));

const DATA = {
  NEURO: ["Mo, Mz, Dex gtts", "No NSAIDs"],
  CV: ["Nl ECHO", "Epi/NE gtt", "MAP > 50"],
  RESP: ["Int/MV PCV 20/8 x12 40%", "easy airway"],
  FEN: ["NPO MIVF", "PRN Zofran"],
  ID: ["Fever, empiric Vanc + Cefepime", "f/u Cx's"],
  HEME: ["7/10"],
  ENDO: ["would need SDS", "insulin gtt 120-220"],
  ACCESS: ["PICC, AL, GT"],
};

const ContentInput = () => {
  const classes = useStyles();

  return (
    <div>
      <List component="nav">
        {Object.entries(DATA).map((value, key) => {
          return (
            <SectionList
              title={value[0]}
              items={value[1]}
              key={key}
              classes={classes}
            />
          );
        })}
      </List>
    </div>
  );
};

const SectionList = ({ title, items = [], classes }) => {
  const [open, setOpen] = useState(true);

  const handleOnClickTitle = () => {
    setOpen((prevValue) => !prevValue);
  };

  return (
    <>
      <ListItem onClick={handleOnClickTitle} className={classes.sectionTitle}>
        <ListItemText
          primary={title}
          classes={{
            root: classes.sectionTitleTextRoot,
            primary: classes.sectionTitleTextPrimary,
          }}
        />
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items.map((i) => {
            return (
              <ListItem className={classes.sectionItem}>
                <ListItemText
                  primary={i}
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
