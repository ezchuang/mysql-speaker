import { ReadDataElement } from "../types/ReadDataContext";
import fetchPackager from "./fetchPackager";

// 取得 DBs or Tables
export async function readDbsOrTables(
  element: ReadDataElement
): Promise<any[]> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/readDbsOrTables",
      methodFetch: "POST",
      bodyFetch: JSON.stringify(element),
    });

    const result = await response.json();

    // console.log("rowData: ", result.data);
    // console.log("columnData: ", result.structure);
    return [result.data, result.structure];
  } catch (err) {
    console.error("There was an error fetching the DBs and Tables: ", err);
    throw err;
  }
}

// 取得全部的 DBs 跟 Tables
export async function readDbsAndTables(): Promise<any[]> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/readDbsAndTables",
      methodFetch: "POST",
      bodyFetch: JSON.stringify({}),
    });

    const result = await response.json();

    // console.log("rowData: ", result.data);
    // console.log("columnData: ", result.structure);
    return [result.data, result.structure];
  } catch (err) {
    console.error("There was an error fetching the DBs and Tables: ", err);
    throw err;
  }
}

export async function readTableData(element: ReadDataElement): Promise<any[]> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/readData",
      methodFetch: "POST",
      bodyFetch: JSON.stringify(element),
    });

    const result = await response.json();
    // console.log(result.data);
    // console.log(result.structure);

    return [result.data, result.structure];
  } catch (err) {
    console.error("There was an error fetching the Tables: ", err);
    throw err;
  }
}

export async function readHistoryData(): Promise<any[]> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/getHistoryByUser",
      methodFetch: "GET",
    });

    const result = await response.json();
    // console.log(result.data);
    // console.log(result.structure);

    return [result.data, result.structure];
  } catch (err) {
    console.error("There was an error fetching the Tables: ", err);
    throw err;
  }
}
