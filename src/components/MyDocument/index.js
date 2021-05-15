import { useState, useEffect } from "react";
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
    marginTop: "20pt",
    paddingHorizontal: "2pt",
  },
  gridListRoot: {
    display: "flex",
    alignItems: "stretch",
    flexDirection: "column",
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
    margin: "0.2pt",
    height: "185pt",
    fontFamily: "Roboto",
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
  gridBoxBody: {
    fontSize: "7pt",
    padding: "1pt",
  },
  gridBoxBodyOneLiner: {
    marginBottom: "2pt",
  },
});

const MyDocument = ({ beds, colsPerPage, data }) => {

  const matrix = (r, c) => {
    let matrix = [];
    let box = 1;
    for (let i = 0; i < r; i++) {
      matrix[i] = [];
      for (let j = 0; j < c; j++) {
        matrix[i][j] = box;
        box++;
      }
    }
    return matrix;
  };

  return (
    <Document>
      <Page size="letter" style={pdfStyles.page}>
        <View style={pdfStyles.gridListRoot}>
          {matrix(Math.ceil(beds / colsPerPage), colsPerPage).map((row) => {
            return (
              <View style={pdfStyles.gridListRow} wrap={false}>
                {row.map((box) => {
                  const objIndex = data.findIndex(
                    (obj) => obj.bed === box
                  );
                  return <GridBox bedspaceData={objIndex >= 0 ? data[objIndex] : null} box={box} />;
                })}
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

const GridBox = ({ bedspaceData, box }) => {

  if (bedspaceData) {
    return (
      <View style={pdfStyles.gridBoxRoot}>
        <View style={pdfStyles.gridBoxHeader}>
          <View style={pdfStyles.gridBoxHeaderBed}>
            <Text>{bedspaceData.bed}</Text>
          </View>
          <View style={pdfStyles.gridBoxHeaderName}>
            <Text>{bedspaceData.lastName}{bedspaceData.lastName && bedspaceData.firstName && ", "}{bedspaceData.firstName}</Text>
          </View>
          <View style={pdfStyles.gridBoxHeaderTeam}>
            <Text>{bedspaceData.teamNumber}</Text>
          </View>
        </View>
        <View style={pdfStyles.gridBoxBody}>
          <Text style={pdfStyles.gridBoxBodyOneLiner}>
            {bedspaceData.oneLiner}
          </Text>
          <Text>
            {bedspaceData.body}
          </Text>
        </View>
      </View>
    );
  } else {
    return <View style={pdfStyles.gridBoxRoot}>

    </View>
  }


};


export default MyDocument;