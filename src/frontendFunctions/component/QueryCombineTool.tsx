import React, { useState, useEffect } from "react";
import {
  styled,
  Paper,
  Table,
  TableBody,
  TableCell,
  Checkbox,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

// import { useMessage } from "../types/MessageContext";
import { useColumnData } from "../types/ColumnDataContext";
import { useColumnOnShow } from "../types/ColumnOnShowContext";
import { useReadData } from "../types/ReadDataContext";
import { readTableData } from "../models/readData";

interface Column {
  id: string;
  label: string;
  selected?: boolean;
}

interface FormState {
  orderBy: string;
  orderDirection: "asc" | "desc";
  limit: number;
  offset: number;
}

const StyledPaper = styled(Paper)({
  width: "100%",
});

const StyledTableCell = styled(TableCell)<{ selected?: boolean }>(
  ({ selected }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: selected ? "#f0f0a0" : "#d0d0d0", // 選取後變色
      minWidth: 60,
      padding: "2px",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      minWidth: 60,
      padding: "4px",
      paddingTop: "2px",
      paddingBottom: "2px",
    },
  })
);

// const StyledTableCell = styled(TableCell)<{ selected?: boolean }>`
//   ${({ theme, selected }) => ({
//     backgroundColor: selected ? theme.palette.action.selected : "#d0d0d0",
//     minWidth: 60,
//     padding: 4,
//   })}
// `;

const QueryCombineTool: React.FC = () => {
  // const { setMessage, setOpenSnackbar, setSeverity } = useMessage();
  const { columnDataElement, setColumnDataElement } = useColumnData();
  const { readDataElement, setReadDataElement } = useReadData();
  const { setColumnOnShowElement } = useColumnOnShow();

  const [rowCondition, setRowCondition] = useState<any>({});
  const [row, setRow] = useState<any>({});
  const [tableParams, setTableParams] = useState<any>({ db: "", table: "" });
  const [formState, setFormState] = useState<FormState>({
    orderBy: "",
    orderDirection: "asc",
    limit: 100,
    offset: 0,
  });
  const conditionArr = [">", "<", "=", ">=", "<="];

  // 選取 Column
  const handleColumnSelect = (columnId: string) => {
    setColumnDataElement((previous) =>
      previous.map((column: Column) => {
        if (column.id === columnId) {
          return { ...column, selected: !column.selected };
        }
        return column;
      })
    );
  };

  // Input 變更處理
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    // console.log("Row: ", event.target.name, event.target.value);
    setRow({ ...row, [name]: value });
  };

  // Options 選擇
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormState((previous) => ({ ...previous, [name]: value }));
  };

  // Options 輸入
  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((previous) => ({ ...previous, [name]: value }));
  };

  // 送出需求
  const handleSubmit = () => {
    const selectedColumns = columnDataElement.filter(
      (column: Column) => column.selected
    );
    setColumnOnShowElement(selectedColumns);

    const whereConditions = columnDataElement
      .filter((column: Column) => rowCondition[column.id] && row[column.id]) // 篩選出設定了條件和值的欄位
      .map((column: Column) => ({
        column: column.id,
        operator: rowCondition[column.id] as ">" | "<" | "=" | ">=" | "<=",
        value: row[column.id],
      }));

    // 更新 readDataElement
    setReadDataElement({
      ...readDataElement,
      orderBy: formState.orderBy,
      orderDirection: formState.orderDirection,
      limit: formState.limit,
      offset: formState.offset,
      where: whereConditions.length > 0 ? whereConditions : null,
    });

    // 可能還需要重新獲取數據
  };

  useEffect(() => {
    const renewColumnsData = async () => {
      if (
        readDataElement.dbName === tableParams.db &&
        readDataElement.table === tableParams.table
      ) {
        return;
      }

      const response = await readTableData(readDataElement);

      const columnNames = response[1].map((column: any) => {
        return {
          id: column.name,
          label: column.name.toUpperCase(),
        };
      });

      setTableParams({
        db: readDataElement.dbName,
        table: readDataElement.table,
      });

      setColumnDataElement(columnNames);

      setColumnOnShowElement(columnNames);

      const initialCondition: any = {};
      const initialRow: any = {};

      columnNames.forEach((column: any) => {
        // console.log("start");
        initialCondition[column.id] = "";
        initialRow[column.id] = "";
        // console.log("end");
      });
      // console.log("start2");
      setRowCondition(initialCondition);
      setRow(initialRow);
      // console.log("end2");
    };

    renewColumnsData();
  }, [readDataElement]);

  return readDataElement.table ? (
    <StyledPaper>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyledTableCell></StyledTableCell>
              {columnDataElement.map((column: Column) => (
                <StyledTableCell key={column.id} selected={column.selected}>
                  <Checkbox
                    checked={column.selected || false}
                    onChange={() => handleColumnSelect(column.id)}
                  />
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <StyledTableCell>WHERE</StyledTableCell>
              {columnDataElement.map((column: Column) => {
                return (
                  <StyledTableCell key={column.id}>
                    <div className="flex">
                      <Select
                        size="small"
                        labelId="database-select-label"
                        value={rowCondition[column.id] || ""}
                        onChange={(event) =>
                          setRowCondition({
                            ...rowCondition,
                            [column.id]: event.target.value,
                          })
                        }
                      >
                        {conditionArr.map((condition) => (
                          <MenuItem key={condition} value={condition}>
                            {condition}
                          </MenuItem>
                        ))}
                      </Select>
                      <TextField
                        size="small"
                        name={column.id}
                        value={row[column.id] || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <>
        <FormControl
          fullWidth
          margin="normal"
          // sx={{ mt: 1, mb: 1, paddingTop: "8.5px", paddingBottom: "8.5px" }}
          sx={{ mt: 1, mb: 1 }}
          size="small"
        >
          <InputLabel id="orderBy">orderBy</InputLabel>
          <Select
            // size="small"
            labelId="orderBy"
            value={formState.orderBy}
            name="orderBy"
            onChange={handleSelectChange}
          >
            {columnDataElement.map((column: Column) => (
              <MenuItem key={column.id} value={column.id}>
                {column.id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size="small"
          label="orderDirection"
          name="orderDirection"
          sx={{ mt: 0, mb: 1 }}
          value={formState.orderDirection}
          onChange={handleFormChange}
          fullWidth
        />
        <TextField
          size="small"
          label="offset"
          name="offset"
          type="number"
          sx={{ mt: 0, mb: 1 }}
          value={formState.offset}
          onChange={handleFormChange}
          fullWidth
        />
        <TextField
          size="small"
          label="limit"
          name="limit"
          type="number"
          sx={{ mt: 0, mb: 1 }}
          value={formState.limit}
          onChange={handleFormChange}
          fullWidth
        />
      </>
      <Box mt={1}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            fullWidth
          >
            SEARCH
          </Button>
        </Grid>
      </Box>
    </StyledPaper>
  ) : (
    <></>
  );
};

export default QueryCombineTool;