import rootDb from "../models/dbConstructor/rootDb";
import HistoryUtility from "../models/utility/HistoryUtility";

const historyUtility = new HistoryUtility(rootDb);

export default async function addHistory(
  userId: string,
  actionType: string,
  queryStr: string,
  values: string[]
) {
  try {
    if (String(userId).startsWith("G")) {
      return;
    }

    const record = {
      id: userId,
      actionType: actionType,
      queryHistory: `${queryStr}, (${values.toString()})`,
    };

    historyUtility.addHistoryRecord(record);
  } catch (err) {
    console.log("addHistory Failed: ", err);
    throw err;
  }
}
