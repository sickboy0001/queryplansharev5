export const QPS_SAMPLE_XML = `<?xml version="1.0" encoding="utf-16"?>
<ShowPlanXML xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" Version="1.5" Build="13.0.1601.5" xmlns="http://schemas.microsoft.com/sqlserver/2004/07/showplan">
  <BatchSequence>
    <Batch>
      <Statements>
        <StmtSimple StatementText="SELECT * FROM users" StatementId="1" StatementCompId="1" StatementType="SELECT" RetrLevel="0" StatementSqlHandle="0x02000000" StatementParameterizationType="0" QueryHash="0x00000000" QueryPlanHash="0x00000000">
          <QueryPlan DegreeOfParallelism="1" MemoryGrant="1024" CachedPlanSize="16" CompileTime="5" CompileCPU="5" CompileMemory="128">
            <RelOp NodeId="0" PhysicalOp="Clustered Index Scan" LogicalOp="Clustered Index Scan" EstimateRows="1" EstimateIO="0.003125" EstimateCPU="0.000158" AvgRowSize="11" EstimatedTotalSubtreeCost="0.003283" Parallel="0" EstimateRebinds="0" EstimateRewinds="0" EstimatedExecutionMode="Row">
              <OutputList />
              <IndexScan Ordered="1" ForcedIndex="0" ForceScan="0" NoExpandHint="0" Storage="RowStore">
                <DefinedValues />
                <Object Database="[test]" Schema="[dbo]" Table="[users]" Index="[PK_users]" IndexKind="Clustered" />
              </IndexScan>
            </RelOp>
          </QueryPlan>
        </StmtSimple>
      </Statements>
    </Batch>
  </BatchSequence>
</ShowPlanXML>`;

export const QPS_SAMPLE_COMMENT = `
# クエリプランの分析
このクエリは \`users\` テーブルのクラスター化インデックススキャンを行っています。
データ量が増えるとパフォーマンスが低下する可能性があります。
`;
