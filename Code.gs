
/**
 * GOOGLE APPS SCRIPT INTEGRATION
 * Copy code ini ke editor Apps Script di Google Sheets Anda.
 * 1. Buka Google Sheet
 * 2. Menu: Extensions > Apps Script
 * 3. Paste kode ini
 * 4. Deploy > New Deployment > Web App
 * 5. Access: Anyone
 */

const SHEET_NAME = 'Sheet1';

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  const json = data.map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify(json))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);
    
    // Sesuaikan header kolom di sheet Anda
    sheet.appendRow([
      data.timestamp,
      data.batch,
      data.kejuruan,
      data.namaProgram,
      data.jenisPelatihan,
      data.jumlahJP,
      data.pesertaSiapKerja,
      data.pesertaLulus,
      data.tanggalMulai,
      data.tanggalSelesai,
      data.pic
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({result: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({result: 'error', message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
