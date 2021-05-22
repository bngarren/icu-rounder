import { useState, useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";

import { sortByBed } from "../../utils/Utility";

import MyDocument from "../../components/MyDocument";

import { useSettings } from "../../context/Settings";
import { useGridStateContext } from "../../context/GridState";

const DocumentPage = () => {
  const { settings, dispatchSettings } = useSettings();
  const { bedLayout, gridData } = useGridStateContext();

  if (gridData) {
    return (
      <div>
        <PDFViewer style={{ width: "100%", height: "900px" }}>
          <MyDocument
            bedLayout={bedLayout}
            title={settings.document_title}
            colsPerPage={settings.document_cols_per_page}
            data={gridData}
          />
        </PDFViewer>
      </div>
    );
  } else {
    return <>Loading</>;
  }
};

export default DocumentPage;
