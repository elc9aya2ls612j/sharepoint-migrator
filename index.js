import { convertToHtml } from "mammoth";
import { JSDOM } from "jsdom";
import pkg from 'exceljs';
const { Workbook } = pkg;

export async function main(source, target, placeholders) {

await convertToHtml({path: source})
    .then(function(result){
        var html = result.value; 
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
              (keyString.startsWith("Adobe Launch") ? launchDict : dict)
                .push([keyString, value ? value.textContent : '']);
            }
          });
        }
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');
        worksheet.addRows(dict);
        return workbook.xlsx.writeFile(target).then(() => {
          const placeholderWorkbook = new Workbook();
          if (launchDict.length > 0) {
            return placeholderWorkbook.xlsx.readFile(placeholders).then(() => {
              const placeholderSheet = placeholderWorkbook.getWorksheet(1);
              placeholderSheet.addRows(launchDict);
              return placeholderWorkbook.xlsx.writeFile(placeholders);
            }).catch(()=> {
              const placeholderSheet = placeholderWorkbook.addWorksheet('Sheet 1');
              placeholderSheet.addRows(launchDict);
              return placeholderWorkbook.xlsx.writeFile(placeholders);
            });
          }
        });
    })
    .catch(function(error) {
        console.error(error);
    });
  }