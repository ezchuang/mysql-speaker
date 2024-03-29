import express, { Request, Response, IRouter } from "express";
import { ReadDbsAndTablesObj, ReadObj } from "../../models/base/Interfaces";
import ReadUtility from "../../models/utility/ReadUtility";
import structureClean from "../structureClean";
import verifyToken from "../../controllers/verifyToken";

const readApi: IRouter = express.Router();

readApi.use(verifyToken);

// 取得全部的 DBs 跟 Tables
readApi.get("/databases", async (req: Request, res: Response) => {
  // #swagger.tags = ["Read"]
  // #swagger.description = "Endpoint to obtain all databases and their tables."

  try {
    const readUtility = new ReadUtility(req.db);

    const [data, structure] = await readUtility.readDbsOrTables({});

    // 取出 dictionary cursor 的 key
    // 若 data 為空，則 dbsDataKey 為空字串，且不會執行下方 dataCluster 的運算
    const dbsDataKey: string = data.length > 0 ? Object.keys(data[0])[0] : "";

    const dataCluster = await Promise.all(
      data
        .filter(
          (dbsObj: any) =>
            dbsObj[dbsDataKey] !== `information_schema` &&
            dbsObj[dbsDataKey] !== `performance_schema`
        )
        .map(async (dbsObj: any) => {
          const paramsTables: ReadDbsAndTablesObj = {
            dbName: dbsObj[dbsDataKey],
          };
          const tablesDataArr = await readUtility.readDbsOrTables(paramsTables);
          return {
            [dbsDataKey.toLowerCase()]: dbsObj[dbsDataKey],
            tables: tablesDataArr[0],
          };
        })
    );

    return res.status(200).json({ data: dataCluster, structure: structure });
  } catch (err: any) {
    console.error("Error in readDbsAndTables: ", err);

    if ("sqlMessage" in err) {
      return res.status(400).json({ error: true, message: err.sqlMessage });
    }
    return res.status(500).json({ error: true, message: err });
  }
});

// 讀取 Table 內部資料
// 有帶 body 仍需用 POST
readApi.post("/data/query", async (req: Request, res: Response) => {
  // #swagger.tags = ["Read"]
  // #swagger.description = "Endpoint to query specific data from a table."

  try {
    const readUtility = new ReadUtility(req.db);

    const params: ReadObj = {
      dbName: req.body.dbName,
      table: req.body.table,
      select: req.body.select,
      where: req.body.where,
      groupBy: req.body.groupBy,
      orderBy: req.body.orderBy,
      orderDirection: req.body.orderDirection,
      offset: Number(req.body.offset),
      limit: Number(req.body.limit),
    };
    const [data, structure] = await readUtility.read(params);

    const dataType = (await readUtility.readTableStructures(params))[0];

    const cleanedStructure = structureClean(structure, dataType);

    return res.status(200).json({ data: data, structure: cleanedStructure });
  } catch (err: any) {
    console.error("Error in readData: ", err);

    if ("sqlMessage" in err) {
      return res.status(400).json({ error: true, message: err.sqlMessage });
    }
    return res.status(500).json({ error: true, message: err });
  }
});

export default readApi;
