/* ══════════════════════════════════════════
   SENTINEL — Signalstats API integration
   Populates the Recent Signal Log on the
   track-record page from
   https://www.cryptohopper.com/signalstats.php
   ══════════════════════════════════════════ */

(function () {
  const SIGNALLER_ID = 744;
  const API = 'https://www.cryptohopper.com/signalstats.php';

  function formatDate(unix) {
    if (!unix) return '—';
    return new Date(unix * 1000).toISOString().slice(0, 10);
  }

  function formatHold(seconds) {
    if (!seconds || seconds <= 0) return '—';
    if (seconds < 3600) return Math.round(seconds / 60) + 'm';
    if (seconds < 86400) return Math.round(seconds / 3600) + 'h';
    return Math.round(seconds / 86400) + 'd';
  }

  function formatPct(n) {
    if (n === null || n === undefined || Number.isNaN(n)) return '—';
    const sign = n >= 0 ? '+' : '-';
    return sign + Math.abs(n).toFixed(2) + '%';
  }

  // The signaller fires the same logical trade across every supported
  // exchange. Dedupe by (coin, exit_time bucketed to 30 minutes).
  function dedupeTrades(trades) {
    const seen = new Set();
    const out = [];
    for (const t of trades) {
      const bucket = Math.floor((t.exit_time || 0) / 1800);
      const key = `${t.coin}|${bucket}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(t);
    }
    return out;
  }

  function renderRows(tbody, trades) {
    if (!tbody || !trades || !trades.length) return;
    tbody.innerHTML = dedupeTrades(trades)
      .slice(0, 10)
      .map((t) => {
        const win = (t.result_pct || 0) >= 0;
        const cls = win ? 'signal-log__result--win' : 'signal-log__result--loss';
        return `
          <tr>
            <td>${formatDate(t.exit_time)}</td>
            <td>${t.market}</td>
            <td>${(t.side || 'long').replace(/^./, (c) => c.toUpperCase())}</td>
            <td>${formatHold(t.hold_seconds)}</td>
            <td class="${cls}">${formatPct(t.result_pct)}</td>
          </tr>`;
      })
      .join('');
  }

  async function load() {
    const tbody = document.querySelector('.signal-log tbody');
    if (!tbody) return;
    try {
      const url = `${API}?signal_id=${SIGNALLER_ID}&exchange=all&trades=1`;
      const res = await fetch(url, { cache: 'no-store' });
      const json = await res.json();
      if (json.status !== 1 || !json.data) return;
      if (Array.isArray(json.data.paired_trades)) {
        renderRows(tbody, json.data.paired_trades);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[signalstats]', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
