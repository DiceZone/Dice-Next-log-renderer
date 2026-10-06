// 昵称可以包含括号；账号是时间戳前最后一组 (...) 或 <...>。
// 非贪婪地匹配昵称，避免吞掉账号；保留昵称中的其他括号和 ID 中的全角括号。
// <昵称>(账号) 是旧版 Dice!Next 日志使用过的格式，也需要继续支持。
export const reEditLogTest = /^((?:<[^<>\r\n]+>)|[^<\r\n]+?)(\(([^()\r\n]+)\)|<[^<>\r\n]+>)?([ \t]+)(\d{4}\/\d{1,2}\/\d{1,2} )?(\d{1,2}:\d{1,2}:\d{2})( #\d+)?\r?$/m

export function unwrapName(name: string): string {
  if (name.length > 2 && name.startsWith('<') && name.endsWith('>')) {
    return name.slice(1, -1);
  }
  return name;
}
