"use client";

import React, { useEffect, useRef } from "react";
import "html-query-plan/css/qp.css"; // スタイルをインポ�EチE

interface Props {
  xmlData: string;
}

export default function PlanVisualizer({ xmlData }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && xmlData) {
      // コンチE��を一度クリア
      containerRef.current.innerHTML = "";

      // html-query-plan を動皁E��インポ�EチE
      const loadAndShowPlan = async () => {
        try {
          // @ts-ignore
          const qp = await import("html-query-plan");
          if (containerRef.current) {
            qp.showPlan(containerRef.current, xmlData);
          }
        } catch (err) {
          console.error("Plan visualization failed:", err);
        }
      };

      loadAndShowPlan();
    }
  }, [xmlData]);

  return (
    <div className="border rounded-lg p-4 bg-white overflow-auto min-h-[500px] w-full">
      <div ref={containerRef} className="qp-root" />
    </div>
  );
}
