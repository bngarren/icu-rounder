import { useState, useEffect, useContext, memo } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
  Typography,
  Paper,
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

// MUI
import { styled, alpha } from "@mui/system";
import { makeStyles, useTheme } from "@mui/styles";

// Utility
import { isBedEmpty } from "../../utils/Utility";

// Popover
import { usePopupState } from "material-ui-popup-state/hooks";
import TableBedListPopover from "../TableBedListPopover";

// Components
import AddNewBedspaceForm from "./AddNewBedspaceForm";

// Context
import { BedActionsContext } from "../../pages/UpdatePage";

const useStyles = makeStyles((theme) => ({
  tableEditIconButton: {
    padding: "6px",
  },
  tableEditIcon: {
    cursor: "pointer",
    color: "#626060",
    fontSize: "22px",
  },
  tableEditIconSelected: {
    color: theme.palette.secondary.main,
  },
  tableMenuIconButton: {
    padding: "6px",
  },
  tableDeleteButton: {
    cursor: "pointer",
    fontSize: "22px",
    color: "#626060",
  },
  transparent: {
    color: "transparent",
  },
}));

const StyledTableCellHeader = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.contrastText,
  padding: "4px 2px 4px 10px",
}));

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== "shouldHighlight",
})(({ shouldHighlight, theme }) => ({
  "&.Mui-selected": {
    background: `linear-gradient(90deg, ${theme.palette.secondary.dark} 1%, rgba(0,212,255,0) 1%)`,
  },
  "&.Mui-selected:hover": {
    background: `linear-gradient(90deg, ${alpha(
      theme.palette.secondary.dark,
      0.9
    )} 1%, rgba(0,212,255,0) 1%)`,
  },
  transition: "background-color 0.8s linear",
  ...(shouldHighlight && {
    backgroundColor: alpha(theme.palette.secondary.light, 0.5),
  }),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    padding: "3px 10px 3px 15px",
    fontSize: "1rem",
  },
  [theme.breakpoints.down("lg")]: {
    padding: "2px 2px 2px 10px",
    fontSize: "0.85rem",
  },
}));

const StyledTypographyBedNumber = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: "bold",
}));

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  "& .MuiTablePagination-root": {
    overflow: "hidden",
    padding: 0,
  },
  "& .MuiTablePagination-toolbar": {
    paddingLeft: "5px",
    justifyContent: "center",
  },
  "& .MuiTablePagination-spacer": {
    flex: "none",
  },
  "& .MuiTablePagination-input": {
    marginRight: "15px",
  },
  "& .MuiInputBase-root": {
    [theme.breakpoints.down("lg")]: {
      marginRight: "10px",
    },
  },
}));

const ROWS_PER_PAGE = 15;

const TableBedList = ({ data, selectedKey }) => {
  const theme = useTheme();
  const classes = useStyles(theme);

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

  /* Watches for changes in selectedKey and picks the correct paginated page that contains
  that bed space. E.g. when using the navigation arrows and you move to a bedspace that is on
  a different paginated page */
  useEffect(() => {
    // Page should be set so that selectedKey is within range of [page*rowsPerPage, rowsPerPage + rowsPerPage - 1]
    const rowsTotal = data.length;
    const numOfPage = Math.ceil(rowsTotal / rowsPerPage);
    let newPage = 0;
    for (let i = 0; i < numOfPage; i++) {
      // loop through available pages
      if (
        selectedKey >= i * rowsPerPage &&
        selectedKey <= i * rowsPerPage + rowsPerPage - 1
      ) {
        newPage = i;
      }
    }
    setPage(newPage);
  }, [selectedKey, data.length, rowsPerPage]);

  //

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCellHeader style={{ minWidth: 30 }}>
              Bed
            </StyledTableCellHeader>
            <StyledTableCellHeader style={{ width: "100%" }}>
              Patient
            </StyledTableCellHeader>
            <StyledTableCellHeader style={{ minWidth: 30, maxWidth: 30 }}>
              Team
            </StyledTableCellHeader>
            <StyledTableCellHeader
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
      <StyledTablePagination
        rowsPerPageOptions={[5, 15, 30]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        variant="footer"
      />
    </TableContainer>
  );
};

const MyTableBody = ({ classes, data, page, rowsPerPage, selectedKey }) => {
  const [highlightedKey, setHighlightedKey] = useState(false);

  const handleNewBedspaceSubmitted = (key) => {
    setHighlightedKey(key);
    setTimeout(() => {
      setHighlightedKey(null);
    }, 1000);
  };

  const MyInputTableRow = (
    <TableRow className={classes.myInputTableRow}>
      <StyledTableCell component="th" scope="row" align="right" colSpan={4}>
        <AddNewBedspaceForm onSubmit={handleNewBedspaceSubmitted} />
      </StyledTableCell>
    </TableRow>
  );

  return (
    <>
      <TableBody>
        {data
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((value, key) => {
            let adjustedKey = key + page * rowsPerPage; // the key resets to index 0 for every pagination page
            const isSelected = adjustedKey === selectedKey;

            return (
              <MyTableRow
                classes={classes}
                shouldHighlight={highlightedKey === adjustedKey}
                adjustedKey={adjustedKey}
                isSelected={isSelected}
                key={`MyTableRow-${value.bed}-${key}`}
                value={value}
              />
            );
          })}
        {MyInputTableRow}
      </TableBody>
    </>
  );
};

const MyTableRow = memo(
  ({ classes, shouldHighlight, adjustedKey, isSelected, value }) => {
    const emptyBed = isBedEmpty(value);
    return (
      <StyledTableRow
        //className={clsx(classes.tableRow, {
        //  [classes.highlightRowIn]: highlight === adjustedKey,
        //})}
        shouldHighlight={shouldHighlight}
        key={value.bed}
        hover
        selected={isSelected}
      >
        <StyledTableCell component="th" scope="row" align="left">
          <StyledTypographyBedNumber variant="h5">
            {value.bed}
          </StyledTypographyBedNumber>
        </StyledTableCell>
        <StyledTableCell align="left">
          <span>
            {value["lastName"]}
            {value["lastName"] && value["firstName"] && ", "}
            {value["firstName"]}
          </span>
        </StyledTableCell>
        <StyledTableCell align="center">
          <span>{value["teamNumber"]}</span>
        </StyledTableCell>
        <StyledTableCell>
          <BedActions
            classes={classes}
            isSelected={isSelected}
            bedKey={adjustedKey}
            emptyBed={emptyBed}
          />
        </StyledTableCell>
      </StyledTableRow>
    );
  }
);

const BedActions = memo(({ classes, isSelected, bedKey, emptyBed }) => {
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
        <div title="Edit">
          <IconButton
            className={classes.tableEditIconButton}
            onClick={() => bedActionEdit(bedKey)}
            size="large"
          >
            <EditIcon
              fontSize="small"
              className={[
                classes.tableEditIcon,
                isSelected && classes.tableEditIconSelected,
              ].join(" ")}
            />
          </IconButton>
        </div>
      }
      {
        <IconButton
          className={classes.tableMenuIconButton}
          onClick={(e) => handleOnClickMenu(e, bedKey)}
          size="large"
        >
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
});

export default TableBedList;
