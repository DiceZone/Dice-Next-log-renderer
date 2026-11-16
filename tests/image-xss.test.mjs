// 日志里的图片地址不能跳出 <img src>。
// 2026-11-16 有人上传带引号的图片码，想让地址后半截变成 onerror 属性在染色器里执行脚本。
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const modules = new Map();
function load(relative) {
  if (modules.has(relative)) return modules.get(relative);
  const source = fs.readFileSync(path.join(root, relative), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
  } }).outputText;
  const exports = {};
  const localRequire = (name) => {
    if (name === './qqOfficialFace') return load('src/utils/qqOfficialFace.ts');
    if (name === './cqImage') return load('src/utils/cqImage.ts');
    if (name === './types' || name === './rkey') return {};
    throw new Error('Unexpected dependency: ' + name);
  };
  vm.runInNewContext(code, { exports, require: localRequire, URL }, { filename: relative });
  modules.set(relative, exports);
  return exports;
}
const { msgImageFormat } = load('src/utils/index.ts');

// 预览组件里的 escapeHTML 用文本节点转义，只处理 < > &，引号原样留下。
const escapeHTML = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const render = (message) => msgImageFormat(escapeHTML(message), {}, true);

// 结果里的每个标签都只能有 style 与 src 两个属性，属性值里不能再有引号。
function assertOnlySafeImages(html) {
  const tags = html.match(/<[^>]*>/g) || [];
  for (const tag of tags) {
    assert.match(tag, /^<img style="max-width: 300px" src="[^"]*"(?: crossorigin="anonymous")? \/>$/, tag);
  }
  assert.doesNotMatch(html.replace(/<img [^>]*>/g, ''), /[<>]/, html);
}

const payloads = [
  '[CQ:image,file=x,url="><img src=x onerror="window.__xss=1">]',
  '[CQ:image,summary=[动画表情],file=x,url=" onerror="window.__xss=1" x="]',
  '[CQ:image,file=x,url=\' onerror=\'window.__xss=1\' x=\']',
  '[图:"onerror="window.__xss=1" x="]',
  '[image:" onload="window.__xss=1]',
  '<svg onload="window.__xss=1">',
];

for (const payload of payloads) {
  test(`图片地址不会变成别的属性：${payload.slice(0, 32)}`, () => {
    assertOnlySafeImages(render(payload));
  });
}

test('正常的图片码照常显示', () => {
  assert.equal(
    render('[CQ:image,file=a.image,url=https://example.com/a.png?x=1&y=2]'),
    '<img style="max-width: 300px" src="https://example.com/a.png?x=1&amp;y=2" />',
  );
  assert.equal(render('[图:https://example.com/b.png]'), '<img style="max-width: 300px" src="https://example.com/b.png" />');
});
