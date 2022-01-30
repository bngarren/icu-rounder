import { PDFViewer } from "@react-pdf/renderer";

import MyDocument from "../../components/MyDocument";

import { useSettings } from "../../context/Settings";
import { useGridStateContext } from "../../context/GridState";

const DocumentPage = () => {
  const { settings } = useSettings();
  const { bedLayout, gridData, census } = useGridStateContext();

  if (gridData) {
    return (
      <div>
        <PDFViewer style={{ width: "100%", height: "900px" }}>
          <MyDocument
            bedLayout={bedLayout}
            title={settings.document_title}
            colsPerPage={settings.document_cols_per_page}
            data={gridData}
            census={census}
          />
        </PDFViewer>
      </div>
    );
  } else {
    return <>Loading</>;
  }
};

export default DocumentPage;
