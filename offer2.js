/* Offer 2: "Analyze and Find Your First Commercial Deal in 90 Days"
   8 modules, 30 lessons (about 5 hours), one worksheet per module, and the Deal Analyzer.
   To add a video to a lesson, upload the player/video file to the private "episodes" bucket
   and set  video: 'deal-01.html'  on that lesson (see SETUP.md). */
(function () {
  const W = window.CREED_WEEKS;
  const rows = (n, pre) => ({ rows: n, pre: pre || [] });
  const L = (t, min, d, video) => ({ t, min, d, video: video || '' });

  const MODULES = [
    { n: 1, title: 'Your Investor Plan', blurb: 'Decide what you are buying, why, and how much you can put to work.', lessons: [
      L('Why commercial real estate, and why now', 8, 'How commercial differs from residential: value comes from income, leases run longer and the numbers are public.'),
      L('Set your buy box', 10, 'Write a one-page buy box: budget, target return, asset class, area and how long you plan to hold.'),
      L('Your 90-day roadmap', 9, 'What to do each week, and how to use the worksheets, the Deal Analyzer and your coaching.')] },
    { n: 2, title: 'Asset Classes and Your Lane', blurb: 'The six asset classes and how to choose the one you will master first.', lessons: [
      L('The six asset classes', 12, 'Multi-residential, industrial, retail, office, mixed-use and land: how each makes money and what drives value.'),
      L('Choose your lane with three filters', 10, 'What is in your backyard, who you already know and what you enjoy learning.'),
      L('First-deal sweet spots', 11, 'Small multi-residential, mixed-use and industrial condos: why they suit a first purchase.'),
      L('What to avoid on a first deal', 8, 'Land, specialty properties and heavy repositioning: when to wait.')] },
    { n: 3, title: 'The Numbers: NOI, Cap Rate and Value', blurb: 'The three numbers that run every commercial deal.', lessons: [
      L('Income, vacancy and operating expenses', 11, 'Gross potential rent, vacancy and bad debt, and the expense lines that are always understated.'),
      L('NOI step by step', 10, 'Build net operating income from the rent roll, not from the listing sheet.'),
      L('Cap rate and value', 10, 'Value equals NOI divided by cap rate. How a small change in cap rate moves the price.'),
      L('Other ways to price a building', 8, 'Gross rent multiplier, price per unit and price per square foot: useful checks, never the answer.')] },
    { n: 4, title: 'Leases and Rent Rolls', blurb: 'Read the documents that decide what a building is really worth.', lessons: [
      L('Reading a rent roll', 10, 'Current rent against market, lease expiries and who the tenants really are.'),
      L('The lease clauses that move value', 12, 'Renewal options, assignment, exclusives, co-tenancy and redevelopment rights.'),
      L('TMI, escalations and renewals', 9, 'Taxes, maintenance and insurance, rent steps and what happens at renewal.')] },
    { n: 5, title: 'Underwrite a Deal in 20 Minutes', blurb: 'A three-step screen you can run on any deal, then decide: pass, fail or structure.', lessons: [
      L('Step 1: normalize the NOI', 11, 'Replace the seller’s numbers with real taxes, insurance, a management fee and a reserve.'),
      L('Step 2: test the debt with DSCR', 11, 'Debt service coverage, the lender’s 1.25 test and the maximum loan it supports.'),
      L('Step 3: pass, fail or structure', 9, 'When the deal fails on the bank’s numbers, it may still work with a different structure.'),
      L('Walkthrough: using the Deal Analyzer', 12, 'Screen a real deal from start to finish in the built-in Deal Analyzer.')] },
    { n: 6, title: 'Financing Canadian Commercial Property', blurb: 'Banks, CMHC, private money and the vendor take-back mortgage.', lessons: [
      L('Banks, credit unions and what they look for', 10, 'Loan-to-value, DSCR, amortization and the borrower’s own financial strength.'),
      L('CMHC and MLI Select for multi-residential', 11, 'Higher leverage and longer amortization for qualifying rental buildings.'),
      L('Private financing and when to use it', 8, 'Speed and flexibility at a price. When it makes sense and how to exit it.'),
      L('Vendor take-back mortgages', 11, 'Closing the equity gap by asking the seller to lend part of the price.')] },
    { n: 7, title: 'Finding Your First Deal', blurb: 'Build your market database and reach owners before the market does.', lessons: [
      L('Own your market', 10, 'Define a territory of 100 to 300 properties and keep a simple database current.'),
      L('Finding off-market owners', 11, 'Who owns what, how they hold it and who is likely to sell.'),
      L('Working with brokers and listings', 9, 'How to be the buyer brokers call first, and how to read a listing critically.'),
      L('Making the first call', 10, 'Lead with value, ask one good question and offer a next step.')] },
    { n: 8, title: 'Offers, Due Diligence and Closing', blurb: 'From letter of intent to firm deal, and your plan for the next 90 days.', lessons: [
      L('Valuing before you offer', 11, 'A broker opinion of value and three to six comparable sales.'),
      L('The letter of intent', 10, 'Price, deposit, conditions, due diligence period and closing date on two pages.'),
      L('Conditions and due diligence', 12, 'Financials, leases, estoppels, environmental and title: who does what by when.'),
      L('Closing, HST and your first deal plan', 11, 'The closing mechanics, HST and a one-page plan for your next 90 days.')] }
  ];
  let c = 0; MODULES.forEach(m => m.lessons.forEach((l, i) => { l.n = ++c; l.i = i; }));

  const reuse = (weekIdx, title, extra) => Object.assign({}, W[weekIdx].sheet, { title }, extra || {});

  const sheets = {
    1: { title: 'Module 1 · My investor plan', intro: 'Your buy box on one page. The grey figures calculate automatically.', sections: [
      { h: 'My why', f: [{ k: 'why', l: 'Why I want to own commercial real estate', t: 'area' }] },
      { h: 'My money', f: [
        { k: 'eq', l: 'Equity I can put into a first deal', t: 'num', fmt: '$' }, { k: 'ltv', l: 'Typical loan-to-value (%)', t: 'num', ph: '60' },
        { k: 'maxp', l: 'Largest purchase price my equity supports', t: 'calc', expr: 'eq/(1-ltv/100)', fmt: '$', strong: true },
        { k: 'cc', l: 'Cash I will keep aside for closing costs and reserves', t: 'num', fmt: '$' }] },
      { h: 'My buy box', f: [
        { k: 'cls', l: 'Asset class', t: 'text' }, { k: 'geo', l: 'Area (cities, neighbourhoods)', t: 'text' },
        { k: 'ret', l: 'Target cash-on-cash return (%)', t: 'num' }, { k: 'hold', l: 'How long I plan to hold (years)', t: 'num' },
        { k: 'risk', l: 'Comfort with risk', t: 'sel', opts: ['Low', 'Medium', 'High'] }, { k: 'role', l: 'How hands-on I will be', t: 'sel', opts: ['Passive', 'Some management', 'Fully hands-on'] }] },
      { h: 'My first target', f: [{ k: 'first', l: 'The first deal I am going after, in one sentence', t: 'area' }] }
    ] },
    2: { title: 'Module 2 · Lane selector', intro: 'Score each lane from 1 to 5 on the three filters, then choose.', sections: [
      { h: 'Score your six lanes', table: { k: 'lanes', cols: [{ k: 'lane', l: 'Lane' }, { k: 'back', l: 'Backyard (1-5)' }, { k: 'know', l: 'Who I know (1-5)' }, { k: 'enjoy', l: 'Enjoy (1-5)' }, { k: 'tot', l: 'Total' }], rows: 6, pre: [{ lane: 'Multi-residential' }, { lane: 'Industrial' }, { lane: 'Retail' }, { lane: 'Office' }, { lane: 'Mixed-use' }, { lane: 'Land' }] } },
      { h: 'Ten properties I toured', table: { k: 'tour', cols: [{ k: 'addr', l: 'Address' }, { k: 'cls', l: 'Asset class' }, { k: 'notes', l: 'Notes' }], ...rows(10) } },
      { h: 'My lane', f: [{ k: 'lane', l: 'My primary lane', t: 'text' }, { k: 'focus', l: 'Why this lane, in one sentence', t: 'area' }] }
    ] },
    3: reuse(3, 'Module 3 · NOI and cap rate calculator'),
    4: reuse(4, 'Module 4 · Lease abstract'),
    5: reuse(8, 'Module 5 · 20-minute underwriting sheet'),
    6: reuse(9, 'Module 6 · Financing structure worksheet'),
    7: { title: 'Module 7 · Owner outreach plan', intro: 'Your territory, your first fifteen owners and your opening line.', sections: [
      { h: 'My territory', f: [{ k: 'terr', l: 'Territory, as precisely as possible', t: 'area' }, { k: 'count', l: 'Approximate number of properties', t: 'num' }] },
      { h: 'First fifteen owners', table: { k: 'own', cols: [{ k: 'prop', l: 'Property' }, { k: 'owner', l: 'Owner / how held' }, { k: 'why', l: 'Why they might sell' }, { k: 'touch', l: 'First touch (date)' }], ...rows(15) } },
      { h: 'My opening line', f: [{ k: 'open', l: 'The first thirty seconds of my call', t: 'area', rows: 4 }, { k: 'q', l: 'The one question I ask', t: 'text' }] }
    ] },
    8: reuse(10, 'Module 8 · LOI and due diligence checklist')
  };

  /* ---------- Deal Analyzer: five deals, each autosaved ---------- */
  const deal = i => ({
    h: 'Deal analysis', f: [
      { k: 'name', l: 'Property / nickname', t: 'text', w: 'full' },
      { k: 'units', l: 'Units (or square feet)', t: 'num' },
      { k: 'price', l: 'Purchase price', t: 'num', fmt: '$' },
      { k: 'gpr', l: 'Gross potential rent per year (from the rent roll)', t: 'num', fmt: '$' },
      { k: 'oth', l: 'Other income per year', t: 'num', fmt: '$' },
      { k: 'vac', l: 'Vacancy and bad debt (%)', t: 'num', ph: '3' },
      { k: 'tax', l: 'Property tax', t: 'num', fmt: '$' }, { k: 'ins', l: 'Insurance', t: 'num', fmt: '$' },
      { k: 'util', l: 'Utilities', t: 'num', fmt: '$' }, { k: 'rep', l: 'Repairs and maintenance', t: 'num', fmt: '$' },
      { k: 'mgmt', l: 'Management fee (even if self-managed)', t: 'num', fmt: '$' }, { k: 'res', l: 'Reserve for replacements', t: 'num', fmt: '$' },
      { k: 'oex', l: 'Other expenses', t: 'num', fmt: '$' },
      { k: 'egi', l: 'Effective gross income', t: 'calc', expr: 'gpr*(1-vac/100)+oth', fmt: '$' },
      { k: 'opex', l: 'Operating expenses', t: 'calc', expr: 'tax+ins+util+rep+mgmt+res+oex', fmt: '$' },
      { k: 'noi', l: 'Normalized NOI', t: 'calc', expr: 'egi-opex', fmt: '$', strong: true },
      { k: 'cap', l: 'Cap rate at this price', t: 'calc', expr: 'noi/price*100', fmt: '%', strong: true },
      { k: 'ppu', l: 'Price per unit (or per sq ft)', t: 'calc', expr: 'price/units', fmt: '$' },
      { k: 'grm', l: 'Gross rent multiplier', t: 'calc', expr: 'price/gpr', fmt: 'x' },
      { k: 'ltv', l: 'Loan-to-value (%)', t: 'num', ph: '60' }, { k: 'rate', l: 'Interest rate (%)', t: 'num', ph: '5.5' },
      { k: 'am', l: 'Amortization (years)', t: 'num', ph: '25' }, { k: 'tdscr', l: 'Lender’s DSCR requirement', t: 'num', ph: '1.25' },
      { k: 'loan', l: 'Loan amount', t: 'calc', expr: 'price*ltv/100', fmt: '$' },
      { k: 'ds', l: 'Annual mortgage payments', t: 'calc', expr: 'pmt(rate,am,loan)', fmt: '$' },
      { k: 'dscr', l: 'DSCR', t: 'calc', expr: 'noi/ds', fmt: 'x', strong: true },
      { k: 'maxl', l: 'Maximum loan at the lender’s DSCR', t: 'calc', expr: 'loan*(noi/tdscr)/ds', fmt: '$' },
      { k: 'gap', l: 'Equity gap (extra cash needed to close)', t: 'calc', expr: 'max(0,loan-maxl)', fmt: '$' },
      { k: 'cl', l: 'Closing costs and reserves', t: 'num', fmt: '$' },
      { k: 'cash', l: 'Total cash required with the bank loan', t: 'calc', expr: 'price-min(loan,maxl)+cl', fmt: '$', strong: true },
      { k: 'cf', l: 'Annual cash flow before tax', t: 'calc', expr: 'noi-pmt(rate,am,min(loan,maxl))', fmt: '$' },
      { k: 'coc', l: 'Cash-on-cash return', t: 'calc', expr: 'cf/(price-min(loan,maxl)+cl)*100', fmt: '%', strong: true }
    ]
  }), vtb = {
    h: 'Structure it: vendor take-back (VTB)', note: 'If the deal fails on the bank’s numbers, test a VTB from the seller.', f: [
      { k: 'vtb', l: 'VTB amount', t: 'num', fmt: '$' }, { k: 'vrate', l: 'VTB interest rate (%)', t: 'num' },
      { k: 'vcash', l: 'Cash required with the VTB', t: 'calc', expr: 'price-min(loan,maxl)-vtb+cl', fmt: '$', strong: true },
      { k: 'vint', l: 'Annual VTB interest (interest only)', t: 'calc', expr: 'vtb*vrate/100', fmt: '$' },
      { k: 'vcf', l: 'Annual cash flow after the VTB', t: 'calc', expr: 'noi-pmt(rate,am,min(loan,maxl))-vtb*vrate/100', fmt: '$' },
      { k: 'vcoc', l: 'Cash-on-cash with the VTB', t: 'calc', expr: '(noi-pmt(rate,am,min(loan,maxl))-vtb*vrate/100)/(price-min(loan,maxl)-vtb+cl)*100', fmt: '%', strong: true }]
  }, verdict = {
    h: 'Decision', f: [{ k: 'lab', l: 'Label', t: 'sel', opts: ['Pass', 'Fail', 'Structure opportunity'] }, { k: 'adj', l: 'Adjustments I made to the seller’s NOI, and why', t: 'area' }, { k: 'next', l: 'My next step on this deal', t: 'area' }]
  };
  const analyzer = n => ({ title: 'Deal Analyzer · Deal ' + 'ABCDE'[n - 1], intro: 'Enter what you know. Start from the rent roll and your own expense numbers. Grey figures calculate automatically and everything saves as you type.', sections: [deal(n), vtb, verdict] });

  window.CREED_O2 = {
    MODULES, sheets, analyzer, DEALS: 5,
    sheetKey: m => 100 + m, dealKey: n => 200 + n,
    lessonKey: m => 100 + m,
    totalLessons: c, totalMinutes: MODULES.reduce((a, m) => a + m.lessons.reduce((b, l) => b + l.min, 0), 0)
  };
})();
