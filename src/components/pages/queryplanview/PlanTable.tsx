"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  Search,
  ListFilter,
  Activity,
  Layout,
  Box,
  ChevronRight,
  ChevronDown,
  Zap,
  Cpu,
  BarChart3,
} from "lucide-react";
import { Markdown } from "@/components/ui/markdown";

interface OperationInfo {
  nodeId: string;
  physicalOp: string;
  logicalOp: string;
  estimateRows: string;
  avgRowSize: string;
  totalSubtreeCost: string;
  objectName: string;
  indexName: string;
  level: number;
  seekPredicates?: string[];
  predicates?: string[];
}

interface PlanInfo {
  statementId: string;
  statementText: string;
  statementType: string;
  subtreeCost: string;
  estRows: string;
  optimizationLevel: string;
  earlyAbortReason: string;
  dop: string;
  statsInfo: {
    statistics: string;
    samplingPercent: string;
  }[];
  operations: OperationInfo[];
}

interface PlanTableProps {
  xmlData: string;
}

export function PlanTable({ xmlData }: PlanTableProps) {
  const [plans, setPlans] = useState<PlanInfo[]>([]);

  useEffect(() => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlData, "text/xml");
      const ns = "http://schemas.microsoft.com/sqlserver/2004/07/showplan";

      const getElements = (parent: Element | Document, name: string) => {
        const elems = parent.getElementsByTagNameNS(ns, name);
        return elems.length > 0
          ? Array.from(elems)
          : Array.from(parent.getElementsByTagName(name));
      };

      const extractOperations = (
        relOpElement: Element,
        level: number,
      ): OperationInfo[] => {
        const obj = getElements(relOpElement, "Object")[0];

        // SeekPredicatesから情報を抽出
        const seekPredicateElements = getElements(
          relOpElement,
          "SeekPredicateNew",
        );
        const seekPredicates: string[] = [];
        seekPredicateElements.forEach((seekNode) => {
          // SeekKeys を探す
          const seekKeysList = getElements(seekNode, "SeekKeys");
          seekKeysList.forEach((seekKeys) => {
            Array.from(seekKeys.children).forEach((rangeNode) => {
              const scanType = rangeNode.getAttribute("ScanType");
              const rangeType = rangeNode.localName;
              const scalarOps = getElements(rangeNode, "ScalarOperator");
              scalarOps.forEach((op) => {
                const scalarStr = op.getAttribute("ScalarString");
                if (scalarStr) {
                  seekPredicates.push(
                    `${rangeType}${scanType ? `(${scanType})` : ""}: ${scalarStr}`,
                  );
                }
              });
            });
          });
        });

        // Predicate (残余述語) の抽出
        const predicateElements = getElements(relOpElement, "Predicate");
        const predicates: string[] = [];
        predicateElements.forEach((predNode) => {
          const scalarOps = getElements(predNode, "ScalarOperator");
          scalarOps.forEach((op) => {
            const scalarStr = op.getAttribute("ScalarString");
            if (scalarStr) predicates.push(scalarStr);
          });
        });

        const currentOp: OperationInfo = {
          nodeId: relOpElement.getAttribute("NodeId") || "",
          physicalOp: relOpElement.getAttribute("PhysicalOp") || "",
          logicalOp: relOpElement.getAttribute("LogicalOp") || "",
          estimateRows: relOpElement.getAttribute("EstimateRows") || "0",
          avgRowSize: relOpElement.getAttribute("AvgRowSize") || "0",
          totalSubtreeCost:
            relOpElement.getAttribute("EstimatedTotalSubtreeCost") || "0",
          objectName: obj?.getAttribute("Table") || "",
          indexName: obj?.getAttribute("Index") || "",
          level: level,
          seekPredicates:
            seekPredicates.length > 0 ? seekPredicates : undefined,
          predicates: predicates.length > 0 ? predicates : undefined,
        };

        let childOps: OperationInfo[] = [];
        // RelOp の直下にある子要素を探索し、その中にある RelOp を再帰的に取得
        const children = Array.from(relOpElement.children);
        children.forEach((child) => {
          // NestedLoops, Hash, Parallelism などのコンテナ要素を探す
          const nestedRelOps = getElements(child, "RelOp");
          // getElements は子孫すべてを取ってしまう可能性があるので、
          // 直接の子 RelOp だけを抽出するように工夫が必要だが、
          // 実行計画の構造上、RelOp の中には別の演算コンテナがあり、その中に RelOp がある。
          // ここでは単純化のため、この RelOp 直下の子要素内にある最初の階層の RelOp を探す。

          // 実際には XML 構造は RelOp -> (NestedLoops|IndexScan|...) -> RelOp となっている。
          // child.children から RelOp を探す
          Array.from(child.children).forEach((grandChild) => {
            if (grandChild.localName === "RelOp") {
              childOps = [
                ...childOps,
                ...extractOperations(grandChild, level + 1),
              ];
            }
          });
        });

        return [currentOp, ...childOps];
      };

      const statements = getElements(xmlDoc, "StmtSimple");
      const extractedPlans: PlanInfo[] = statements
        .map((stmt) => {
          const queryPlan = getElements(stmt, "QueryPlan")[0];
          let operations: OperationInfo[] = [];
          let dop = "1";
          if (queryPlan) {
            const rootRelOp = getElements(queryPlan, "RelOp")[0];
            if (rootRelOp) {
              operations = extractOperations(rootRelOp, 0);
            }

            const optimizerProps = getElements(
              queryPlan,
              "OptimizerHardwareDependentProperties",
            )[0];
            if (optimizerProps) {
              dop =
                optimizerProps.getAttribute(
                  "EstimatedAvailableDegreeOfParallelism",
                ) || "1";
            }
          }

          // StatisticsInfoの抽出
          const statsInfo: { statistics: string; samplingPercent: string }[] =
            [];
          const statsNodes = getElements(stmt, "StatisticsInfo");
          statsNodes.forEach((node) => {
            statsInfo.push({
              statistics: node.getAttribute("Statistics") || "",
              samplingPercent: node.getAttribute("SamplingPercent") || "0",
            });
          });

          const statementText = stmt.getAttribute("StatementText") || "";
          // 空白行や「;」のみの行を除去
          const cleanedText = statementText
            .split("\n")
            .filter((line) => {
              const trimmedLine = line.trim();
              return trimmedLine !== "" && trimmedLine !== ";";
            })
            .join("\n")
            .trim();

          return {
            statementId: stmt.getAttribute("StatementId") || "",
            statementText: cleanedText,
            statementType: stmt.getAttribute("StatementType") || "",
            subtreeCost: stmt.getAttribute("StatementSubTreeCost") || "0",
            estRows: stmt.getAttribute("StatementEstRows") || "0",
            optimizationLevel: stmt.getAttribute("StatementOptmLevel") || "",
            earlyAbortReason:
              stmt.getAttribute("StatementOptmEarlyAbortReason") || "",
            dop: dop,
            statsInfo: statsInfo,
            operations: operations,
          };
        })
        .filter((plan) => plan.statementText !== "");

      setPlans(extractedPlans);
    } catch (err) {
      console.error("Error parsing execution plan XML:", err);
    }
  }, [xmlData]);

  if (plans.length === 0) return null;

  return (
    <div className="space-y-12">
      {plans.map((plan, idx) => (
        <div key={idx} className="space-y-6">
          {/* Statement Summary Card */}
          <div className="bg-slate-50 border-2 border-[#000080]/10 rounded-xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2 bg-[#000080] text-white px-3 py-1 rounded-full text-xs font-black uppercase">
                Statement {plan.statementId || idx + 1}
              </div>
              <Badge
                variant="outline"
                className="border-[#000080] text-[#000080] font-bold"
              >
                {plan.statementType}
              </Badge>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Activity size={14} className="text-[#000080]/60" />
                <span>Cost: {parseFloat(plan.subtreeCost).toFixed(6)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <ListFilter size={14} className="text-[#000080]/60" />
                <span>Est Rows: {parseFloat(plan.estRows).toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Zap size={14} className="text-amber-500/80" />
                <span>Opt Level: {plan.optimizationLevel}</span>
                {plan.earlyAbortReason && (
                  <span className="text-[10px] text-red-500">
                    ({plan.earlyAbortReason})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Cpu size={14} className="text-blue-500/80" />
                <span>DOP: {plan.dop}</span>
              </div>
              {plan.statsInfo.length > 0 && (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <BarChart3 size={14} className="text-green-500/80" />
                  <div className="flex flex-wrap gap-1">
                    {plan.statsInfo.slice(0, 2).map((s, i) => (
                      <span
                        key={i}
                        className="bg-green-50 px-1 rounded border border-green-100 text-[9px]"
                      >
                        {s.statistics} (
                        {parseFloat(s.samplingPercent).toFixed(1)}%)
                      </span>
                    ))}
                    {plan.statsInfo.length > 2 && (
                      <span className="text-[9px]">...</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Collapsible defaultOpen>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-[#000080] uppercase tracking-wider">
                  Query Text
                </span>
                <CollapsibleTrigger>
                  <div className="flex items-center h-6 px-2 rounded-md hover:bg-slate-200/50 cursor-pointer transition-colors group">
                    <span className="text-[10px] font-bold text-slate-500 group-data-[state=open]:hidden">
                      Show Query
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 group-data-[state=closed]:hidden">
                      Hide Query
                    </span>
                    <ChevronDown
                      size={12}
                      className="ml-1 text-slate-400 group-data-[state=open]:rotate-180 transition-transform"
                    />
                  </div>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="bg-white border border-slate-200 rounded-lg p-0 font-mono text-xs text-slate-700 shadow-inner max-h-48 overflow-y-auto">
                  <Markdown
                    content={`\`\`\`sql\n${plan.statementText.trim()}\n\`\`\``}
                    className="prose-sm max-w-none"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Operations Table */}
          <Collapsible
            defaultOpen
            className="rounded-xl border-2 border-[#000080]/10 overflow-hidden shadow-md"
          >
            <div className="bg-slate-100 px-4 py-3 border-b-2 border-[#000080]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layout size={16} className="text-[#000080]" />
                <h3 className="text-sm font-black text-[#000080] uppercase tracking-wider">
                  Execution Operations (Hierarchical)
                </h3>
              </div>
              <CollapsibleTrigger>
                <div className="flex items-center h-8 px-2 rounded-md hover:bg-slate-200/50 cursor-pointer transition-colors group">
                  <span className="text-[10px] font-bold text-slate-500 group-data-[state=open]:hidden">
                    Expand
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 group-data-[state=closed]:hidden">
                    Collapse
                  </span>
                  <ChevronDown
                    size={14}
                    className="ml-1 text-[#000080] group-data-[state=open]:rotate-180 transition-transform"
                  />
                </div>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="hover:bg-transparent border-b-2 border-slate-200">
                    <TableHead className="w-[60px] font-black text-[#000080] text-[10px] uppercase px-4">
                      ID
                    </TableHead>
                    <TableHead className="font-black text-[#000080] text-[10px] uppercase">
                      Operator / Object
                    </TableHead>
                    <TableHead className="font-black text-[#000080] text-[10px] uppercase">
                      Logical Op
                    </TableHead>
                    <TableHead className="text-right font-black text-[#000080] text-[10px] uppercase">
                      Est. Rows
                    </TableHead>
                    <TableHead className="text-right font-black text-[#000080] text-[10px] uppercase px-4">
                      Cost
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plan.operations.map((op, opIdx) => (
                    <TableRow
                      key={opIdx}
                      className="group hover:bg-blue-50/50 transition-colors"
                    >
                      <TableCell className="font-mono text-xs font-bold text-slate-400 group-hover:text-[#000080] px-4">
                        #{op.nodeId}
                      </TableCell>
                      <TableCell>
                        <div
                          className="flex flex-col gap-1 py-1"
                          style={{ paddingLeft: `${op.level * 24}px` }}
                        >
                          <div className="flex items-center gap-2">
                            {op.level > 0 && (
                              <ChevronRight
                                size={12}
                                className="text-slate-300"
                              />
                            )}
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${op.level === 0 ? "bg-[#000080]" : "bg-blue-400"}`}
                            ></div>
                            <span
                              className={`font-bold ${op.level === 0 ? "text-[#000080]" : "text-slate-700"}`}
                            >
                              {op.physicalOp}
                            </span>
                          </div>
                          {(op.objectName || op.indexName) && (
                            <div className="flex items-center gap-1.5 pl-3.5">
                              <Box
                                size={10}
                                className="text-slate-400 shrink-0"
                              />
                              <span className="text-[10px] text-slate-500 font-medium truncate">
                                {op.objectName}
                                {op.indexName && (
                                  <span className="text-blue-600 ml-1 font-bold">
                                    [{op.indexName}]
                                  </span>
                                )}
                              </span>
                            </div>
                          )}
                          {op.seekPredicates && (
                            <div className="flex flex-col gap-0.5 mt-1 pl-3.5">
                              {op.seekPredicates.map((seek, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="flex items-center gap-1.5"
                                >
                                  <Search
                                    size={10}
                                    className="text-amber-500 shrink-0"
                                  />
                                  <span className="text-[9px] text-slate-600 font-mono bg-amber-50 px-1 rounded border border-amber-100/50 break-all">
                                    {seek}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          {op.predicates && (
                            <div className="flex flex-col gap-0.5 mt-1 pl-3.5">
                              {op.predicates.map((pred, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="flex items-center gap-1.5"
                                >
                                  <ListFilter
                                    size={10}
                                    className="text-blue-400 shrink-0"
                                  />
                                  <span className="text-[9px] text-slate-600 font-mono bg-blue-50 px-1 rounded border border-blue-100/50 break-all">
                                    {pred}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-500 font-medium italic text-xs">
                        {op.logicalOp}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-bold text-slate-600">
                        {parseFloat(op.estimateRows).toLocaleString(undefined, {
                          maximumFractionDigits: 1,
                        })}
                      </TableCell>
                      <TableCell className="text-right px-4">
                        <span className="font-mono text-xs font-black text-[#000080]/80">
                          {parseFloat(op.totalSubtreeCost).toFixed(4)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
    </div>
  );
}
