import React, { useState } from "react";
// import React, { useState, useEffect } from "react";
import {
  styled,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useVerification } from "../types/VerificationContext";
import { useReadData } from "../types/ReadDataContext";
import { UserListElement, useUserInfo } from "../types/UserInfoContext";
import { useSocket } from "../types/SocketContext";

import CustomizedSnackbars from "./Alert";
import MainTable from "./MainTable";
import ShortcutTable from "./ShortcutTable";
import QueryCombineTool from "./QueryCombineTool";
import AddToolEntry from "./AddToolEntry";
import ModifyToolEntry from "./ModifyToolEntry";
import HistoryTable from "./HistoryTable";
import SignInUpForm from "./SignInUpForm";
import GuestSignInForm from "./GuestSignInForm";

const StyledAccordion = styled(Accordion)({
  width: "100%",
  padding: "4px",
  backgroundColor: "#e9ffff",
  fontWeight: "bold",
});

const StyledAccordionSummary = styled(AccordionSummary)({
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "scale(0.9)",
  },
  "& .MuiAccordionSummary-expandIconWrapper": {
    transform: "scale(0.9)",
  },
  height: "40px", // 這裡將高度從 40px 調整為 30px
  minHeight: "40px", // 確保最小高度也被設定，以防止 Material-UI 的默認樣式覆蓋
});

const StyledAccordionDetails = styled(AccordionDetails)({
  width: "100%",
  padding: "4px",
  backgroundColor: "#d1FFd1",
});

const MainStyledPaper = styled(Paper)({
  width: "100%",
  overflow: "hidden",
});

const ShortcutStyledPaper = styled(Paper)({
  width: "100%",
  overflow: "auto",
});

const Type2ShortcutStyledPaper = styled(Paper)({
  width: "50vh",
  overflow: "auto",
});

const MainLayout: React.FC = () => {
  const { isVerified } = useVerification();
  const { readDataElement, setReadDataElement } = useReadData();
  const { userInfo, setUserInfo } = useUserInfo();
  const { socket } = useSocket();

  const [mainTableExpanded, setMainTableExpanded] = useState(true);
  const [queryCombineToolExpanded, setQueryCombineToolExpanded] =
    useState(false);
  const [addToolEntryExpanded, setAddToolEntryExpanded] = useState(false);
  const [createToolEntryExpanded, setCreateToolEntryExpanded] = useState(false);
  const [historyTableExpanded, seHistoryTableExpanded] = useState(false);

  const toggleShortcutPage = () => {
    const panel = document.getElementById("shortcutLinks") as HTMLElement;
    if (panel.style.display === "none" || panel.style.display === "") {
      panel.style.display = "block";
    } else {
      panel.style.display = "none";
    }
  };

  socket?.on("userListUpdated", (newUserList: UserListElement[]) => {
    setUserInfo((prevInfo) => ({ ...prevInfo, userList: newUserList }));
  });

  // useEffect(() => {
  //   console.log("socket auth: ", socket);

  //   console.log("UserInfo: ", userInfo);
  // }, [socket, setUserInfo]);

  // 群組內使用者登入狀況圓圈渲染
  const renderUserList = userInfo.userList?.map((user, index) => (
    <div
      key={index}
      className="rounded-full cursor-pointer flex items-center justify-center mr-2"
      style={{ backgroundColor: user.userColor, width: "30px", height: "30px" }}
      title={user.userName}
    >
      {user.userName.charAt(0)}
    </div>
  ));

  return (
    <>
      <div className="flex flex-col">
        {/* NAV */}
        <nav className="bg-blue-500 p-4 text-white fixed w-full z-30">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Content for NAV */}
            <div className="font-bold text-2xl">MySQL Speaker</div>
            <div className="flex items-center">
              <div className="w-auto flex items-center gap-1 text-black">
                {renderUserList}
              </div>
              {/* Content for Verify User */}
              <div className="flex gap-10">
                <GuestSignInForm />
                <SignInUpForm />
              </div>
            </div>
          </div>
        </nav>
        <CustomizedSnackbars></CustomizedSnackbars>
        {isVerified && (
          <>
            {/* PATH */}
            <div className="bg-blue-200 p-2 text-blue-900 text-sm sticky top-16 z-20 flex ">
              <div className=" max-w-7xl w-full justify-between m-auto flex">
                <div className="max-w-7xl my-auto ml-1 mr-auto">
                  {/* Content for PATH */}
                  {/* <div>Breadcrumb / Path</div> */}
                  <div>
                    <span
                      className="cursor-pointer"
                      onClick={() => {
                        setReadDataElement({});
                        return false;
                      }}
                    >
                      {userInfo.userName}
                    </span>
                    {readDataElement.dbName && readDataElement.table ? (
                      <>
                        <span> / </span>
                        <span
                          className="cursor-pointer"
                          onClick={() => {
                            setReadDataElement({
                              dbName: readDataElement.dbName,
                            });
                            return false;
                          }}
                        >
                          {readDataElement.dbName}
                        </span>
                        <span> / </span>
                        <span
                          className="cursor-pointer"
                          onClick={() => {
                            setReadDataElement({
                              dbName: readDataElement.dbName,
                              table: readDataElement.table,
                            });
                            return false;
                          }}
                        >
                          {readDataElement.table}
                        </span>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className=" m-1">{`群組名稱: ${userInfo.groupName}`}</div>
                  <div className=" m-1">{` / `}</div>
                  <div className=" m-1">
                    {`群組邀請碼: ${userInfo.invitationCode}`}
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 pt-20 w-full">
              {/* MAIN TABLE */}
              <StyledAccordion
                expanded={mainTableExpanded}
                onChange={() => setMainTableExpanded(!mainTableExpanded)}
              >
                <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <div>表格主要工作區</div>
                </StyledAccordionSummary>
                <StyledAccordionDetails>
                  {readDataElement.table ? (
                    <MainStyledPaper>
                      <MainTable />
                    </MainStyledPaper>
                  ) : (
                    <ShortcutStyledPaper>
                      <ShortcutTable />
                    </ShortcutStyledPaper>
                  )}
                </StyledAccordionDetails>
              </StyledAccordion>

              {/* QUERY COMBINE */}
              <StyledAccordion
                expanded={queryCombineToolExpanded}
                onChange={() =>
                  setQueryCombineToolExpanded(!queryCombineToolExpanded)
                }
              >
                <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <div>查詢組合工具 (請先選定 Table)</div>
                </StyledAccordionSummary>
                <StyledAccordionDetails>
                  <QueryCombineTool />
                </StyledAccordionDetails>
              </StyledAccordion>

              {/* TABLE MODIFICATION */}
              <StyledAccordion
                expanded={addToolEntryExpanded}
                onChange={() => setAddToolEntryExpanded(!addToolEntryExpanded)}
              >
                <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <div>表格修改工具 (請先選定 Table)</div>
                </StyledAccordionSummary>
                <StyledAccordionDetails>
                  <AddToolEntry />
                </StyledAccordionDetails>
              </StyledAccordion>

              {/* CREATE TOOL */}
              <StyledAccordion
                expanded={createToolEntryExpanded}
                onChange={() =>
                  setCreateToolEntryExpanded(!createToolEntryExpanded)
                }
              >
                <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <div>DB & Table 增刪工具</div>
                </StyledAccordionSummary>
                <StyledAccordionDetails>
                  <ModifyToolEntry />
                </StyledAccordionDetails>
              </StyledAccordion>

              {/* HISTORY */}
              <StyledAccordion
                expanded={historyTableExpanded}
                onChange={() => seHistoryTableExpanded(!historyTableExpanded)}
              >
                <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <div>歷史紀錄</div>
                </StyledAccordionSummary>
                <StyledAccordionDetails>
                  <HistoryTable />
                </StyledAccordionDetails>
              </StyledAccordion>
            </div>
          </>
        )}
      </div>
      {isVerified && (
        <>
          <div className="floating-container">
            <button
              id="toggleShortcutPage"
              className="floating-btn text-white"
              onClick={toggleShortcutPage}
            >
              Tables 捷徑
            </button>
            <div
              className="bg-white shadow-lg p-4 mb-4 overflow-auto hidden floating-panel"
              id="shortcutLinks"
            >
              {/* Content for Shortcut */}
              <Type2ShortcutStyledPaper>
                <ShortcutTable />
              </Type2ShortcutStyledPaper>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MainLayout;
