/**
 * Google Apps Script — nhận dữ liệu quiz và ghi vào Google Trang tính.
 * Cách dùng:
 * - Tạo một Google Sheet → Extensions → Apps Script → dán code này.
 * - Deploy → New deployment → Web app (Anyone + Execute as Me).
 * - Copy Web App URL → dán vào CONFIG.GOOGLE_SHEETS_ENDPOINT trong app.js.
 */

function doPost(e) {
  try {
    var body = e.postData && e.postData.contents ? e.postData.contents : null;
    if (!body) return _json({ ok: false, error: "Empty body" });

    var data = JSON.parse(body);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Responses") || ss.insertSheet("Responses");

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", "SessionId", "Name", "Email", "MSSV",
        "ScoreTotal", "ScoreBase", "ScoreSpeedBonus",
        "TotalQuestions", "CorrectCount", "Accuracy(%)", "TimeSpentSec", "UserAgent",
        "Answers(JSON)"
      ]);
    }

    var meta = data.meta || {};
    var row = [
      new Date(),
      data.sessionId || "",
      data.player && data.player.name || "",
      data.player && data.player.email || "",
      data.player && data.player.mssv || "",
      data.score && data.score.total || 0,
      data.score && data.score.base || 0,
      data.score && data.score.speedBonus || 0,
      meta.totalQuestions || 0,
      meta.correctCount || 0,
      meta.accuracy || 0,
      meta.timeSpentSec || 0,
      meta.userAgent || "",
      JSON.stringify(data.answers || [])
    ];

    sheet.appendRow(row);
    return _json({ ok: true, appended: 1 });

  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  return _json({ ok: true, method: "GET", hint: "Use POST with JSON body." });
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
