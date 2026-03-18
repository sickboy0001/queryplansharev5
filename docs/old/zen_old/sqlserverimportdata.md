/*
Docker起動時、パスをLinkするようにする。
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourPassword123!" -p 1433:1433 --name sql_server_container -v C:\temp:/var/opt/mssql/temp -d mcr.microsoft.com/mssql/server:2022-latest


docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourPassword123!" \
   -e "MSSQL_COLLATION=Japanese_CI_AS" \
   -p 1433:1433 --name sql_server_container \
   -v C:\sqlserver\data:/var/opt/mssql/data \
   -d mcr.microsoft.com/mssql/server:2022-latest

「C:\sqlserver\data」をDockerから見れるようにする。

*/
use testdb

/*
$csv = Get-Content "C:\temp\KEN_ALL.csv" -Encoding String
[System.IO.File]::WriteAllLines("C:\temp\KEN_ALL_final.csv", $csv, [System.Text.Encoding]::Unicode)
*/

BULK INSERT dbo.org_postcode 
FROM '/var/opt/mssql/temp/KEN_ALL_final.csv' 
WITH (
   FIELDTERMINATOR = ',', 
   ROWTERMINATOR = '\n',       -- widechar時は '\n' 指定で内部的に適切に処理されます
   DATAFILETYPE = 'widechar', 
   FORMAT = 'CSV',             -- ダブルクォーテーション囲みを考慮
   FIELDQUOTE = '"',           -- 日本郵便のCSVは各項目が " で囲まれているため
   TABLOCK,
   FIRSTROW = 1
);



CREATE TABLE [dbo].[postcode] (
	id    INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	[organization_no] char(5) NULL,
	[oldadrsubno] char(5) NULL,
	[adrsubno] char(7) NULL,
	[prefecture_kname] nvarchar(10) NULL,   -- 都道府県名
	[locality_kname] nvarchar(30) NULL,     -- 市区町村名
	[city_kname] nvarchar(max) NULL,        -- 町域名　
	[prefecture_jpname] nvarchar(10) NULL,  -- 都道府県名-日本語
	[locality_jpname] nvarchar(30) NULL,    -- 市区町村名-日本語
	[city_jpname] nvarchar(max) NULL,       -- 町域名-日本語
	[flg1] int NULL,
	[flg2] int NULL,
	[flg3] int NULL,
	[flg4] int NULL,
	[flg5] int NULL,
	[flg6] int NULL
)


insert into postcode 
(
	[organization_no],[oldadrsubno],[adrsubno]
	,[prefecture_kname],[locality_kname],[city_kname]
	,[prefecture_jpname],[locality_jpname],[city_jpname]
	,[flg1],[flg2],[flg3],[flg4],[flg5],[flg6]
)
select 	
	org.organization_no
	,replace(org.oldadrsubno,'"','') -- 不要な”を省く
	,replace(org.adrsubno,'"','')
	,replace(org.prefecture_kname,'"','')
	,replace(org.locality_kname,'"','')
	,replace(org.city_kname,'"','')
	,replace(org.prefecture_jpname,'"','')
	,replace(org.locality_jpname,'"','')
	,replace(org.city_jpname,'"','')
	,org.flg1,org.flg2,org.flg3,org.flg4,org.flg5,org.flg6
from org_postcode org


select * from postcode where locality_jpname like N'東諸県郡%' 