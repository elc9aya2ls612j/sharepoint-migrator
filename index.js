import { convertToHtml } from "mammoth";
import { JSDOM } from "jsdom";
import pkg from 'exceljs';
const { Workbook } = pkg;
import * as fs from 'node:fs/promises';
import path from "node:path";

export async function main(source, target, placeholders) {
  let converted;
  try {
    converted = await convertToHtml({path: source});
  } catch {
    console.log("No config/analytics.docx");
  }
  const html = converted.value;
  var dom = new JSDOM(html);
  var table = dom.window.document.querySelector("table");
  const dict = [];
  const launchDict = [];
  if (table) {
    table.querySelectorAll('tr').forEach(tr =>  {
      const key = tr.querySelector('td');
      const value = tr.querySelector('td:nth-child(2)');
      if (key) {
        const keyString = key.textContent;
        const valueString = value ? value.textContent : '';
        if (keyString === "Adobe Launch - Dev") {
          launchDict.push(["launch-non-production-url", valueString]);
        } else if (keyString === "Adobe Launch - Prod") {
          launchDict.push(["launch-production-url", valueString]);
        } else {
          dict.push([keyString, valueString]);
        }
      }
    });
  }
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');
  worksheet.addRows(dict);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await workbook.xlsx.writeFile(target);
  const placeholderWorkbook = new Workbook();
  let placeholderSheet;
  if (launchDict.length > 0) {
    try {
      await placeholderWorkbook.xlsx.readFile(placeholders);
      placeholderSheet = placeholderWorkbook.getWorksheet(1);
    } catch {
      placeholderSheet = placeholderWorkbook.addWorksheet('Sheet 1');
    }
    placeholderSheet.addRows(launchDict);
    await placeholderWorkbook.xlsx.writeFile(placeholders);
  }
  await fs.unlink(source);
}