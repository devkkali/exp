import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { CATEGORIES } from '@/lib/constants';
export const runtime = 'nodejs';

export async function GET() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Expenses');
  const listSheet = workbook.addWorksheet('Lists');

  const headers = ['date', 'title', 'amount', 'category', 'note', 'estimated'];
  sheet.addRow(headers);
  sheet.addRow(['2026-03-14', 'Groceries', -45.5, 'food', 'Weekly supermarket', 'no']);
  sheet.addRow(['2026-03-15', 'Salary', 3200, 'salary', 'Main job income', 'yes']);

  sheet.columns = [
    { key: 'date', width: 14 },
    { key: 'title', width: 24 },
    { key: 'amount', width: 12 },
    { key: 'category', width: 18 },
    { key: 'note', width: 28 },
    { key: 'estimated', width: 14 },
  ];

  const categoryKeys = CATEGORIES.map((c) => c.key);
  categoryKeys.forEach((category, index) => {
    listSheet.getCell(`A${index + 1}`).value = category;
  });

  listSheet.state = 'hidden';

  const categoryRange = `$A$1:$A$${categoryKeys.length}`;
  for (let row = 2; row <= 1000; row++) {
    sheet.getCell(`D${row}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [`=Lists!${categoryRange}`],
      showErrorMessage: true,
      errorStyle: 'error',
      errorTitle: 'Invalid category',
      error: 'Please pick a category from the dropdown list.',
    };
  }

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFEEE7FF' },
  };

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(Buffer.from(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=\"pocket-budget-import-template.xlsx\"',
      'Cache-Control': 'no-store',
    },
  });
}
