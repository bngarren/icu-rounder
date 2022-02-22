import { useState, useEffect, useContext, memo } from "react";

// MUI
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
  Radio,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GroupIcon from "@mui/icons-material/Group";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { styled } from "@mui/system";

// Utility
import { isBedEmpty } from "../../utils";

// Popover
import { usePopupState } from "material-ui-popup-state/hooks";
import TableBedListPopover from "./TableBedListPopover";

// Components
import AddNewBedspaceForm from "./AddNewBedspaceForm";

// Context
import BedActionsContext from "./BedActionsContext";

// Defaults //TODO Need to put this in Settings
const ROWS_PER_PAGE = 15;

/* Styling */
const StyledTableCellHeader = styled(TableCell, {
  name: "TableBedList",
  slot: "header",
})(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.contrastText,
  padding: "4px",
  borderBottom: "none",
  textAlign: "center",
}));

const StyledTableCell = styled(TableCell, {
  name: "TableBedList",
  slot: "tableCell",
  shouldForwardProp: (prop) =>
    prop !== "shouldHighlight" && prop !== "isSelected",
})(({ shouldHighlight, isSelected, component, theme }) => ({
  [theme.breakpoints.up("lg")]: {
    padding: "3px 6px 3px 6px",
  },
  [theme.breakpoints.down("lg")]: {
    padding: "2px 4px 2px 4px",
  },
  // Targets the Bed number table cell, when selected
  ...(isSelected &&
    component === "th" && {
      transition: "color 0.1s linear",
      backgroundColor: theme.palette.primary.main,
    }),
  ...(shouldHighlight && {
    transition: "color 0.2s ease-in",
    backgroundColor: theme.palette.secondary.dark,
  }),
}));

const StyledTypographyBedNumber = styled(Typography, {
  name: "TableBedList",
  slot: "bedNumber",
  shouldForwardProp: (prop) =>
    prop !== "shouldHighlight" && prop !== "isSelected",
})(({ shouldHighlight, isSelected, theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: "bold",
  ...(isSelected && {
    color: theme.palette.secondary.light,
  }),
  ...(shouldHighlight && {
    transition: "color 0.2s ease-in",
    color: theme.palette.primary.main,
  }),
}));

const StyledTypographyPatientName = styled(Typography, {
  name: "TableBedList",
  slot: "patientName",
})(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    fontSize: "0.95rem",
  },
  [theme.breakpoints.down("lg")]: {
    fontSize: "0.90rem",
  },
}));

const StyledTablePagination = styled(TablePagination, {
  name: "TableBedList",
  slot: "pagination",
})(({ theme }) => ({
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

const StyledBedActionsDiv = styled("div", {
  name: "TableBedList",
  slot: "bedActions",
})(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
}));

const buttonPaddingSx = {
  padding: {
    xs: "3px",
    md: "5px",
  },
};

const StyledMenuIconButton = styled(IconButton)(() => ({}));

const menuIconStyle = {
  cursor: "pointer",
  fontSize: "1.5rem",
};

const StyledMenuIcon = styled(MenuIcon)(({ theme }) => ({
  ...menuIconStyle,
  color: theme.palette.primary.light,
}));

const StyledMenuOpenIcon = styled(MenuOpenIcon)(({ theme }) => ({
  ...menuIconStyle,
  color: theme.palette.primary.light,
}));

const TableBedList = ({ data, selectedKey }) => {
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

  const columnSizes = {
    bed: getBedCharSize(data),
    team: getTeamCharSize(data),
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="table of beds" sx={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            <StyledTableCellHeader
              sx={{
                width: `${columnSizes.bed * 1.7}ch`,
              }}
            >
              Bed
            </StyledTableCellHeader>
            <StyledTableCellHeader>{/* Name */}</StyledTableCellHeader>
            <StyledTableCellHeader
              sx={{ width: `${columnSizes.team * 1.5}ch` }}
            >
              <Tooltip title="Team" placement="top">
                <GroupIcon sx={{ verticalAlign: "middle" }} />
              </Tooltip>
            </StyledTableCellHeader>
            <StyledTableCellHeader sx={{ width: "80px" }} />
          </TableRow>
        </TableHead>
        <MyTableBody
          data={data}
          page={page}
          rowsPerPage={rowsPerPage}
          selectedKey={selectedKey}
          columnSizes={columnSizes}
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

const MyTableBody = ({ data, page, rowsPerPage, selectedKey, columnSizes }) => {
  const [highlightedKey, setHighlightedKey] = useState(false);

  const handleNewBedspaceSubmitted = (key) => {
    setHighlightedKey(key);
    setTimeout(() => {
      setHighlightedKey(null);
    }, 2000);
  };

  const MyInputTableRow = (
    <TableRow>
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
                shouldHighlight={highlightedKey === adjustedKey}
                adjustedKey={adjustedKey}
                isSelected={isSelected}
                key={`MyTableRow-${value.bed}-${key}`}
                value={value}
                columnSizes={columnSizes}
              />
            );
          })}
        {MyInputTableRow}
      </TableBody>
    </>
  );
};

const MyTableRow = memo(function MyTableRow({
  shouldHighlight,
  adjustedKey,
  isSelected,
  value,
  columnSizes,
}) {
  const emptyBed = isBedEmpty(value);

  const getPatientName = () => {
    if (value == null) return "";
    const lastName = value.lastName || "";
    const firstName = value.firstName || "";
    return `${lastName}${lastName && firstName && ", "}${firstName}`;
  };

  return (
    <TableRow key={value.bed} hover selected={isSelected}>
      <StyledTableCell
        component="th"
        scope="row"
        align="center"
        shouldHighlight={shouldHighlight}
        isSelected={isSelected}
      >
        <StyledTypographyBedNumber
          variant="h6"
          shouldHighlight={shouldHighlight}
          isSelected={isSelected}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: columnSizes.bed > 3 ? "0.90rem" : "1rem",
          }}
        >
          {value.bed}
        </StyledTypographyBedNumber>
      </StyledTableCell>
      <StyledTableCell align="left" isSelected={isSelected}>
        <StyledTypographyPatientName
          variant="body1"
          sx={{
            fontWeight: isSelected ? "fontWeightBold" : "fontWeightRegular",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {getPatientName()}
        </StyledTypographyPatientName>
      </StyledTableCell>
      <StyledTableCell align="center">
        <Typography
          variant="body1"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: columnSizes.team > 4 && "0.85rem",
          }}
        >
          {value["teamNumber"]}
        </Typography>
      </StyledTableCell>
      <StyledTableCell>
        <BedActions
          isSelected={isSelected}
          bedKey={adjustedKey}
          emptyBed={emptyBed}
        />
      </StyledTableCell>
    </TableRow>
  );
});

const BedActions = memo(function BedActions({ isSelected, bedKey, emptyBed }) {
  const { bedActionEdit, bedActionClear, bedActionDelete } =
    useContext(BedActionsContext);

  // Popover - using a hook from material-ui-popup-state package
  const popupState = usePopupState({
    variant: "popover",
    popupId: "actionsMenu",
  });

  const handleOnClickMenu = (e) => {
    popupState.open(e);
  };

  return (
    <StyledBedActionsDiv>
      {
        <>
          <Radio
            checked={isSelected}
            onClick={() => bedActionEdit(bedKey)}
            sx={{ ...buttonPaddingSx }}
          />
        </>
      }
      {
        <StyledMenuIconButton
          onClick={(e) => handleOnClickMenu(e, bedKey)}
          size="large"
          sx={{
            ...buttonPaddingSx,
          }}
        >
          {popupState.isOpen ? (
            <StyledMenuOpenIcon fontSize="small" />
          ) : (
            <StyledMenuIcon fontSize="small" />
          )}
        </StyledMenuIconButton>
      }
      <TableBedListPopover
        popupState={popupState}
        key={bedKey}
        emptyBed={emptyBed}
        onSelectDelete={() => bedActionDelete(bedKey)}
        onSelectClear={() => bedActionClear(bedKey)}
      />
    </StyledBedActionsDiv>
  );
});

/* Helper functions to calculate the number of characters in the
longest string so that the column and font can be resized appropriately */

function getBedCharSize(data) {
  return (() => {
    let min = 3;
    let max = 6;
    data?.forEach((i) => {
      min = Math.max(min, i.bed?.length || 0);
    });
    return Math.min(min, max);
  })();
}

function getTeamCharSize(data) {
  return (() => {
    let min = 4;
    let max = 6;
    data?.forEach((i) => {
      min = Math.max(min, i.teamNumber?.length || 0);
    });
    return Math.min(min, max);
  })();
}

export default TableBedList;
