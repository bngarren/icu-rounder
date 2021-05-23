import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

import RobotoRegular from "../../fonts/roboto/roboto-v27-latin-regular.woff";
import Roboto700 from "../../fonts/roboto/roboto-v27-latin-700.woff";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: RobotoRegular,
    },
    {
      src: Roboto700,
      fontWeight: "bold",
    },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    paddingHorizontal: "2pt",
    paddingTop: "2pt",
  },
  header: {
    fontSize: "13pt",
    textAlign: "center",
  },
  gridListRoot: {
    display: "flex",
    alignItems: "stretch",
    flexDirection: "column",
    marginTop: "2pt",
  },
  gridListRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  gridBoxRoot: {
    fontSize: "9pt",
    display: "flex",
    flexBasis: "0",
    flex: "1",
    color: "black",
    textAlign: "left",
    backgroundColor: "white",
    border: "1pt solid black",
    height: "185pt",
    fontFamily: "Roboto",
    marginTop: "-1pt",
  },
  removeLeftBorder: {
    borderLeft: "0",
  },
  gridBoxHeader: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    borderBottom: "1pt solid black",
  },
  gridBoxHeaderBed: {
    marginRight: "2pt",
    paddingLeft: "3pt",
    paddingRight: "3pt",
    borderRight: "1pt solid black",
    fontWeight: "bold",
  },
  gridBoxHeaderName: {
    flexGrow: "4",
  },
  gridBoxHeaderTeam: {
    marginLeft: "2pt",
    paddingLeft: "3pt",
    paddingRight: "3pt",
    borderLeft: "1pt solid black",
    minWidth: "11pt",
  },
  gridBoxBodyOneLiner: {
    marginBottom: "1.5pt",
  },
  gridBoxBodyContingencies: {
    display: "flex",
    flexDirection: "row",
    fontSize: "6pt",
    fontWeight: "bold",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    alignContent: "center",
    marginBottom: "1.5pt",
  },
  gridBoxBodyContingencyItem: {
    border: "1pt solid #dbdbdb",
    borderRadius: "2pt",
    paddingLeft: "2pt",
    paddingTop: "1pt",
    marginTop: "0.5pt",
    marginRight: "2pt",
  },
  gridBoxBody: {
    fontSize: "7pt",
    padding: "2pt 5pt 5pt 2pt",
  },
});

/* Hard coded Pt sizes for Letter size PDF document
depending on number of columns per page (the key) */
export const WIDTH_MAP = {
  1: 608,
  2: 304,
  3: 202.4,
  4: 152,
  5: 121.7,
};

export const getWidth = (colsPerPage, factor = 1) => {
  let res = "";
  if (colsPerPage) {
    res = WIDTH_MAP[colsPerPage] * factor;
  } else {
    res = WIDTH_MAP[4] * factor;
  }
  return res.toString() + "pt";
};

const MyDocument = ({ bedLayout, title, colsPerPage, data }) => {
  const beds = bedLayout.length;

  const getMatrix = (r, c) => {
    let matrix = [];
    let counter = 0;
    for (let i = 0; i < r; i++) {
      // for each row
      matrix[i] = [];
      for (let j = 0; j < c; j++) {
        // for each column
        matrix[i][j] = bedLayout[counter];
        counter++;
      }
    }
    return matrix;
  };

  const matrix = getMatrix(Math.ceil(beds / colsPerPage), colsPerPage);

  return (
    <Document>
      <Page size="letter" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text>{title}</Text>
        </View>
        <View style={pdfStyles.gridListRoot}>
          {matrix.map((row, rIndex) => {
            return (
              <View
                style={pdfStyles.gridListRow}
                wrap={false}
                key={`row-${rIndex}`}
              >
                {row.map((box, cIndex) => {
                  const objIndex = data.findIndex((obj) => obj.bed === box);
                  return (
                    <GridBox
                      bedspaceData={objIndex >= 0 ? data[objIndex] : null}
                      box={box}
                      width={getWidth(colsPerPage)}
                      removeLeftBorder={cIndex !== 0}
                      key={`grid-${cIndex}-${box}`}
                    />
                  );
                })}
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

const GridBox = ({ bedspaceData, box, width, removeLeftBorder }) => {
  if (bedspaceData) {
    return (
      <View
        style={[
          pdfStyles.gridBoxRoot,
          removeLeftBorder && pdfStyles.removeLeftBorder,
          {
            minWidth: width,
            maxWidth: width,
          },
        ]}
      >
        <View style={pdfStyles.gridBoxHeader}>
          <View style={pdfStyles.gridBoxHeaderBed}>
            <Text>{bedspaceData.bed}</Text>
          </View>
          <View style={pdfStyles.gridBoxHeaderName}>
            <Text>
              {bedspaceData.lastName}
              {bedspaceData.lastName && bedspaceData.firstName && ", "}
              {bedspaceData.firstName}
            </Text>
          </View>
          <View style={pdfStyles.gridBoxHeaderTeam}>
            <Text>{bedspaceData.teamNumber}</Text>
          </View>
        </View>
        <View style={pdfStyles.gridBoxBody}>
          <Text style={pdfStyles.gridBoxBodyOneLiner}>
            {bedspaceData.oneLiner}
          </Text>
          <View style={pdfStyles.gridBoxBodyContingencies}>
            {bedspaceData.contingencies &&
              bedspaceData.contingencies.map((item) => {
                return (
                  <Text style={pdfStyles.gridBoxBodyContingencyItem}>
                    {item}
                  </Text>
                );
              })}
          </View>
          <Text>{bedspaceData.body}</Text>
        </View>
      </View>
    );
  } else {
    return (
      <View
        style={[
          pdfStyles.gridBoxRoot,
          removeLeftBorder && pdfStyles.removeLeftBorder,
        ]}
      ></View>
    );
  }
};

export default MyDocument;
