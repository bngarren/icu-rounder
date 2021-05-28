import { useState, useCallback, useRef, useContext } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
  Tooltip,
  Typography,
  Paper,
  useMediaQuery,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import MenuIcon from "@material-ui/icons/Menu";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";

import { makeStyles, useTheme } from "@material-ui/styles";

// Utility
import { isBedEmpty } from "../../utils/Utility";

// Popover
import { usePopupState, bindTrigger } from "material-ui-popup-state/hooks";
import TableBedListPopover from "../TableBedListPopover";

// Context
import { BedActionsContext } from "../../pages/UpdatePage";

const useStyles = makeStyles((theme) => ({
  tableContainer: {},
  table: {},
  tableRow: {
    "&.Mui-selected": {
      background: `linear-gradient(90deg, ${theme.palette.secondary.main} 1%, rgba(0,212,255,0) 1%)`,
    },
    "&.Mui-selected:hover": {
      background: `linear-gradient(90deg, ${theme.palette.secondary.light} 1%, rgba(0,212,255,0) 1%)`,
    },
  },
  tableHeader: {
    backgroundColor: "#f6f8fa",
    color: "black",
    padding: "4px 2px 4px 10px",
  },
  tableHeaderBedNumber: {
    color: "#626060",
    fontWeight: "bold",
  },
  tableEditButton: {
    cursor: "pointer",
    color: "#626060",
    fontSize: "22px",
  },
  tableEditButtonSelected: {
    color: theme.palette.secondary.main,
  },
  tableDeleteButton: {
    cursor: "pointer",
    fontSize: "22px",
    color: "#626060",
  },
  transparent: {
    color: "transparent",
  },
  tableCellDefault: {
    padding: "3px 10px 3px 15px",
    fontSize: "11pt",
  },
  tableCellSmall: {
    padding: "2px 2px 2px 10px",
    fontSize: "10pt",
  },
  tablePaginationRoot: {
    overflow: "hidden",
    padding: 0,
  },
  tablePaginationToolbar: {
    paddingLeft: "5px",
  },
  tablePaginationInput: {
    marginRight: "15px",
  },
  tablePaginationCaption: {
    fontSize: "9pt",
  },
  tablePaginationButton: {
    padding: "6px",
  },
}));

const ROWS_PER_PAGE = 15;

const TableBedList = ({ data, selectedKey }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const media_atleast_lg = useMediaQuery("(min-width:1280px)");

  // table pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  //

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHeader} style={{ minWidth: 30 }}>
              Bed
            </TableCell>
            <TableCell
              className={classes.tableHeader}
              style={{ width: "100%" }}
            >
              Patient
            </TableCell>
            <TableCell
              className={classes.tableHeader}
              style={{ minWidth: 30, maxWidth: 30 }}
            >
              Team
            </TableCell>
            <TableCell
              className={classes.tableHeader}
              style={{ minWidth: "30px", maxWidth: "30px" }}
            />
          </TableRow>
        </TableHead>
        <MyTableBody
          classes={classes}
          data={data}
          page={page}
          rowsPerPage={rowsPerPage}
          selectedKey={selectedKey}
        />
      </Table>
      <TablePagination
        classes={{
          root: classes.tablePaginationRoot,
          toolbar: classes.tablePaginationToolbar,
          input: classes.tablePaginationInput,
          caption: classes.tablePaginationCaption,
        }}
        backIconButtonProps={{
          classes: {
            root: classes.tablePaginationButton,
          },
        }}
        nextIconButtonProps={{
          classes: {
            root: classes.tablePaginationButton,
          },
        }}
        rowsPerPageOptions={[5, 15, 30]}
        colSpan={5}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

const MyTableBody = ({ classes, data, page, rowsPerPage, selectedKey }) => {
  const media_atleast_lg = useMediaQuery("(min-width:1280px)");

  const tableCellClasses = [
    classes.tableCellDefault,
    !media_atleast_lg && classes.tableCellSmall,
  ].join(" ");

  return (
    <>
      <TableBody>
        {data
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((value, key) => {
            let adjustedKey = key + page * rowsPerPage; // the key resets to index 0 for every pagination page
            let isSelected = adjustedKey === selectedKey;
            const emptyBed = isBedEmpty(value);
            return (
              <TableRow
                className={classes.tableRow}
                key={value.bed}
                hover
                selected={isSelected}
              >
                <TableCell
                  component="th"
                  scope="row"
                  align="left"
                  className={tableCellClasses}
                >
                  <Typography
                    variant="h5"
                    className={classes.tableHeaderBedNumber}
                  >
                    {value.bed}
                  </Typography>
                </TableCell>
                <TableCell align="left" className={tableCellClasses}>
                  <span>
                    {value["lastName"]}
                    {value["lastName"] && value["firstName"] && ", "}
                    {value["firstName"]}
                  </span>
                </TableCell>
                <TableCell align="center" className={tableCellClasses}>
                  <span>{value["teamNumber"]}</span>
                </TableCell>
                <TableCell className={tableCellClasses}>
                  <BedActions
                    classes={classes}
                    isSelected={isSelected}
                    bedKey={adjustedKey}
                    emptyBed={emptyBed}
                  />
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </>
  );
};

const BedActions = ({ classes, isSelected, bedKey, emptyBed }) => {
  const { bedActionEdit, bedActionClear, bedActionDelete } =
    useContext(BedActionsContext);

  // Popover - using a hook from material-ui-popup-state package
  const popupState = usePopupState({
    variant: "popover",
    popupId: "actionsMenu",
  });

  const handleOnClickMenu = (e, key) => {
    popupState.open(e);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {
        <Tooltip title="Edit">
          <IconButton onClick={() => bedActionEdit(bedKey)}>
            <EditIcon
              fontSize="small"
              className={[
                classes.tableEditButton,
                isSelected && classes.tableEditButtonSelected,
              ].join(" ")}
            />
          </IconButton>
        </Tooltip>
      }
      {
        <IconButton onClick={(e) => handleOnClickMenu(e, bedKey)}>
          {popupState.isOpen ? (
            <MenuOpenIcon fontSize="small" />
          ) : (
            <MenuIcon fontSize="small" />
          )}
        </IconButton>
      }
      <TableBedListPopover
        popupState={popupState}
        key={bedKey}
        emptyBed={emptyBed}
        onSelectDelete={() => bedActionDelete(bedKey)}
        onSelectClear={() => bedActionClear(bedKey)}
      />
    </div>
  );
};

export default TableBedList;
