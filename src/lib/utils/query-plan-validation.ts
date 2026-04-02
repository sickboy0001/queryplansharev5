export const MAX_XML_SIZE = 1 * 1024 * 1024; // 1MB

export function validateQueryPlanXml(xml: string): {
  valid: boolean;
  error?: string;
} {
  if (!xml || typeof xml !== "string") {
    return { valid: false, error: "XMLを入力してください。" };
  }

  // 文字列のバイト数を取得（UTF-8）
  const size = new TextEncoder().encode(xml).length;
  if (size > MAX_XML_SIZE) {
    return {
      valid: false,
      error: `XMLのサイズが制限（1MB）を超えています。現在のサイズ: ${(size / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  // 基本的な書式のチェック
  // 1. <ShowPlanXML タグが含まれているか
  if (!xml.includes("<ShowPlanXML")) {
    return {
      valid: false,
      error: "SQL Serverのクエリプラン（ShowPlanXML）の形式ではありません。",
    };
  }

  // 2. 正しい名前空間が含まれているか
  if (
    !xml.includes("http://schemas.microsoft.com/sqlserver/2004/07/showplan")
  ) {
    return {
      valid: false,
      error: "正しいXML名前空間が含まれていません。",
    };
  }

  return { valid: true };
}
