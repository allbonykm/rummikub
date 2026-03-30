/**
 * Google Apps Script API 래퍼
 * GAS Web App URL을 통해 데이터를 보내고 받습니다.
 */

// TODO: 실제 Google Apps Script Web App URL로 교체
const GAS_URL = 'https://script.google.com/macros/s/AKfycbymGfiiGBQicSo2jbINdus6LZHYd8Re3XA9Huqw8z5OYVIynRH7dnih9IrGSN6ZtBV4/exec';

/**
 * 경기 기록을 구글 시트에 저장
 */
export async function saveGameRecord(record) {
  if (!GAS_URL) {
    console.warn('[API] GAS_URL이 설정되지 않았습니다. 로컬 모드로 동작합니다.');
    return { success: true, local: true };
  }

  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'addRecord',
        data: record,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('[API] 기록 저장 실패:', error);
    throw error;
  }
}

/**
 * 최근 기록 Undo (IsDeleted = TRUE)
 */
export async function undoLastRecord(recordId) {
  if (!GAS_URL) {
    console.warn('[API] GAS_URL이 설정되지 않았습니다.');
    return { success: true, local: true };
  }

  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'undoRecord',
        id: recordId,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('[API] Undo 실패:', error);
    throw error;
  }
}

/**
 * 통계 데이터 조회
 */
export async function fetchStats() {
  if (!GAS_URL) {
    console.warn('[API] GAS_URL이 설정되지 않았습니다. 로컬 데이터로 대체합니다.');
    return null;
  }

  try {
    const response = await fetch(`${GAS_URL}?action=getStats`);
    return await response.json();
  } catch (error) {
    console.error('[API] 통계 조회 실패:', error);
    throw error;
  }
}
