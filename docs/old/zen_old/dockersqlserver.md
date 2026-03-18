そのエラーは、Windowsの **PowerShell** でコマンドを実行した際に、改行コードのバックスラッシュ（`\`）が正しく認識されず、2行目の `-p` が独立したコマンドとして実行されてしまったことが原因です。

PowerShellでは、行を継続させる記号は `\` ではなく **``` (バッククォート)** を使います。

### 解決策：1行にまとめて実行する

一番確実なのは、改行せずに1行でコピー＆ペーストして実行することです。以下のコマンドをそのまま貼り付けてみてください。

```powershell
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrongPassword123!" -p 1433:1433 --name sql1 -d mcr.microsoft.com/mssql/server:2022-latest

```

> [!IMPORTANT]
> **パスワードの注意点:** SQL Serverのパスワード（`MSSQL_SA_PASSWORD`）は、**英大文字・小文字・数字・記号**のうち3種類以上を含む複雑なものである必要があります。単純すぎるとコンテナが起動直後に終了してしまいます。

---

### 起動したか確認する方法

コマンド実行後、以下の手順で正しく動いているか確認してください。

1. **状態確認:** `docker ps` を実行し、`STATUS` が `Up` になっているか確認します。
2. **ツールで接続:** **SQL Server Management Studio (SSMS)** や **Azure Data Studio** を開き、以下の設定で接続します。
* **Server Name:** `localhost`
* **Authentication:** `SQL Server Authentication`
* **Login:** `sa`
* **Password:** `YourStrongPassword123!`（上記で設定したもの）



### クエリプランを見るための準備

接続できたら、SSMSのツールバーにある **「実際の実行プランを含める」** アイコンをクリックしてからクエリを実行してみてください。

---

**もし `docker ps` で何も表示されない（落ちている）場合は、パスワードが単純すぎて拒否された可能性があります。**
その場合は一度 `docker rm -f sql1` で削除してから、より複雑なパスワードで再試行してみてください。

次は、接続した後に「実行プランの基本」を確認するための簡単なSQLサンプルをお出ししましょうか？


BULK INSERT dbo.org_postcode FROM '/var/opt/mssql/temp/KEN_ALL.csv' --ローカルパス
   WITH (
      FIELDTERMINATOR = ',', -- csv区切り文字
      ROWTERMINATOR = '\n',  -- row区切り文字
      DATAFILETYPE = 'char'
   )


//パスをローカルに結び付ける
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourPassword123!" -p 1433:1433 --name sql_server_container -v C:\temp:/var/opt/mssql/temp -d mcr.microsoft.com/mssql/server:2022-latest

password
YourPassword123!