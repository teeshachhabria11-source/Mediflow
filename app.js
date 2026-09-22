/**
 * MediFlow Pharma - Executive Management Report Application Logic
 * Interactive Visualizations, Matrix Heatmap, and Simulation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initRollNumberPersistence();
  initCharts();
  renderFillRateMatrix();
  renderRiskTable();
  initSimulator();
  initSmoothScroll();
});

/* ==========================================================================
   1. Theme Toggle & Persistence
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('mediflow_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('mediflow_theme', newTheme);
    updateThemeIcon(newTheme);
    updateChartTheme(newTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#theme-toggle i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

/* ==========================================================================
   2. Group Member Roll Numbers (Editable with localStorage)
   ========================================================================== */
const DEFAULT_MEMBERS = [
  { name: "Teesha Chhabria", roll: "22BCE1001", id: "roll-1" },
  { name: "Sakshi Makhija", roll: "22BCE1002", id: "roll-2" },
  { name: "Shrusti Shah", roll: "22BCE1003", id: "roll-3" },
  { name: "Anand Kandavalli", roll: "22BCE1004", id: "roll-4" },
  { name: "Shriya Kabra", roll: "22BCE1005", id: "roll-5" }
];

function initRollNumberPersistence() {
  DEFAULT_MEMBERS.forEach(member => {
    const input = document.getElementById(member.id);
    if (input) {
      const savedRoll = localStorage.getItem(`mediflow_${member.id}`) || member.roll;
      input.value = savedRoll;
      input.addEventListener('input', (e) => {
        localStorage.setItem(`mediflow_${member.id}`, e.target.value.trim());
      });
    }
  });
}

/* ==========================================================================
   3. Curated Database Records & Datasets (Supabase Project: Mediflow_Pharma)
   ========================================================================== */
const MONTHS = [
  '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06',
  '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12',
  '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06',
  '2026-07', '2026-08'
];

const OVERALL_MONTHLY_DEMAND = [
  { month: '2025-01', req: 2507, ful: 2407, back: 100 },
  { month: '2025-02', req: 2319, ful: 2247, back: 72 },
  { month: '2025-03', req: 2686, ful: 2601, back: 85 },
  { month: '2025-04', req: 2694, ful: 2592, back: 102 },
  { month: '2025-05', req: 2512, ful: 2427, back: 85 },
  { month: '2025-06', req: 2664, ful: 2570, back: 94 },
  { month: '2025-07', req: 2605, ful: 2515, back: 90 },
  { month: '2025-08', req: 3516, ful: 3252, back: 264 },
  { month: '2025-09', req: 4154, ful: 3742, back: 412 },
  { month: '2025-10', req: 2458, ful: 2384, back: 74 },
  { month: '2025-11', req: 2404, ful: 2335, back: 69 },
  { month: '2025-12', req: 2604, ful: 2514, back: 90 },
  { month: '2026-01', req: 2678, ful: 2585, back: 93 },
  { month: '2026-02', req: 2501, ful: 2419, back: 82 },
  { month: '2026-03', req: 2493, ful: 2411, back: 82 },
  { month: '2026-04', req: 2624, ful: 2530, back: 94 },
  { month: '2026-05', req: 2735, ful: 2642, back: 93 },
  { month: '2026-06', req: 2694, ful: 2598, back: 96 },
  { month: '2026-07', req: 2475, ful: 2392, back: 83 },
  { month: '2026-08', req: 2736, ful: 2636, back: 100 }
];

const CATEGORY_MONTHLY_DATA = {
  'All': {
    req: OVERALL_MONTHLY_DEMAND.map(d => d.req),
    ful: OVERALL_MONTHLY_DEMAND.map(d => d.ful)
  },
  'Hydration': {
    req: [762, 620, 721, 671, 835, 742, 719, 1304, 1539, 690, 695, 849, 715, 769, 717, 737, 760, 760, 815, 760],
    ful: [735, 601, 702, 651, 805, 713, 694, 1167, 1297, 671, 677, 823, 698, 742, 697, 711, 733, 734, 791, 735]
  },
  'Pain & Fever': {
    req: [319, 269, 432, 409, 307, 375, 421, 579, 648, 340, 293, 322, 362, 358, 386, 349, 387, 346, 319, 428],
    ful: [307, 262, 413, 396, 294, 364, 405, 510, 553, 327, 284, 311, 348, 349, 373, 337, 376, 336, 309, 414]
  },
  'Respiratory': {
    req: [286, 404, 360, 422, 327, 351, 326, 505, 451, 282, 353, 385, 352, 274, 336, 348, 304, 386, 359, 400],
    ful: [275, 386, 347, 402, 317, 340, 317, 490, 436, 275, 338, 370, 337, 264, 321, 333, 294, 373, 349, 385]
  },
  'Pain Care': {
    req: [371, 316, 409, 361, 380, 390, 357, 370, 512, 367, 357, 376, 457, 390, 371, 344, 434, 343, 317, 365],
    ful: [353, 304, 394, 346, 365, 373, 344, 355, 492, 355, 349, 362, 441, 377, 361, 332, 418, 331, 303, 352]
  },
  'Wellness': {
    req: [323, 291, 370, 421, 278, 433, 413, 384, 481, 426, 402, 315, 399, 363, 301, 342, 472, 380, 329, 398],
    ful: [310, 286, 362, 402, 272, 420, 399, 370, 462, 413, 392, 301, 385, 351, 290, 330, 456, 363, 316, 384]
  }
};

const TOP_10_RISK = [
  { rank: 1, warehouse: "W01 (Pune)", sku: "P04", name: "HydraORS Orange", cat: "Hydration", cover: 5.06, lead: 9.6, ratio: 1.90 },
  { rank: 2, warehouse: "W01 (Pune)", sku: "P14", name: "Rehydrate Drink", cat: "Hydration", cover: 5.24, lead: 9.3, ratio: 1.77 },
  { rank: 3, warehouse: "W01 (Pune)", sku: "P05", name: "Electrolyte Sachet", cat: "Hydration", cover: 5.26, lead: 9.5, ratio: 1.80 },
  { rank: 4, warehouse: "W03 (Nagpur)", sku: "P14", name: "Rehydrate Drink", cat: "Hydration", cover: 5.27, lead: 9.6, ratio: 1.82 },
  { rank: 5, warehouse: "W01 (Pune)", sku: "P03", name: "HydraORS Lemon", cat: "Hydration", cover: 5.34, lead: 9.0, ratio: 1.68 },
  { rank: 6, warehouse: "W03 (Nagpur)", sku: "P03", name: "HydraORS Lemon", cat: "Hydration", cover: 5.37, lead: 9.4, ratio: 1.76 },
  { rank: 7, warehouse: "W01 (Pune)", sku: "P01", name: "FeverRelief 500", cat: "Pain & Fever", cover: 5.38, lead: 9.7, ratio: 1.80 },
  { rank: 8, warehouse: "W03 (Nagpur)", sku: "P04", name: "HydraORS Orange", cat: "Hydration", cover: 5.43, lead: 9.4, ratio: 1.74 },
  { rank: 9, warehouse: "W01 (Pune)", sku: "P02", name: "FeverRelief Plus", cat: "Pain & Fever", cover: 5.45, lead: 9.5, ratio: 1.74 },
  { rank: 10, warehouse: "W03 (Nagpur)", sku: "P05", name: "Electrolyte Sachet", cat: "Hydration", cover: 5.46, lead: 9.6, ratio: 1.75 }
];

const FILL_RATE_MATRIX = [
  { month: '2025-01', w01: 96.4, w02: 96.9, w03: 95.8, w04: 95.6, w05: 94.7, w06: 96.6 },
  { month: '2025-02', w01: 97.0, w02: 97.3, w03: 96.8, w04: 96.3, w05: 97.3, w06: 96.6 },
  { month: '2025-03', w01: 96.0, w02: 97.9, w03: 96.7, w04: 96.9, w05: 96.9, w06: 96.7 },
  { month: '2025-04', w01: 95.4, w02: 96.7, w03: 97.1, w04: 95.8, w05: 96.3, w06: 95.8 },
  { month: '2025-05', w01: 97.7, w02: 96.5, w03: 96.9, w04: 95.9, w05: 95.0, w06: 98.4 },
  { month: '2025-06', w01: 95.8, w02: 97.7, w03: 96.3, w04: 96.7, w05: 97.0, w06: 95.1 },
  { month: '2025-07', w01: 95.6, w02: 96.4, w03: 97.1, w04: 97.0, w05: 96.8, w06: 96.6 },
  { month: '2025-08', w01: 86.3, w02: 95.2, w03: 84.6, w04: 95.8, w05: 96.3, w06: 96.7 },
  { month: '2025-09', w01: 83.3, w02: 95.3, w03: 76.6, w04: 95.9, w05: 96.0, w06: 95.7 },
  { month: '2025-10', w01: 96.2, w02: 96.7, w03: 97.3, w04: 97.1, w05: 97.0, w06: 98.0 },
  { month: '2025-11', w01: 97.1, w02: 96.6, w03: 96.8, w04: 97.8, w05: 97.6, w06: 96.8 },
  { month: '2025-12', w01: 97.2, w02: 97.1, w03: 96.1, w04: 96.4, w05: 96.8, w06: 95.7 },
  { month: '2026-01', w01: 96.7, w02: 95.6, w03: 95.9, w04: 97.0, w05: 97.2, w06: 97.0 },
  { month: '2026-02', w01: 96.5, w02: 97.4, w03: 96.6, w04: 96.2, w05: 96.0, w06: 97.3 },
  { month: '2026-03', w01: 95.5, w02: 95.9, w03: 97.4, w04: 96.8, w05: 97.9, w06: 96.5 },
  { month: '2026-04', w01: 96.6, w02: 96.1, w03: 96.8, w04: 96.0, w05: 97.1, w06: 96.0 },
  { month: '2026-05', w01: 96.4, w02: 97.0, w03: 97.2, w04: 96.3, w05: 96.5, w06: 96.3 },
  { month: '2026-06', w01: 97.8, w02: 97.8, w03: 96.3, w04: 94.8, w05: 96.7, w06: 95.7 },
  { month: '2026-07', w01: 97.2, w02: 96.5, w03: 97.1, w04: 95.6, w05: 96.2, w06: 97.1 },
  { month: '2026-08', w01: 96.3, w02: 96.5, w03: 96.7, w04: 95.9, w05: 95.4, w06: 97.6 }
];

/* ==========================================================================
   4. Interactive Visualizations (Chart.js)
   ========================================================================== */
let demandChartInstance = null;
let backorderChartInstance = null;
let spikeCategoryChartInstance = null;

function initCharts() {
  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
  Chart.defaults.color = '#94a3b8';

  renderDemandChart('All');
  renderBackorderChart();
  renderSpikeCategoryChart();

  // Category filter buttons
  document.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-cat]').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const category = e.target.getAttribute('data-cat');
      renderDemandChart(category);
    });
  });
}

function renderDemandChart(category) {
  const ctx = document.getElementById('demandChart').getContext('2d');
  const data = CATEGORY_MONTHLY_DATA[category] || CATEGORY_MONTHLY_DATA['All'];

  if (demandChartInstance) {
    demandChartInstance.destroy();
  }

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

  demandChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [
        {
          label: `${category} Requested Demand`,
          data: data.req,
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0, 212, 255, 0.12)',
          borderWidth: 2.5,
          tension: 0.35,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 6
        },
        {
          label: `${category} Fulfilled Units`,
          data: data.ful,
          borderColor: '#10b981',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 4],
          tension: 0.35,
          pointRadius: 2,
          pointHoverRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 14, font: { weight: '600' } } },
        tooltip: {
          padding: 12,
          backgroundColor: 'rgba(10, 18, 45, 0.95)',
          borderColor: 'rgba(0, 212, 255, 0.3)',
          borderWidth: 1,
          titleFont: { size: 13, weight: '700' },
          callbacks: {
            afterBody: (context) => {
              const req = context[0].raw;
              const ful = context[1].raw;
              const gap = req - ful;
              const rate = ((ful / req) * 100).toFixed(1);
              return `\nUnfulfilled Gap: ${gap} units (${(100 - rate).toFixed(1)}%)\nFulfilment Rate: ${rate}%`;
            }
          }
        }
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { maxRotation: 45 } },
        y: { grid: { color: gridColor }, beginAtZero: false }
      }
    }
  });
}

function renderBackorderChart() {
  const ctx = document.getElementById('backorderChart').getContext('2d');
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

  // Color bar red if surge month (2025-08 and 2025-09)
  const barColors = MONTHS.map(m => (m === '2025-08' || m === '2025-09') ? '#f43f5e' : 'rgba(0, 212, 255, 0.55)');

  backorderChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: MONTHS,
      datasets: [{
        label: 'Total Backordered Units',
        data: OVERALL_MONTHLY_DEMAND.map(d => d.back),
        backgroundColor: barColors,
        borderRadius: 4,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          padding: 12,
          backgroundColor: 'rgba(10, 18, 45, 0.95)',
          callbacks: {
            label: (ctx) => `Backorder Qty: ${ctx.raw} units`,
            afterLabel: (ctx) => {
              const m = ctx.label;
              if (m === '2025-09') return '🔥 Peak Crisis Month: 412 units (9.92%)';
              if (m === '2025-08') return '⚠️ Surge Initiation: 264 units (7.51%)';
              return 'Normal baseline range (~70-100 units)';
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { maxRotation: 45 } },
        y: { grid: { color: gridColor }, beginAtZero: true }
      }
    }
  });
}

function renderSpikeCategoryChart() {
  const ctx = document.getElementById('categorySpikeChart').getContext('2d');
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

  spikeCategoryChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Hydration', 'Pain & Fever', 'Respiratory', 'Pain Care', 'Wellness', 'Allergy', 'Digestive'],
      datasets: [
        {
          label: 'Normal Baseline (Monthly Avg)',
          data: [740.9, 356.8, 347.5, 372.5, 369.8, 192.3, 197.3],
          backgroundColor: 'rgba(148, 163, 184, 0.5)',
          borderRadius: 4
        },
        {
          label: 'Surge Months Avg (Aug-Sep 2025)',
          data: [1421.5, 613.5, 478.0, 441.0, 432.5, 229.5, 219.0],
          backgroundColor: ['#f43f5e', '#f59e0b', '#00d4ff', '#10b981', '#6366f1', '#a855f7', '#ec4899'],
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            afterBody: (context) => {
              const normal = context[0].raw;
              const surge = context[1].raw;
              const pct = (((surge - normal) / normal) * 100).toFixed(1);
              return `Demand Acceleration: +${pct}% vs Normal Baseline`;
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: gridColor }, beginAtZero: true }
      }
    }
  });
}

function updateChartTheme(theme) {
  const isDark = theme !== 'light';
  const textColor = isDark ? '#94a3b8' : '#475569';
  Chart.defaults.color = textColor;
  if (demandChartInstance) demandChartInstance.update();
  if (backorderChartInstance) backorderChartInstance.update();
  if (spikeCategoryChartInstance) spikeCategoryChartInstance.update();
}

/* ==========================================================================
   5. Warehouse Fill Rate Heatmap Matrix
   ========================================================================== */
function renderFillRateMatrix() {
  const tbody = document.getElementById('matrixBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  FILL_RATE_MATRIX.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 700; font-family: var(--font-mono);">${row.month}</td>
      <td>${formatMatrixCell(row.w01, row.month, 'Pune')}</td>
      <td>${formatMatrixCell(row.w02, row.month, 'Mumbai')}</td>
      <td>${formatMatrixCell(row.w03, row.month, 'Nagpur')}</td>
      <td>${formatMatrixCell(row.w04, row.month, 'Nashik')}</td>
      <td>${formatMatrixCell(row.w05, row.month, 'Ahmedabad')}</td>
      <td>${formatMatrixCell(row.w06, row.month, 'Hyderabad')}</td>
    `;
    tbody.appendChild(tr);
  });
}

function formatMatrixCell(rate, month, city) {
  let styleClass = 'matrix-optimal';
  let badge = '';

  if (rate < 90.0) {
    styleClass = 'matrix-danger';
    badge = ' 🚨';
  } else if (rate < 95.0) {
    styleClass = 'matrix-warning';
  }

  return `<span class="matrix-cell ${styleClass}" title="${city} (${month}): ${rate}% fill rate">${rate.toFixed(1)}%${badge}</span>`;
}

/* ==========================================================================
   6. Top 10 Supply-Risk Table
   ========================================================================== */
function renderRiskTable() {
  const tbody = document.getElementById('riskTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  TOP_10_RISK.forEach(item => {
    const tr = document.createElement('tr');
    const widthPct = Math.min(100, Math.round((item.ratio / 2.0) * 100));

    tr.innerHTML = `
      <td class="numeric" style="font-weight: 800; color: var(--accent-cyan);">#${item.rank}</td>
      <td style="font-weight: 700;">${item.warehouse}</td>
      <td><span class="badge badge-muted">${item.sku}</span> ${item.name}</td>
      <td><span class="badge ${item.cat === 'Hydration' ? 'badge-live' : 'badge-muted'}">${item.cat}</span></td>
      <td class="numeric" style="color: var(--accent-rose); font-weight: 700;">${item.cover.toFixed(2)} d</td>
      <td class="numeric" style="font-weight: 700;">${item.lead.toFixed(1)} d</td>
      <td>
        <div class="risk-ratio-bar">
          <div class="progress-track">
            <div class="progress-fill" style="width: ${widthPct}%;"></div>
          </div>
          <span class="ratio-value">${item.ratio.toFixed(2)}x</span>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* ==========================================================================
   7. Interactive What-If Scenario Simulator
   ========================================================================== */
function initSimulator() {
  const bufferSlider = document.getElementById('simBufferDays');
  const leadSlider = document.getElementById('simLeadDays');
  const hubToggle = document.getElementById('simHubToggle');

  const bufferValDisplay = document.getElementById('simBufferVal');
  const leadValDisplay = document.getElementById('simLeadVal');

  function calculateSimulation() {
    const bufferDays = parseFloat(bufferSlider.value);
    const leadDays = parseFloat(leadSlider.value);
    const hubActive = hubToggle.checked;

    bufferValDisplay.textContent = `${bufferDays} Days`;
    leadValDisplay.textContent = `${leadDays} Days`;

    // Baseline stats during spike: 676 backorders in Aug-Sep 2025
    // Lowest fill rates: Nagpur 76.6%, Pune 83.3%
    const currentRatio = leadDays / bufferDays;
    
    // Improvement factor based on buffer and lead time improvements
    // At buffer 5.2 and lead 9.5, ratio is ~1.83 (heavy backorders)
    // Target ratio <= 0.8 (zero stockout exposure)
    let backorderReductionPct = 0;
    if (bufferDays >= 12 && leadDays <= 6) {
      backorderReductionPct = 88;
    } else if (bufferDays >= 10 || leadDays <= 7) {
      backorderReductionPct = 65;
    } else if (bufferDays >= 8 || leadDays <= 8) {
      backorderReductionPct = 40;
    } else {
      backorderReductionPct = Math.max(0, Math.round((bufferDays - 5.2) * 12 + (9.5 - leadDays) * 8));
    }

    if (hubActive) {
      backorderReductionPct = Math.min(96, backorderReductionPct + 25);
    }

    const preventedBackorders = Math.round(676 * (backorderReductionPct / 100));
    const estimatedSavedRevenue = preventedBackorders * 115; // Average INR billed per unit
    const simulatedFillRate = Math.min(99.4, 80.3 + (backorderReductionPct * 0.19)).toFixed(1);

    document.getElementById('simReductionPct').textContent = `-${backorderReductionPct}%`;
    document.getElementById('simPreventedUnits').textContent = `${preventedBackorders} Units`;
    document.getElementById('simFillRateRecovery').textContent = `${simulatedFillRate}%`;
    document.getElementById('simSavedRevenue').textContent = `₹${estimatedSavedRevenue.toLocaleString('en-IN')}`;
  }

  bufferSlider.addEventListener('input', calculateSimulation);
  leadSlider.addEventListener('input', calculateSimulation);
  hubToggle.addEventListener('change', calculateSimulation);

  calculateSimulation();
}

/* ==========================================================================
   8. Navigation & Print Helpers
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const printBtn = document.getElementById('print-report-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}
