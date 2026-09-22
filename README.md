# MediFlow Pharma — Supply Chain Diagnostic & Executive Management Report

An interactive, responsive management report website created for the **MediFlow Pharma Supply Chain Resilience & Demand-Supply Diagnostic Project**, powered by data extracted from the Supabase `Mediflow_Pharma` database.

---

## 👥 Author
- **Teesha Chhabria**

*Note: Roll numbers can be customized directly in the website interface and are automatically saved to `localStorage`.*

---

## 🌐 How to Launch & View the Website

You can view the report directly in your browser:

### Option 1: Double-Click or Open in Browser
Open `index.html` directly in any web browser (Chrome, Edge, Firefox, Safari):
```powershell
Start-Process "index.html"
```

### Option 2: Run a Local Dev / Static Server
If you prefer a local server (e.g. Python or Node):
```powershell
# Using Python
python -m http.server 3000

# Or using Node / npx
npx serve .
```
Then navigate to `http://localhost:3000`.

---

## 📑 Core Report Sections

1. **Title Page & Executive Branding Hero**:
   - Complete group roster with author cards and interactive Roll Number inputs.
   - Executive KPI ribbon detailing total volumes, network fulfillment rate (95.82%), total backorders (2,260), and peak crisis numbers.

2. **Demand vs Fulfilment Diagnosis (Section A)**:
   - Interactive Chart.js timeline of monthly requested vs fulfilled units (Jan 2025 &ndash; Aug 2026).
   - Category filter tabs to inspect divergence across Hydration, Pain & Fever, Respiratory, Pain Care, and Wellness.
   - Deep-dive into the August–September 2025 surge (+91.8% in Hydration, +72.0% in Pain & Fever).

3. **Warehouse / Product Supply-Risk Ranking (Section B)**:
   - Dynamic table ranking the top 10 riskiest combinations based on low Days of Cover (5.06–5.46 days) and high Supplier Lead Times (9.0–9.7 days).
   - Visual risk ratio indicators highlighting the dangerous 1.7x–1.9x ratio.
   - Key finding: 100% of top 10 risks are clustered in **Pune (`W01`)** and **Nagpur (`W03`)**.

4. **Backorder, Fill-Rate & Capacity Analysis (Sections C & D)**:
   - Monthly backorder volume bar chart highlighting the August (264) and September (412) crisis spike.
   - Full 120-cell Warehouse Monthly Fill-Rate Matrix Heatmap with red alert indicators on sub-90% performance (Nagpur at 76.6% and Pune at 83.3%).
   - Capacity utilization analysis exposing the Mumbai paradox (18,000 unit capacity running at only 2.4% utilization).

5. **External Public-Health Context (Section E)**:
   - Epidemiological overview of Maharashtra's 2025 late-monsoon rainfall, 368k+ diarrheal cases, and dengue/viral fever surges in Pune & Mumbai.
   - Mandatory governance disclaimer: **"A timing match is NOT proof of cause"** discussing commercial and operational confounders.

6. **Strategic Recommendations & Interactive What-If Simulator (Section F)**:
   - 4 concrete recommendations traced back to exact database metrics:
     1. Safety stock recalibration (5 &rarr; 14 days in Pune & Nagpur).
     2. Mumbai regional overflow hub (leveraging 18,000 monthly capacity).
     3. Expedited supplier SLAs (reducing 9.7 days to 4–6 days).
     4. Automated +30% weekly order run-rate reordering triggers.
   - Interactive simulator widget allowing executives to adjust buffer days and lead times to calculate estimated backorder reduction and fill rate recovery in real-time.

---

## 🎨 Technology Stack
- **Structure**: Semantic HTML5 with accessibility attributes.
- **Styling**: Vanilla CSS3 (Custom Design System, Glassmorphism, CSS Grid, Dark/Light Mode, Print Stylesheet for PDF export).
- **Interactivity**: Vanilla JavaScript (ES6+), Chart.js (CDN).
