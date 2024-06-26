﻿# MySQL Speaker

### 透過圖形化介面減低操作 MySQL 的門檻，點選對應功能組裝您想執行的 MySQL Query String

### 網址(停止中): https://mysqlspeaker.online/

### API 文件網址(未完成): https://mysqlspeaker.online/api-docs/

- 測試帳號 1：
  - 帳號：test111@test.com
  - 密碼：test
- 測試帳號 2：
  - 帳號：test222@test.com
  - 密碼：test
- 測試群組：
  - 邀請碼：7135535744591859712

## 目錄

- [專案架構](#專案架構)
- [功能說明](#功能說明)
- [技術說明](#技術說明)
- [後端架構說明](#後端架構說明)
- [資料庫設計](#資料庫設計)
- [技術堆疊](#技術堆疊)
- [聯絡方式](#聯絡方式)

## 專案架構

![Structure](./readmePics/structure.png)
![Flow Chart](./readmePics/flowChart_V2.png)

## 功能說明

1. 登入**外部** MySQL 資料庫
   - 此網站可以登入非本網站的 MySQL 資料庫。
   - 若要連接到外部資料庫，請先確定該資料庫相關的設定：
     1. 確認 `bind-address` 參數是否開放外部 IP 訪問。
        - Windows 通常在 MySQL 安裝資料夾的 `my.ini` 中。
        - Linux 通常在 `/etc/mysql/my.cnf`、`/etc/my.cnf` 或 `/etc/mysql/mysql.conf.d/mysqld.cnf` 。
     2. 確認防火牆規則是否開放 TCP MySQL 預設端口 3306。
     3. 確認 MySQL 使用者權限，該使用者是否允許遠端訪問。
   - 若以次級使用者登入部分功能可能會無法使用，此處牽涉到權限問題。
   - 以此登入方式連線，歷史紀錄會預設關閉(前端沒輸出、後端不紀錄)。
2. 登入**內部** MySQL 資料庫
   - 登入本網站的 MySQL 資料庫。
   - 權限控制系統是殖生在 MySQL 權限控制系統上。
   - 由於使用的是同一個 MySQL Database 命名空間，所以有可能會發生想創建的 Database 已存在的問題。
   - 可以透過邀請碼創建帳號，多人擁有同一群 Database 的編輯權限。
   - 可以即時看到他人的操作紀錄。
   - 以此登入方式連線，歷史紀錄會依據群組分類讀取。

## 技術說明

- 群組 與 資料庫控制權限：

  - (若為創建新群組的狀況) 使用者註冊時，建立新群組，並針對後續利用邀請碼加入之其他使用者也映射到同一群組。
  - 使用 MySQL 內建的權限管理系統，實際登入 MySQL 建立 Connection Pool 是使用 群組的帳號與密碼 (由後端生成、後端管理)。
  - 因不同群組的 Connection Pool 帳號密碼不盡相同，我選擇 **登入後再建立 Connection Pool**，並使用 global 的 Map 來做 群組對應 Connection Pool 的映射，確保 Connection Pool 實例 不會被重複創立 (下圖左)。
  - 因為有權限問題，僅有在創建 Database 與 History 相關操作的時候使用 root user，其他行為皆使用各群組權限 (下圖右)。

  ![ConnPoolFlowChart](./readmePics/flowChart_eazy.png)

- Socket.io 的應用：

  - 同一群組內有其他使用者修改資料時，會發送即時的通知給其他的線上使用者。
  - 當同群組內的所有使用者皆斷線的時候，結束該群組連接池，避免資源占用。

## 後端架構說明

- 後端架構請參照下方連結 (此 Repo 內的另一個檔案):  
  [Goto FlowChart.md](FlowChart.md)

## 資料庫設計

- 使用者與群組之間的關係，採用建立第三關聯資料表的方式進行資料映射。
- 為確保資料完整性與加速資料搜尋，不該重複的地方都加上 Unique 特性。  
  ![EERD](./readmePics/databaseEERD.png)

## 技術堆疊

- 開發方法與架構

  - OOP
  - MVC
  - RESTful API

- 後端：

  - TypeScript
  - Express.js
  - Socket.io

- 雲端 (AWS)

  - EC2
  - RDS
  - S3 & CloudFront

- 佈署：

  - Docker
  - Ubuntu

- 資料庫：

  - MySQL (RDS)

- 連線：

  - HTTPS
  - Nginx
  - JWT

- 前端：

  - TypeScript
  - React.js
  - Material-UI
  - Tailwind CSS

- 開發工具：

  - Git & GitHub
  - Webpack
  - Eslint
  - Prettier

## 聯絡方式

莊子賢 Tzu-Hsien, Chuang  
email： t1375844@gmail.com  
Linkedin：https://www.linkedin.com/in/tzu-hsien-chuang/
