import express, { Request, Response, IRouter } from "express";
import {
  UpdateObj,
  InsertObj,
  AddColumnObj,
  delColumnObj,
} from "../../models/base/Interfaces";
import verifyToken from "../../controllers/verifyToken";
import UpdateUtility from "../../models/utility/UpdateUtility";

const updateApi: IRouter = express.Router();

updateApi.use(verifyToken);

// 更新個別資料
updateApi.put("/data", async (req: Request, res: Response) => {
  // #swagger.tags = ["Update"]
  // #swagger.description = "Endpoint to update individual data."

  try {
    const updateUtility = new UpdateUtility(req.db);
    const userId = req.user!.userId;

    const params: UpdateObj = {
      dbName: req.body.dbName,
      table: req.body.table,
      data: req.body.data,
      where: req.body.where,
    };
    const data = await updateUtility.update(userId, params);

    return res.status(200).json({ data: data });
  } catch (err: any) {
    console.error("Error in updateData: ", err);

    if ("sqlMessage" in err) {
      return res.status(400).json({ error: true, message: err.sqlMessage });
    }
    return res.status(500).json({ error: true, message: err });
  }
});

// 插入新的 Row
updateApi.post("/data", async (req: Request, res: Response) => {
  // #swagger.tags = ["Update"]
  // #swagger.description = "Endpoint to insert new row data."

  try {
    const [dbName, table, values] = [
      req.body.dbName,
      req.body.table,
      req.body.values,
    ];

    if (!dbName || !table || !values) {
      return res.status(400).json({ error: true, message: "缺少必要的參數" });
    }

    const updateUtility = new UpdateUtility(req.db);
    const userId = req.user!.userId;

    const params: InsertObj = {
      dbName: dbName,
      table: table,
      data: values,
    };
    const data = await updateUtility.insert(userId, params);

    return res.status(200).json({ data: data });
  } catch (err: any) {
    console.error("Error in insertData: ", err);

    if ("sqlMessage" in err) {
      return res.status(400).json({ error: true, message: err.sqlMessage });
    }
    return res.status(500).json({ error: true, message: err });
  }
});

// 修改表格加入新的 Column
updateApi.put("/table/column", async (req: Request, res: Response) => {
  // #swagger.tags = ["Update"]
  // #swagger.description = "Endpoint to add a new column to a table."

  try {
    const {
      dbName,
      table,
      columnName,
      columnType,
      columnOption,
      defaultValue,
    } = req.body as AddColumnObj;

    // 驗證參數
    if (!dbName || !table || !columnName || !columnType) {
      return res.status(400).json({ error: true, message: "缺少必要的參數" });
    }

    const updateUtility = new UpdateUtility(req.db);
    const userId = req.user!.userId;

    const params: AddColumnObj = {
      dbName,
      table,
      columnName,
      columnType,
      columnOption,
      defaultValue,
    };
    const data = await updateUtility.addColumn(userId, params);

    return res.status(200).json({ data: data });
  } catch (err: any) {
    console.error("Error in addColumn: ", err);

    if ("sqlMessage" in err) {
      return res.status(400).json({ error: true, message: err.sqlMessage });
    }
    return res.status(500).json({ error: true, message: "內部服務器錯誤" });
  }
});

// 修改表格刪除指定 Column
updateApi.delete("/table/column", async (req: Request, res: Response) => {
  // #swagger.tags = ["Update"]
  // #swagger.description = "Endpoint to delete a specified column from a table."

  try {
    const { dbName, table, columnName } = req.body as delColumnObj;

    // 驗證參數
    if (!dbName || !table || !columnName) {
      return res.status(400).json({ error: true, message: "缺少必要的參數" });
    }

    const updateUtility = new UpdateUtility(req.db);
    const userId = req.user!.userId;

    const params: delColumnObj = {
      dbName: dbName,
      table: table,
      columnName: columnName,
    };
    const data = await updateUtility.delColumn(userId, params);

    return res.status(200).json({ data: data });
  } catch (err: any) {
    console.error("Error in delColumn: ", err);

    if ("sqlMessage" in err) {
      return res.status(400).json({ error: true, message: err.sqlMessage });
    }
    return res.status(500).json({ error: true, message: "內部服務器錯誤" });
  }
});

export default updateApi;
