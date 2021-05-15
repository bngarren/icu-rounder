import { useState, useEffect } from "react";
import { saveAs } from 'file-saver';
import {
  Document,
  Page,
  Text,
  View,
  PDFViewer,
  StyleSheet,
  Font,
  PDFDownloadLink,
  pdf
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

const pdfViewerStyles = StyleSheet.create({
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
    paddingLeft: "2pt",
    paddingRight: "2pt",
    borderRight: "1pt solid black",
    fontWeight: "bold",
  },
  gridBoxHeaderName: {
    flexGrow: "4",
  },
  gridBoxHeaderTeam: {
    marginLeft: "2pt",
    paddingLeft: "2pt",
    paddingRight: "2pt",
    borderLeft: "1pt solid black",
    minWidth: "8pt",
  },
  gridBoxBody: {
    fontSize: "7pt",
    padding: "1pt",
  },
  gridBoxBodyOneLiner: {
    marginBottom: "2pt",
  },
});

const TestDoc = () => (
  <Document>
    <Page size="A4">
      <View>
        <Text>Section #1</Text>
      </View>
      <View>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
);

const DocumentPage = () => {
  const [gridSettings, setGridSettings] = useState({
    colsPerPage: 4,
    beds: 30,
  });

  const [pdfDoc, setPdfDocument] = useState();
  const [showProgress, setShowProgress] = useState(true);



  const onChangeSelectNumCols = (e) => {
    setGridSettings({ ...gridSettings, colsPerPage: e.target.value });
  };

  return (
    <div>
      {/* <select
        name="selectNumCols"
        onChange={onChangeSelectNumCols}
        defaultValue={gridSettings.colsPerPage}
      >
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select> */}
      {showProgress && <>Generating PDF...</>}
      {/* !showProgress && (
        <iframe src={URL.createObjectURL(pdfDoc)} title="PDF"/>
      ) */}
    </div>
  );
};

const MyDocument = ({ beds, colsPerPage }) => {
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
      <Page size="letter" style={pdfViewerStyles.page}>
        <View style={pdfViewerStyles.gridListRoot}>
          {matrix(Math.ceil(beds / colsPerPage), colsPerPage).map((row) => {
            return (
              <View style={pdfViewerStyles.gridListRow} wrap={false}>
                {row.map((box) => {
                  return <GridBox bed={box} />;
                })}
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

const GridBox = (props) => {
  return (
    <View style={pdfViewerStyles.gridBoxRoot}>
      <View style={pdfViewerStyles.gridBoxHeader}>
        <View style={pdfViewerStyles.gridBoxHeaderBed}>
          <Text>{props.bed}</Text>
        </View>
        <View style={pdfViewerStyles.gridBoxHeaderName}>
          <Text>lastName, firstName</Text>
        </View>
        <View style={pdfViewerStyles.gridBoxHeaderTeam}>
          <Text>1</Text>
        </View>
      </View>
      <View style={pdfViewerStyles.gridBoxBody}>
        <Text style={pdfViewerStyles.gridBoxBodyOneLiner}>
          3yoM new PFossa mass s/p resection 4/28, intubated
        </Text>
        <Text>NEURO: Mo, mz, dex gtts</Text>
        <Text>RESP: PCV 25/5 x20 fiO2 60%</Text>
        <Text>CV: Dopa 5, epi 0.2, MAP > 50</Text>
        <Text>FEN: NPO, MIVF</Text>
        <Text>HEME: hgb 7/plt 10</Text>
        <Text>ENDO: SDS</Text>
      </View>
    </View>
  );
};

export default DocumentPage;
