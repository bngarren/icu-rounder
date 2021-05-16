import { useState, useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";

import { sortByBed } from "../../utils/Utility";

import MyDocument from "../../components/MyDocument";

const DocumentPage = () => {
  const [data, setData] = useState();

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("gridData"));
    let arr = [];
    for (let i in localData) {
      arr.push(localData[i]);
    }
    const arraySortedByBed = sortByBed(arr);
    setData(arraySortedByBed);
  }, []);

  if (data) {
    return (
      <div>
        <PDFViewer style={{ width: "100%", height: "900px" }}>
          <MyDocument beds={30} colsPerPage={3} data={data} />
        </PDFViewer>
      </div>
    );
  } else {
    return <>Loading</>;
  }
};

export default DocumentPage;
