"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface PlanXmlProps {
  xmlData: string;
}

export function PlanXml({ xmlData }: PlanXmlProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(xmlData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  // XMLを整形する（簡易的なもの。本来はライブラリを使うのが望ましいが、要件に合わせてシンプルに）
  const formatXml = (xml: string) => {
    let formatted = "";
    let indent = "";
    const tab = "  ";
    xml.split(/>\s*</).forEach((node) => {
      if (node.match(/^\/\w/)) {
        indent = indent.substring(tab.length);
      }
      formatted += indent + "<" + node + ">\r\n";
      if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith("?")) {
        indent += tab;
      }
    });
    return formatted.substring(1, formatted.length - 3);
  };

  // XMLをパースして着色されたコンポーネントを返す
  const HighlightedXml = ({ xml }: { xml: string }) => {
    // 簡易的なシンタックスハイライトの実装
    // タグ、属性名、属性値を正規表現で抽出して色分けする
    const parts = xml.split(/(<[^>]+>)/g);

    return (
      <>
        {parts.map((part, i) => {
          if (part.startsWith("<")) {
            // タグの場合
            const isClosing = part.startsWith("</");
            const isProcessing = part.startsWith("<?");
            const content = part.slice(
              isClosing ? 2 : isProcessing ? 2 : 1,
              -1,
            );
            const [tagName, ...attrParts] = content.split(/(\s+)/);

            return (
              <span key={i}>
                <span className="text-slate-500">
                  {"<"}
                  {isClosing ? "/" : isProcessing ? "?" : ""}
                </span>
                <span className="text-blue-400">{tagName}</span>
                {attrParts.map((attrPart, j) => {
                  if (attrPart.trim() === "") return attrPart;
                  if (attrPart.includes("=")) {
                    const [name, value] = attrPart.split("=");
                    return (
                      <span key={j}>
                        <span className="text-cyan-300">{name}</span>
                        <span className="text-slate-400">=</span>
                        <span className="text-amber-200">{value}</span>
                      </span>
                    );
                  }
                  return (
                    <span key={j} className="text-cyan-300">
                      {attrPart}
                    </span>
                  );
                })}
                <span className="text-slate-500">
                  {isProcessing ? "?" : ""}
                  {">"}
                </span>
              </span>
            );
          }
          // テキストノードの場合
          return <span key={i}>{part}</span>;
        })}
      </>
    );
  };

  return (
    <div className="relative group">
      <div className="absolute right-4 top-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="bg-white/80 backdrop-blur-sm border-2 border-[#000080]/20 hover:border-[#000080]/50 text-[#000080] transition-all flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-600" />
              <span className="text-xs font-bold text-green-600">
                コピー完了
              </span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span className="text-xs font-bold">XMLをコピー</span>
            </>
          )}
        </Button>
      </div>
      <div className="bg-[#1e1e1e] text-slate-300 p-6 rounded-xl border-2 border-[#000080]/20 shadow-inner max-h-[800px] overflow-auto font-mono text-sm leading-relaxed">
        <pre className="whitespace-pre">
          <code>
            <HighlightedXml xml={xmlData} />
          </code>
        </pre>
      </div>
    </div>
  );
}
