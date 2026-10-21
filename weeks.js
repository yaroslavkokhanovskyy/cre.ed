/* The 12-week "Become a Commercial Realtor in 90 Days" program: titles, homework and worksheets.
   Homework items come from the end of each episode. Worksheets are the "week N worksheet / template /
   calculator in your member area" that each episode refers to. */
(function () {
  const rep = (n, fn) => Array.from({ length: n }, (_, i) => fn(i + 1)).flat();
  const rows = (n, pre) => ({ rows: n, pre: pre || [] });

  const PHASES = [
    { n: 1, name: 'Foundation', weeks: [1, 4], blurb: 'Why commercial, licensing, your lane, and the numbers that run every deal.' },
    { n: 2, name: 'Building the Business', weeks: [5, 8], blurb: 'Leases, your market database, prospecting owners and your first broker opinion of value.' },
    { n: 3, name: 'Closing Deals', weeks: [9, 12], blurb: 'Underwriting, Canadian financing, offers and due diligence, and your first deal plan.' }
  ];

  const WEEKS = [
    {
      n: 1, phase: 1, title: 'Why Commercial and Why Now?', file: 'ep-01.html',
      blurb: 'Why commercial, why now, and how this 90-day program works.',
      send: 'your one-sentence why and your list of ten owners',
      hw: [
        'Write down why you want to do commercial real estate in one sentence. Keep it somewhere you will see it.',
        'Block three hours a week in your calendar for the next 12 weeks. Treat them like client appointments.',
        'List ten people you know who own any kind of income property: name, type of property, city. Do not call them yet.',
        'Rate yourself from 1 to 10 on financial math, market knowledge, prospecting and negotiation.'
      ],
      sheet: {
        title: 'Week 1 worksheet', sections: [
          { h: 'My why', f: [{ k: 'why', l: 'Why I want to do commercial real estate (one sentence)', t: 'area' }] },
          { h: 'My calendar block', f: [{ k: 'block', l: 'The three hours each week I have blocked (days and times)', t: 'text', ph: 'e.g. Tue 7–9 am, Sat 9–10 am' }] },
          { h: 'Ten people who own income property', table: { k: 'own', cols: [{ k: 'name', l: 'Name' }, { k: 'type', l: 'Type of property' }, { k: 'city', l: 'City' }], ...rows(10) } },
          { h: 'Rate yourself, 1 to 10', note: 'You will compare these numbers to your Week 12 ratings.', f: [
            { k: 'r_math', l: 'Financial math', t: 'num', min: 1, max: 10 }, { k: 'r_market', l: 'Market knowledge', t: 'num', min: 1, max: 10 },
            { k: 'r_prosp', l: 'Prospecting', t: 'num', min: 1, max: 10 }, { k: 'r_nego', l: 'Negotiation', t: 'num', min: 1, max: 10 }] }
        ]
      }
    },
    {
      n: 2, phase: 1, title: 'Licensing Path and Choosing Your Brokerage', file: 'ep-02.html',
      blurb: 'Your licensing path in Ontario and how to choose the right brokerage for commercial.',
      send: 'your LinkedIn headline and your investor bio',
      hw: [
        'Write down your licensing status and the single next step you need to take, with a date beside it.',
        'Ask your brokerage (or the one you are considering) the four questions from this episode and record the answers.',
        'Identify one senior commercial agent you could co-broker with on your first deals.',
        'Update your LinkedIn headline to show your commercial focus.',
        'Draft your 100-word investor bio.'
      ],
      sheet: {
        title: 'Week 2 worksheet', sections: [
          { h: 'Licensing status', f: [{ k: 'status', l: 'Where I am today', t: 'text' }, { k: 'step', l: 'My single next step', t: 'text' }, { k: 'stepdate', l: 'Date I will do it', t: 'date' }] },
          { h: 'Questions for my brokerage', note: 'Use the four questions from the episode.', table: { k: 'bq', cols: [{ k: 'q', l: 'Question' }, { k: 'a', l: 'Their answer' }], ...rows(4) } },
          { h: 'Co-broke partner', f: [{ k: 'senior', l: 'Senior commercial agent I could co-broker with', t: 'text' }] },
          { h: 'LinkedIn headline', f: [{ k: 'headline', l: 'My new headline', t: 'text' }] },
          { h: 'Investor bio (about 100 words)', f: [{ k: 'bio', l: 'My bio', t: 'area', rows: 6 }] }
        ]
      }
    },
    {
      n: 3, phase: 1, title: 'The Six Asset Classes and Picking Your Lane', file: 'ep-03.html',
      blurb: 'The six commercial asset classes, the three filters, and choosing your lane.',
      send: 'your focus statement',
      hw: [
        'Spend two hours touring your target area by car or on foot. Photograph 20 commercial properties.',
        'Put them in a simple spreadsheet with the address, asset class and a few notes on each.',
        'Apply the three filters from this episode and choose your primary lane.',
        'Write your focus statement in one sentence, using your own asset class and geography.',
        'Download one current market report for your lane and read the summary.'
      ],
      sheet: {
        title: 'Week 3 worksheet', sections: [
          { h: 'Property tour log', note: 'Photograph 20 commercial properties. Log them here.', table: { k: 'tour', cols: [{ k: 'addr', l: 'Address' }, { k: 'cls', l: 'Asset class' }, { k: 'notes', l: 'Notes' }], ...rows(20) } },
          { h: 'Score your six lanes', note: 'Score each lane from 1 to 5 on the three filters: what is in your backyard, who you already know, and what you genuinely enjoy learning.', table: { k: 'lanes', cols: [{ k: 'lane', l: 'Lane' }, { k: 'back', l: 'Backyard (1-5)' }, { k: 'know', l: 'Who I know (1-5)' }, { k: 'enjoy', l: 'Enjoy (1-5)' }, { k: 'tot', l: 'Total' }], rows: 6, pre: [{ lane: 'Multi-residential' }, { lane: 'Industrial' }, { lane: 'Retail' }, { lane: 'Office' }, { lane: 'Mixed-use' }, { lane: 'Land' }] } },
          { h: 'My lane', f: [{ k: 'lane', l: 'My primary lane', t: 'text' }, { k: 'focus', l: 'My focus statement (one sentence)', t: 'area', ph: 'I help owners of mixed-use buildings in downtown Oshawa…' }] },
          { h: 'Market report', f: [{ k: 'rep_src', l: 'Report I downloaded (firm and title)', t: 'text' }, { k: 'rep_note', l: 'One thing I learned from the summary', t: 'area' }] }
        ]
      }
    },
    {
      n: 4, phase: 1, title: 'The Numbers That Run Commercial', file: 'ep-04.html',
      blurb: 'NOI, cap rate and value: the three numbers behind every commercial deal.',
      send: 'your three calculations',
      hw: [
        'Open the Week 4 NOI and cap rate calculator in your member area.',
        'Find three listed properties in your lane.',
        'Estimate the NOI on each one and calculate the cap rate at the asking price.',
        'Compare those cap rates to one current market report.',
        'Write one sentence for each property: priced high, priced low, or about right.',
        'Practice explaining "value equals NOI divided by cap rate" out loud in under 60 seconds.'
      ],
      sheet: {
        title: 'Week 4 NOI and cap rate calculator', intro: 'Do this for three listed properties in your lane. The grey figures calculate automatically.',
        sections: rep(3, i => [{
          h: 'Property ' + i, f: [
            { k: 'addr' + i, l: 'Address / listing', t: 'text', w: 'full' },
            { k: 'price' + i, l: 'Asking price', t: 'num', fmt: '$' },
            { k: 'units' + i, l: 'Number of units (or sq ft)', t: 'num' },
            { k: 'rent' + i, l: 'Average monthly rent per unit (or per sq ft)', t: 'num', fmt: '$' },
            { k: 'other' + i, l: 'Other income per year (parking, laundry…)', t: 'num', fmt: '$' },
            { k: 'vac' + i, l: 'Vacancy and bad debt (%)', t: 'num', ph: '3' },
            { k: 'opex' + i, l: 'Operating expenses per year', t: 'num', fmt: '$', ph: 'tax, insurance, utilities, repairs, management, reserve' },
            { k: 'gpr' + i, l: 'Gross potential rent', t: 'calc', expr: 'units' + i + '*rent' + i + '*12', fmt: '$' },
            { k: 'egi' + i, l: 'Effective gross income', t: 'calc', expr: 'gpr' + i + '*(1-vac' + i + '/100)+other' + i, fmt: '$' },
            { k: 'noi' + i, l: 'NOI', t: 'calc', expr: 'egi' + i + '-opex' + i, fmt: '$', strong: true },
            { k: 'cap' + i, l: 'Cap rate at asking price', t: 'calc', expr: 'noi' + i + '/price' + i + '*100', fmt: '%', strong: true },
            { k: 'mkt' + i, l: 'Market cap rate from a current report (%)', t: 'num' },
            { k: 'verd' + i, l: 'Verdict', t: 'sel', opts: ['Priced high', 'Priced low', 'About right'] },
            { k: 'why' + i, l: 'One sentence: why', t: 'area', w: 'full' }
          ]
        }]).flat().concat([{ h: 'Say it out loud', f: [{ k: 'said', l: 'I explained value = NOI ÷ cap rate out loud in under 60 seconds', t: 'check' }] }])
      }
    },
    {
      n: 5, phase: 2, title: 'Leases Decoded', file: 'ep-05.html',
      blurb: 'Read commercial leases and spot the clauses that change value.',
      send: 'your lease abstract',
      hw: [
        'Get at least one real commercial lease (names removed) from your brokerage, a mentor or a landlord you know.',
        'Complete the Week 5 lease abstract in your member area.',
        'Identify the single clause that most affects the value of that property and explain why in two sentences.',
        'Find three current lease listings in your lane and record the net rent and TMI per square foot.',
        'If your lane is multi-residential, look up this year’s rent increase guideline for your province.'
      ],
      sheet: {
        title: 'Week 5 lease abstract', sections: [
          { h: 'The lease', f: [{ k: 'prop', l: 'Property (no names)', t: 'text' }, { k: 'tenant', l: 'Tenant type', t: 'text' }, { k: 'sf', l: 'Area (sq ft)', t: 'num' }] },
          { h: 'Key terms', f: [
            { k: 'term', l: 'Term (start, end, years)', t: 'area' }, { k: 'rent', l: 'Base rent', t: 'area' }, { k: 'esc', l: 'Rent escalations', t: 'area' },
            { k: 'tmi', l: 'TMI (taxes, maintenance, insurance) and how it is charged', t: 'area' }, { k: 'renew', l: 'Renewal options', t: 'area' },
            { k: 'assign', l: 'Assignment and subletting rights', t: 'area' }, { k: 'excl', l: 'Exclusives', t: 'area' },
            { k: 'cotenancy', l: 'Co-tenancy', t: 'area' }, { k: 'demo', l: 'Demolition / redevelopment rights', t: 'area' }] },
          { h: 'The clause that matters most', f: [{ k: 'clause', l: 'Which clause most affects value, and why (two sentences)', t: 'area' }] },
          { h: 'Three current lease listings', table: { k: 'll', cols: [{ k: 'addr', l: 'Address' }, { k: 'net', l: 'Net rent ($/sq ft)' }, { k: 'tmi', l: 'TMI ($/sq ft)' }], ...rows(3) } },
          { h: 'Multi-residential lanes', f: [{ k: 'guide', l: 'This year’s rent increase guideline for my province', t: 'text' }] }
        ]
      }
    },
    {
      n: 6, phase: 2, title: 'Own Your Market', file: 'ep-06.html',
      blurb: 'Define your territory, build your database, and keep it current every week.',
      send: 'your territory map',
      csv: { name: 'week-6-property-database.csv', cols: ['Address','Legal description','Asset class','Size (units or sq ft)','Owner name','How owner holds (personal / numbered company / holding company)','Year bought','Price paid','Zoning','Current tenants','Notes'] },
      hw: [
        'Define your territory and draw it on a map. Aim for 100 to 300 properties in your lane.',
        'Set up your database using the fields from this episode (template in this week’s worksheet).',
        'Load your first 50 properties, including owner names and purchase history.',
        'Bookmark your market data sources and review them every quarter.',
        'Set a recurring one-hour block in your calendar every week for market updates.',
        'Post or email one market observation from your territory.'
      ],
      sheet: {
        title: 'Week 6 territory and database', intro: 'Download the database template (CSV) below and open it in Excel or Google Sheets.', csvButton: true,
        sections: [
          { h: 'My territory', f: [{ k: 'terr', l: 'Territory, as precisely as possible', t: 'area', ph: 'e.g. all mixed-use buildings on King Street and James Street in downtown Hamilton' }, { k: 'count', l: 'Approximate number of properties', t: 'num', ph: '100–300' }] },
          { h: 'Data sources bookmarked', f: [
            { k: 's1', l: 'CMHC Rental Market Report (vacancy and average rents)', t: 'check' }, { k: 's2', l: 'Quarterly reports: CBRE, Colliers, JLL, Cushman & Wakefield', t: 'check' },
            { k: 's3', l: 'Bank of Canada (interest rate decisions)', t: 'check' }, { k: 's4', l: 'Statistics Canada (population and employment)', t: 'check' }, { k: 's5', l: 'Altus Group (investment and cap rate trends)', t: 'check' }] },
          { h: 'Weekly market update block', f: [{ k: 'wk', l: 'My recurring one-hour block (day and time)', t: 'text' }] },
          { h: 'My first market observation', f: [{ k: 'obs', l: 'What I noticed in my territory', t: 'area' }] }
        ]
      }
    },
    {
      n: 7, phase: 2, title: 'Prospecting Owners', file: 'ep-07.html',
      blurb: 'Prospect owners by leading with value, without feeling like a telemarketer.',
      send: 'your three value openers',
      hw: [
        'Write your own three value openers for your lane: a market update, an opinion of value and a financing insight.',
        'Confirm your brokerage’s policies on CASL and the Do Not Call list.',
        'Mail a market update letter to 25 owners from your database (template in this week’s worksheet).',
        'Have 10 real conversations with owners by phone or in person.',
        'Log every touch and every note in your database.',
        'Aim to book at least one follow-up meeting or opinion of value.'
      ],
      sheet: {
        title: 'Week 7 prospecting kit', sections: [
          { h: 'My three value openers', f: [{ k: 'o1', l: 'Market update opener', t: 'area' }, { k: 'o2', l: 'Opinion of value opener', t: 'area' }, { k: 'o3', l: 'Financing insight opener', t: 'area' }] },
          { h: 'My call flow', note: 'A simple flow for a first call: open with value, ask one question, listen, then offer a next step.', f: [{ k: 'cf1', l: 'Opening (who I am and why I am calling)', t: 'area' }, { k: 'cf2', l: 'The one question I ask', t: 'area' }, { k: 'cf3', l: 'How I handle “not interested”', t: 'area' }, { k: 'cf4', l: 'The next step I offer', t: 'area' }] },
          { h: 'Compliance', f: [{ k: 'casl', l: 'I confirmed my brokerage’s CASL (anti-spam) policy', t: 'check' }, { k: 'dnc', l: 'I confirmed my brokerage’s Do Not Call list policy', t: 'check' }] },
          { h: 'Market update letter (edit and send to 25 owners)', note: 'Replace the bracketed parts. Keep it to one page and lead with something useful to the owner.', f: [{ k: 'letter', l: 'Letter', t: 'area', rows: 12, def: 'Dear [Owner name],\n\nI work with owners of [asset class] properties in [territory]. Over the last [period], I have been tracking sales and leasing activity nearby, and I thought you would want to see what I am seeing:\n\n• [One recent sale: address, price, cap rate]\n• [One leasing or vacancy data point]\n• [One financing change that affects what buyers can pay]\n\nIf it would be useful, I would be glad to share a short opinion of value for [property address]. There is no cost and no obligation.\n\nBest regards,\n[Your name]\n[Brokerage]\n[Phone and email]' }] },
          { h: 'Touch log', note: 'Ten real conversations. Log every touch.', table: { k: 'touch', cols: [{ k: 'owner', l: 'Owner / property' }, { k: 'date', l: 'Date' }, { k: 'how', l: 'Phone / in person / letter' }, { k: 'notes', l: 'Notes' }, { k: 'next', l: 'Next step' }], ...rows(10) } },
          { h: 'Follow-up', f: [{ k: 'fu', l: 'The follow-up meeting or opinion of value I booked', t: 'text' }] }
        ]
      }
    },
    {
      n: 8, phase: 2, title: 'Winning Your First Listing', file: 'ep-08.html',
      blurb: 'Build a broker opinion of value and use it to win your first listing.',
      send: 'your BOV draft, before the owner sees it',
      hw: [
        'Open the Week 8 BOV template in your member area.',
        'Choose one property from your database, ideally one owned by someone you spoke with last week.',
        'Complete all six sections of the BOV, including three to six comparable sales.',
        'Write a value-add story in three to five sentences.',
        'Add a clear statement that your BOV is not a formal appraisal.',
        'Book one BOV presentation with an owner, or rehearse it with a colleague.'
      ],
      sheet: {
        title: 'Week 8 broker opinion of value (BOV) template', sections: [
          { h: '1 · Property summary', note: 'One page: address, asset class, size, zoning, year built, key features, good photos.', f: [{ k: 'addr', l: 'Address', t: 'text' }, { k: 'cls', l: 'Asset class', t: 'text' }, { k: 'size', l: 'Size', t: 'text' }, { k: 'zone', l: 'Zoning', t: 'text' }, { k: 'built', l: 'Year built', t: 'text' }, { k: 'feat', l: 'Key features', t: 'area', w: 'full' }] },
          { h: '2 · Rent roll and income analysis', note: 'Every unit or tenant, current rent and lease terms. Compare current rents to market: below, at or above?', table: { k: 'rr', cols: [{ k: 'unit', l: 'Unit / tenant' }, { k: 'rent', l: 'Current rent' }, { k: 'lease', l: 'Lease terms' }, { k: 'mkt', l: 'Market rent' }, { k: 'vs', l: 'Below / at / above' }], ...rows(8) } },
          { h: '3 · Operating statement', note: 'Rebuild the NOI yourself. Add a management fee and a reserve even if the owner does not pay them.', f: [
            { k: 'inc', l: 'Effective gross income', t: 'num', fmt: '$' }, { k: 'exp', l: 'Operating expenses (incl. management fee and reserve)', t: 'num', fmt: '$' },
            { k: 'noi', l: 'NOI', t: 'calc', expr: 'inc-exp', fmt: '$', strong: true }] },
          { h: '4 · Comparable sales', note: 'Three to six recent sales in your territory.', table: { k: 'cmp', cols: [{ k: 'addr', l: 'Address' }, { k: 'price', l: 'Sale price' }, { k: 'per', l: '$ per unit / sq ft' }, { k: 'cap', l: 'Cap rate' }], ...rows(6) } },
          { h: '5 · Valuation range', note: 'NOI divided by a low, middle and high market cap rate from your comparables and current reports.', f: [
            { k: 'cl', l: 'High cap rate (%)', t: 'num' }, { k: 'cm', l: 'Middle cap rate (%)', t: 'num' }, { k: 'ch', l: 'Low cap rate (%)', t: 'num' },
            { k: 'vl', l: 'Low value', t: 'calc', expr: 'noi/cl*100', fmt: '$' }, { k: 'vm', l: 'Middle value', t: 'calc', expr: 'noi/cm*100', fmt: '$', strong: true }, { k: 'vh', l: 'High value', t: 'calc', expr: 'noi/ch*100', fmt: '$' }] },
          { h: '6 · Marketing plan', f: [{ k: 'buyers', l: 'Most likely buyers', t: 'area' }, { k: 'reach', l: 'How I will reach them', t: 'area' }, { k: 'time', l: 'Realistic timeline from listing to closing', t: 'text' }] },
          { h: 'Value-add story (3 to 5 sentences)', f: [{ k: 'story', l: 'The upside a buyer will see', t: 'area', rows: 5 }] },
          { h: 'Required statement', f: [{ k: 'disc', l: 'Disclaimer', t: 'area', def: 'This broker opinion of value is not a formal appraisal. It is an estimate of market value based on the information available at the time and the comparable sales listed above.' }] },
          { h: 'Presentation', f: [{ k: 'pres', l: 'The BOV presentation I booked or rehearsed (who and when)', t: 'text' }] }
        ]
      }
    },
    {
      n: 9, phase: 3, title: 'Underwrite a Deal in 20 Minutes', file: 'ep-09.html',
      blurb: 'The three-step screen: normalize the NOI, test the debt, and decide pass, fail or structure.',
      send: 'any deal you want underwritten',
      hw: [
        'Open the Week 9 underwriting sheet in your member area.',
        'Screen three deals from your market. For each: normalize the NOI, calculate the DSCR at 1.25, and calculate the cash-on-cash return.',
        'Label each deal as a pass, a fail or a structure opportunity.',
        'For one of the deals, list every adjustment you made to the seller’s NOI.',
        'Call one commercial lender or mortgage broker and ask what DSCR and amortization they are using today for your asset class.'
      ],
      sheet: {
        title: 'Week 9 underwriting sheet', intro: 'Screen three deals. Start from the rent roll, not the listing sheet. Grey figures calculate automatically.',
        sections: rep(3, i => [{
          h: 'Deal ' + i, f: [
            { k: 'addr' + i, l: 'Property', t: 'text', w: 'full' },
            { k: 'price' + i, l: 'Price', t: 'num', fmt: '$' },
            { k: 'gpr' + i, l: 'Gross potential rent (rent roll)', t: 'num', fmt: '$' },
            { k: 'oth' + i, l: 'Other income', t: 'num', fmt: '$' },
            { k: 'vac' + i, l: 'Realistic vacancy (%)', t: 'num', ph: '3' },
            { k: 'tax' + i, l: 'Property tax (current bill)', t: 'num', fmt: '$' },
            { k: 'ins' + i, l: 'Insurance (current quote)', t: 'num', fmt: '$' },
            { k: 'util' + i, l: 'Utilities, repairs and other', t: 'num', fmt: '$' },
            { k: 'mgmt' + i, l: 'Management fee (even if self-managed)', t: 'num', fmt: '$' },
            { k: 'res' + i, l: 'Reserve for replacements', t: 'num', fmt: '$' },
            { k: 'noi' + i, l: 'Normalized NOI', t: 'calc', expr: 'gpr' + i + '*(1-vac' + i + '/100)+oth' + i + '-tax' + i + '-ins' + i + '-util' + i + '-mgmt' + i + '-res' + i, fmt: '$', strong: true },
            { k: 'cap' + i, l: 'Cap rate', t: 'calc', expr: 'noi' + i + '/price' + i + '*100', fmt: '%' },
            { k: 'ltv' + i, l: 'Loan-to-value (%)', t: 'num', ph: '60' },
            { k: 'rate' + i, l: 'Interest rate (%)', t: 'num', ph: '5.5' },
            { k: 'am' + i, l: 'Amortization (years)', t: 'num', ph: '25' },
            { k: 'loan' + i, l: 'Loan amount', t: 'calc', expr: 'price' + i + '*ltv' + i + '/100', fmt: '$' },
            { k: 'ds' + i, l: 'Annual mortgage payments', t: 'calc', expr: 'pmt(rate' + i + ',am' + i + ',loan' + i + ')', fmt: '$' },
            { k: 'dscr' + i, l: 'DSCR (NOI ÷ annual payments)', t: 'calc', expr: 'noi' + i + '/ds' + i, fmt: 'x', strong: true },
            { k: 'maxl' + i, l: 'Maximum loan at DSCR 1.25', t: 'calc', expr: 'loan' + i + '*(noi' + i + '/1.25)/ds' + i, fmt: '$' },
            { k: 'gap' + i, l: 'Extra equity needed to close', t: 'calc', expr: 'max(0,loan' + i + '-maxl' + i + ')', fmt: '$' },
            { k: 'coc' + i, l: 'Cash-on-cash return at the max loan (%)', t: 'calc', expr: '(noi' + i + '-pmt(rate' + i + ',am' + i + ',min(loan' + i + ',maxl' + i + ')))/(price' + i + '-min(loan' + i + ',maxl' + i + '))*100', fmt: '%' },
            { k: 'lab' + i, l: 'Label', t: 'sel', opts: ['Pass', 'Fail', 'Structure opportunity'] },
            { k: 'adj' + i, l: 'Adjustments I made to the seller’s NOI', t: 'area', w: 'full' }
          ]
        }]).flat().concat([{ h: 'Lender call', f: [{ k: 'lender', l: 'Lender or broker I called, and the DSCR and amortization they are using today', t: 'area' }] }])
      }
    },
    {
      n: 10, phase: 3, title: 'Financing Canadian Commercial Property', file: 'ep-10.html',
      blurb: 'Banks, CMHC and MLI Select, private debt, and the vendor take-back mortgage.',
      send: 'your structured deal',
      hw: [
        'Take one of the deals from last week that failed because of an equity gap.',
        'Structure a VTB solution for it: amount, interest rate and term (VTB worksheet in this week’s worksheet).',
        'If the property is multi-residential, structure a second solution using CMHC financing. If it is not, try private financing instead.',
        'If your lane is multi-residential, read CMHC’s current overview of MLI Select.',
        'Introduce yourself to one commercial mortgage broker and one credit union lender.',
        'Write a three-sentence explanation of why a seller might agree to a VTB. Practice saying it out loud.'
      ],
      sheet: {
        title: 'Week 10 VTB worksheet', intro: 'Rebuild a deal that failed on an equity gap. Grey figures calculate automatically.',
        sections: [
          { h: 'The deal', f: [{ k: 'deal', l: 'Property', t: 'text', w: 'full' }, { k: 'price', l: 'Price', t: 'num', fmt: '$' }, { k: 'bank', l: 'Bank loan at DSCR 1.25', t: 'num', fmt: '$' }, { k: 'eq0', l: 'Equity the buyer needs without a VTB', t: 'calc', expr: 'price-bank', fmt: '$' }] },
          { h: 'Solution 1: vendor take-back (VTB)', f: [
            { k: 'vtb', l: 'VTB amount (second mortgage from the seller)', t: 'num', fmt: '$' }, { k: 'vrate', l: 'VTB interest rate (%)', t: 'num' }, { k: 'vterm', l: 'VTB term (years)', t: 'num' },
            { k: 'eq1', l: 'Buyer’s cash requirement with the VTB', t: 'calc', expr: 'price-bank-vtb', fmt: '$', strong: true }, { k: 'vint', l: 'Seller’s annual VTB interest', t: 'calc', expr: 'vtb*vrate/100', fmt: '$' }] },
          { h: 'Solution 2: CMHC (multi-residential) or private financing', f: [{ k: 'alt', l: 'How the second structure works: loan amount, amortization, rate, premiums and fees', t: 'area', rows: 5 }] },
          { h: 'Lender introductions', f: [{ k: 'broker', l: 'Commercial mortgage broker I introduced myself to', t: 'text' }, { k: 'cu', l: 'Credit union lender I introduced myself to', t: 'text' }] },
          { h: 'Why would a seller agree?', f: [{ k: 'why3', l: 'My three-sentence answer (practice it out loud)', t: 'area', rows: 4 }] }
        ]
      }
    },
    {
      n: 11, phase: 3, title: 'Offers, Conditions and Due Diligence', file: 'ep-11.html',
      blurb: 'From letter of intent to firm deal: conditions, due diligence and HST.',
      send: 'your LOI, before you send your first commercial offer',
      hw: [
        'Draft a sample LOI for one of the deals you underwrote in Week 9 (template in this week’s worksheet).',
        'Build a due diligence checklist for that deal, with the person responsible and the deadline for each item.',
        'Find a sample estoppel certificate and read it from start to finish.',
        'Write your own standard HST advisory sentence for your clients.',
        'Identify one real estate lawyer and one building inspector you would feel confident referring.'
      ],
      sheet: {
        title: 'Week 11 LOI and due diligence checklist', sections: [
          { h: 'Letter of intent', note: 'Usually non-binding on the main terms. Two to three pages in the final version.', f: [
            { k: 'prop', l: 'Property', t: 'text', w: 'full' }, { k: 'price', l: 'Price', t: 'num', fmt: '$' }, { k: 'dep', l: 'Deposit (amount, when paid, when non-refundable)', t: 'text' },
            { k: 'ddlen', l: 'Due diligence period (days)', t: 'num' }, { k: 'finlen', l: 'Financing condition (days)', t: 'num' }, { k: 'close', l: 'Closing date', t: 'date' },
            { k: 'spec', l: 'Special terms (for example a vendor take-back mortgage)', t: 'area', w: 'full' },
            { k: 'deliv', l: 'Seller’s deliveries: which documents, by what date', t: 'area', w: 'full' }, { k: 'hst', l: 'How HST will be handled', t: 'text', w: 'full' }] },
          { h: 'Due diligence checklist', note: 'A person responsible and a deadline for every item.', table: { k: 'dd', cols: [{ k: 'item', l: 'Item' }, { k: 'who', l: 'Responsible' }, { k: 'due', l: 'Deadline' }, { k: 'done', l: 'Done', t: 'check' }], rows: 12, pre: [
            { item: 'Financials: rent roll, 2–3 years of operating statements' }, { item: 'Current property tax bill' }, { item: 'Utility bills and insurance policy' },
            { item: 'All leases and amendments' }, { item: 'Estoppel certificates from tenants' }, { item: 'Building condition assessment' },
            { item: 'Phase I environmental site assessment' }, { item: 'Title search' }, { item: 'Zoning compliance' }, { item: 'Work orders, building permits, municipal issues' }] } },
          { h: 'My HST advisory sentence', f: [{ k: 'hstline', l: 'Standard line for clients', t: 'area', def: 'Please confirm the HST treatment with your accountant and your lawyer before we firm up this deal.' }] },
          { h: 'My referral partners', f: [{ k: 'lawyer', l: 'Real estate lawyer', t: 'text' }, { k: 'insp', l: 'Building inspector', t: 'text' }] }
        ]
      }
    },
    {
      n: 12, phase: 3, title: 'Your First Deal Plan', file: 'ep-12.html',
      blurb: 'Turn everything into a one-page plan for your next 90 days.',
      send: 'your first deal plan',
      hw: [
        'Complete the one-page first deal plan in your member area. Fill in all four parts.',
        'List your top five pipeline contacts, each with a next action and a date.',
        'Set weekly activity targets you can sustain for the next 90 days.',
        'Fill every seat on your support team.',
        'Share your plan with an accountability partner, or send it to your coach.',
        'Go back to Week 1 and re-rate yourself from 1 to 10 on the four skills. Compare the numbers.'
      ],
      sheet: {
        title: 'My first deal plan', intro: 'One page, four parts. Print it and keep it where you work.',
        sections: [
          { h: 'Part 1 · Pipeline', note: 'The five owners or buyers most likely to do a deal with you in the next 90 days. A real date, not someday.', table: { k: 'pipe', cols: [{ k: 'name', l: 'Owner / buyer' }, { k: 'next', l: 'Very next action' }, { k: 'date', l: 'Date', t: 'date' }], ...rows(5) } },
          { h: 'Part 2 · Weekly activity targets', note: 'Numbers you can hit even in a busy week. Consistency beats intensity.', f: [
            { k: 't1', l: 'Owner touches per week', t: 'num', ph: '25' }, { k: 't2', l: 'Real conversations per week', t: 'num', ph: '5' },
            { k: 't3', l: 'BOVs or underwritings per week', t: 'num', ph: '1' }, { k: 't4', l: 'Hours of market updates per week', t: 'num', ph: '1' }] },
          { h: 'Part 3 · Support team', note: 'Know exactly who you will call before you need them.', f: [
            { k: 'p1', l: 'Brokerage contact', t: 'text' }, { k: 'p2', l: 'Commercial lender', t: 'text' }, { k: 'p3', l: 'Mortgage broker', t: 'text' },
            { k: 'p4', l: 'Real estate lawyer', t: 'text' }, { k: 'p5', l: 'Building inspector', t: 'text' }, { k: 'p6', l: 'Accountant', t: 'text' }] },
          { h: 'Part 4 · First deal target', f: [{ k: 'tgt', l: 'The specific type of deal I am going after first', t: 'sel', opts: ['Small multi-residential building', 'Industrial condo', 'Mixed-use property', 'Commercial lease'] }, { k: 'tgtn', l: 'Details (area, size, who)', t: 'area' }] },
          { h: 'Accountability', f: [{ k: 'acc', l: 'My accountability partner', t: 'text' }] },
          { h: 'Re-rate yourself, 1 to 10', note: 'Compare with your Week 1 ratings.', f: [
            { k: 'r_math', l: 'Financial math', t: 'num', min: 1, max: 10, cmp: 1 }, { k: 'r_market', l: 'Market knowledge', t: 'num', min: 1, max: 10, cmp: 1 },
            { k: 'r_prosp', l: 'Prospecting', t: 'num', min: 1, max: 10, cmp: 1 }, { k: 'r_nego', l: 'Negotiation', t: 'num', min: 1, max: 10, cmp: 1 }] }
        ]
      }
    }
  ];

  const TOOLS = [
 {
  "tool": "90-Day Kickoff",
  "toolDesc": "Your why, weekly time blocks, 10 owner contacts and Day 1 skill scores.",
  "topic": "Getting Started",
  "level": "Beginner",
  "audience": "Everyone"
 },
 {
  "tool": "Licensing and Brokerage",
  "toolDesc": "Licensing status, brokerage interview answers, LinkedIn headline and investor bio.",
  "topic": "Licensing",
  "level": "Beginner",
  "audience": "Agents"
 },
 {
  "tool": "Property Tour Log and Lane Selection",
  "toolDesc": "Log 20 properties, score six lanes and write your focus statement.",
  "topic": "Asset Classes",
  "level": "Beginner",
  "audience": "Everyone"
 },
 {
  "tool": "NOI and Cap Rate Calculator",
  "toolDesc": "Compare three properties side by side and see what changes the value.",
  "topic": "NOI and Valuation",
  "level": "Beginner",
  "audience": "Everyone"
 },
 {
  "tool": "Lease Abstract Builder",
  "toolDesc": "Summarize any lease and spot the clause that moves value.",
  "topic": "Leasing",
  "level": "Beginner",
  "audience": "Everyone"
 },
 {
  "tool": "Territory Database",
  "toolDesc": "Load and track the first properties in your farm area.",
  "topic": "Market Knowledge",
  "level": "Intermediate",
  "audience": "Agents"
 },
 {
  "tool": "Prospecting Toolkit",
  "toolDesc": "Value openers, call flow, owner letters and an outreach tracker.",
  "topic": "Prospecting",
  "level": "Intermediate",
  "audience": "Agents"
 },
 {
  "tool": "Broker Opinion of Value Builder",
  "toolDesc": "Build a BOV with a valuation range and marketing plan.",
  "topic": "Valuation",
  "level": "Intermediate",
  "audience": "Agents"
 },
 {
  "tool": "20-Minute Underwriting Sheet",
  "toolDesc": "Normalize NOI, test the debt and check returns.",
  "topic": "Underwriting",
  "level": "Intermediate",
  "audience": "Investors"
 },
 {
  "tool": "Financing Structure Worksheet",
  "toolDesc": "Fix an equity gap with a vendor take-back mortgage and a second structure.",
  "topic": "Financing",
  "level": "Intermediate",
  "audience": "Investors"
 },
 {
  "tool": "LOI and Due Diligence Checklist",
  "toolDesc": "Draft your letter of intent and track every due diligence item.",
  "topic": "Offers and Due Diligence",
  "level": "Intermediate",
  "audience": "Everyone"
 },
 {
  "tool": "First Deal Plan",
  "toolDesc": "Your pipeline, weekly targets, support team and first deal target on one page.",
  "topic": "Planning",
  "level": "Beginner",
  "audience": "Everyone"
 }
];
  WEEKS.forEach((w, i) => Object.assign(w, TOOLS[i]));

  window.CREED_WEEKS = WEEKS;
  window.CREED_PHASES = PHASES;
})();
