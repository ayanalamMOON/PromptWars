// Fields that participants can compete in
export const FIELDS = [
    "business",
    "computer_science",
    "biotechnology",
    "law",
    "pharma",
] as const;

export type Field = (typeof FIELDS)[number];
export type FieldSelection = Field | "mix";

export const FIELD_LABELS: Record<FieldSelection, string> = {
    business: "Business",
    computer_science: "Computer Science",
    biotechnology: "Biotechnology",
    law: "Law",
    pharma: "Pharma",
    mix: "Mix (All Fields)",
};

interface ProblemDef {
    scenario: string;
    statement: string;
}

function formatProblemStatement(def: ProblemDef): string {
    return [
        "Scenario:",
        def.scenario,
        "",
        "Problem Statement:",
        "",
        `"${def.statement}"`
    ].join("\n");
}

// Problems organised by field, now with unique scenarios
const BASE_PROBLEMS_BY_FIELD: Record<Field, ProblemDef[]> = {
    business: [
        {
            scenario: "A regional grocery brand is losing ground to digital delivery services.",
            statement: "A neighborhood grocery chain with 14 stores has seen a 9% drop in repeat customers over two quarters. Build a 180-day recovery plan with: (1) customer-segment strategy, (2) pricing and promotion changes, (3) in-store experience upgrades, and (4) a KPI dashboard with weekly targets."
        },
        {
            scenario: "A direct-to-consumer health brand is bleeding cash due to high marketing costs.",
            statement: "A bootstrapped D2C nutrition brand is at $90K MRR with 58% gross margin but rising CAC and low retention after month 2. Propose a profitability roadmap for the next 2 quarters including channel mix, subscription design, lifecycle marketing, and unit-economics milestones."
        },
        {
            scenario: "A promising B2B software tool has a leaky funnel and struggles to close pilot users.",
            statement: "A SaaS startup sells to freelancers and SMB teams, but 70% of trials never convert. Design a revised go-to-market strategy that includes ICP definition, onboarding redesign, pricing experiments, and a 12-week conversion optimization plan with measurable success metrics."
        },
        {
            scenario: "A successful local restaurant chain wants to scale operations without losing its brand identity.",
            statement: "A family-owned restaurant group (11 outlets) plans to franchise in two cities next year. Create a pre-franchise readiness framework covering operations standardization, brand controls, legal safeguards, franchisee selection criteria, and first-year risk controls."
        },
        {
            scenario: "An online clothing marketplace is missing revenue targets because users drop off before paying.",
            statement: "An e-commerce fashion marketplace has a 76% cart-abandonment rate and high COD returns. Recommend a tactical intervention plan covering checkout UX, trust signals, payment mix, logistics policy, and experiment design; include expected impact ranges for each intervention."
        },
        {
            scenario: "A manufacturing firm is seeking aggressive geographic expansion into Southeast Asia.",
            statement: "A B2B manufacturing company wants to enter Vietnam and Indonesia within 12 months. Provide a market-entry blueprint including demand sizing assumptions, regulatory entry path, partner strategy, working-capital model, and a phased execution timeline."
        },
        {
            scenario: "A popular consumer finance application is under threat from new fee regulations.",
            statement: "A fintech app has 2.3M users but weak monetization and regulatory pressure on fees. Propose a revised business model with compliant revenue streams, tiered offerings, and retention mechanics; include a sensitivity analysis for low/medium/high adoption."
        },
        {
            scenario: "A brick-and-mortar retail bank is experiencing a demographic shift as youth prefer digital challengers.",
            statement: "A retail bank branch network is losing younger customers to digital-first competitors. Design a hybrid transformation strategy balancing branch economics with digital growth; include operating model changes, employee reskilling, and a 1-year rollout scorecard."
        },
        {
            scenario: "A climate-tech venture is aiming for its next funding round but lacks robust commercial data.",
            statement: "A pre-seed climate-tech startup is preparing for investor diligence with limited historical data. Create a practical investment-readiness pack: market narrative, traction proxies, defensibility map, milestone-based use of funds, and a risk mitigation matrix."
        },
        {
            scenario: "A logistics provider's profit margins are evaporating due to unoptimized routes and fuel costs.",
            statement: "A mid-size logistics company faces margin compression from fuel volatility and route inefficiency. Build a turnaround plan combining pricing architecture, fleet optimization, procurement levers, and contract renegotiation tactics; define 90-day and 12-month outcomes."
        },
        {
            scenario: "A B2B software vendor is losing lucrative mid-market accounts at contract renewal time.",
            statement: "A B2B SaaS company serving HR teams has high logo retention but heavy revenue churn at renewal. Design a renewal-defense strategy with account-health scoring, proactive success interventions, packaging redesign, and commercial escalation playbooks."
        },
        {
            scenario: "A hardware brand wants to capture rural markets without inflating its advertising spend.",
            statement: "A consumer electronics brand plans to launch in Tier-2 and Tier-3 cities with a limited ad budget. Build a market-entry campaign combining channel partner incentives, localized messaging, financing offers, and region-wise performance metrics."
        },
        {
            scenario: "A digital marketplace is caught between aggressive user acquisition and preserving cash runway.",
            statement: "A marketplace startup is debating growth vs profitability after a funding slowdown. Propose a decision framework with scenario planning, cost-to-serve analysis, and operating cadence that helps leadership choose a defensible path in 90 days."
        },
        {
            scenario: "A food-delivery giant is facing merchant and customer backlash over declining service quality.",
            statement: "A food-delivery company’s on-time delivery dropped from 89% to 76% after rapid expansion. Recommend an operations recovery plan covering dispatch logic, rider incentives, SLA governance, and city-level control towers with weekly targets."
        },
        {
            scenario: "An educational platform is seeing students abandon their courses midway.",
            statement: "A subscription edtech company has strong top-of-funnel demand but low long-term completion rates. Design a retention architecture involving product nudges, cohort interventions, mentor workflows, and churn prediction triggers."
        },
        {
            scenario: "A textile manufacturing exporter is navigating severe global currency fluctuations and supply chain delays.",
            statement: "An apparel exporter is exposed to currency swings and delayed buyer payments. Build a risk-managed commercial strategy including contract terms, hedging policy basics, receivable controls, and margin protection tactics."
        }
    ],
    computer_science: [
        {
            scenario: "A massive spike in bot traffic is threatening to bring down a core enterprise API.",
            statement: "Design a production-ready rate-limiting layer for an API gateway handling 25K RPS. Support per-IP, per-user, and per-tenant quotas with burst control. Explain data structures, storage choice, failure behavior, and how you would test fairness under traffic spikes."
        },
        {
            scenario: "A legacy travel booking engine is buckling under modern workload demands and needs modernization.",
            statement: "You need to migrate a monolithic booking platform to services without downtime. Propose a phased migration architecture (strangler pattern), data consistency strategy, observability plan, and rollback design for each phase."
        },
        {
            scenario: "A new interactive gaming platform is preparing to host a massive live tournament.",
            statement: "Create an architecture for real-time multiplayer quiz sessions with 100K concurrent users. Cover WebSocket scaling, room state consistency, anti-cheat events, and latency budgets; include how you would perform load testing."
        },
        {
            scenario: "An enterprise wants to launch a secure corporate alternative to public cloud drives.",
            statement: "Design a secure file-sharing backend with expiring links, malware scanning, and audit trails. Provide API endpoints, storage model, access-control strategy, and key security threats with mitigations."
        },
        {
            scenario: "A heavily relied-upon document search engine has become unacceptably slow as data volume exploded.",
            statement: "A search service has p95 latency regressions after index growth from 5M to 50M documents. Propose a performance triage plan including indexing changes, query optimization, cache strategy, and measurable SLO recovery steps."
        },
        {
            scenario: "A critical fintech billing service occasionally charges customers twice during system hiccups.",
            statement: "Implement a fault-tolerant job processing system for invoice generation where duplicate charges are unacceptable. Explain idempotency strategy, retry policy, dead-letter handling, and exactly-once vs at-least-once trade-offs."
        },
        {
            scenario: "A streaming media service wants to recommend content to brand-new users immediately.",
            statement: "Design a recommendation pipeline for an OTT app with cold-start users and strict privacy requirements. Describe feature engineering choices, online/offline serving architecture, evaluation metrics, and safeguards against popularity bias."
        },
        {
            scenario: "A B2B platform is onboarding massive corporate clients that require strict and complex access controls.",
            statement: "A SaaS platform needs tenant-aware RBAC and ABAC for enterprise customers. Propose a policy model, enforcement flow, caching strategy, and migration path from simple role checks without breaking existing permissions."
        },
        {
            scenario: "A security provider must detect malicious intrusions out of billions of daily signals instantly.",
            statement: "You are given a stream of 2 billion events/day and need near real-time anomaly detection within 2 minutes. Design the ingestion and processing architecture, model update cycle, false-positive control, and incident response hooks."
        },
        {
            scenario: "A remote-work software suite needs a robust multiplayer text editor.",
            statement: "Build a collaborative document editor architecture supporting offline edits, conflict resolution, and comment threads. Compare OT vs CRDT for this use case and justify your final choice with operational implications."
        },
        {
            scenario: "A disruptive payment gateway is experiencing database lock contentions during flash sales.",
            statement: "A mobile payments app suffers from intermittent duplicate transaction confirmations during peak traffic. Design a resilient transaction state machine with idempotent APIs, reconciliation jobs, and user-facing consistency guarantees."
        },
        {
            scenario: "A major corporate directory must upgrade its authentication methods to eliminate phishing risks.",
            statement: "Your company must move from username/password auth to passkeys while supporting legacy enterprise SSO. Propose migration architecture, fallback strategy, session security model, and phased rollout metrics."
        },
        {
            scenario: "A modern credit card processor must evaluate transaction legitimacy in milliseconds.",
            statement: "Design an event-driven fraud detection platform for card-not-present transactions with sub-300ms scoring latency. Cover feature store updates, model serving, rule-engine interaction, and human review loops."
        },
        {
            scenario: "A globally distributed app is dealing with localized cache corruption shutting down regions.",
            statement: "A global CDN-backed application faces cache poisoning and stale-config incidents. Build a security-first caching architecture that includes cache-key governance, invalidation controls, and incident containment playbooks."
        },
        {
            scenario: "A top-tier cloud service provider must guarantee minimal downtime even if a whole continent goes offline.",
            statement: "Create a multi-region disaster recovery strategy for a critical SaaS control plane with RPO < 5 minutes and RTO < 30 minutes. Include replication, failover automation, and game-day validation design."
        },
        {
            scenario: "A multinational analytics firm must analyze user behavior without violating strict regional data privacy laws.",
            statement: "A data platform must support privacy-preserving analytics across jurisdictions. Propose an architecture using data minimization, tokenization, and policy-driven access while preserving useful BI outputs."
        }
    ],
    biotechnology: [
        {
            scenario: "A public health board is battling the rise of superbugs caused by over-prescription.",
            statement: "A district health authority wants to reduce antibiotic misuse in community clinics over 12 months. Design an implementation program including prescribing audits, clinician training, public communication, and measurable outcome indicators."
        },
        {
            scenario: "A biotech startup has discovered a gene-editing breakthrough and wants to initiate human trials.",
            statement: "A startup is developing a CRISPR-based therapy for a rare inherited disease. Outline a translational roadmap from preclinical validation to Phase I trial, covering safety assays, off-target monitoring, ethics approvals, and go/no-go criteria."
        },
        {
            scenario: "A global health organization needs to rapidly produce vaccines for a newly discovered respiratory virus.",
            statement: "Design a scalable manufacturing workflow for an mRNA vaccine candidate targeting an emerging viral outbreak. Include raw-material bottlenecks, quality-control checkpoints, cold-chain constraints, and contingency planning for supply disruption."
        },
        {
            scenario: "A rural telemedicine initiative is suffering from severe patient drop-off after the first call.",
            statement: "A rural telehealth program has poor patient follow-up and low trust despite good initial adoption. Propose a redesign that addresses clinical workflow, community health-worker integration, language/cultural barriers, and financing sustainability."
        },
        {
            scenario: "A mobile clinic needs a cheap, highly accurate test kit to deploy during an active epidemic.",
            statement: "You need to build a rapid diagnostic platform for a respiratory pathogen with turnaround under 40 minutes. Compare antigen, PCR, and CRISPR diagnostics, then recommend one approach with validation and deployment plan."
        },
        {
            scenario: "A research team must convince the public and regulators that their bio-engineered microbes are safe for agriculture.",
            statement: "A synthetic biology team engineered microbes to degrade pesticide residues in controlled settings. Propose a responsible pathway to pilot deployment, including biosafety layers, environmental monitoring, regulatory engagement, and public communication."
        },
        {
            scenario: "A food-tech venture wants to launch lab-grown meat products into commercial supermarkets.",
            statement: "A biotech company plans commercial cultured-meat production in 3 years. Create a technical and business roadmap covering media cost reduction, bioreactor scale-up, product safety testing, and consumer adoption strategy."
        },
        {
            scenario: "A farming cooperative needs crops that can survive unprecedented regional droughts.",
            statement: "An agriculture ministry wants climate-resilient crops for drought-prone regions. Compare marker-assisted selection, genomic selection, and gene editing in terms of timeline, cost, regulatory burden, and farmer adoption risks."
        },
        {
            scenario: "A metropolitan sanitation district wants to use sewage sequencing to predict viral outbreaks.",
            statement: "A hospital network is considering wastewater genomic surveillance for early outbreak detection. Design an operational model with sample strategy, sequencing cadence, bioinformatics reporting, and response thresholds."
        },
        {
            scenario: "An investment fund is unsure how to evaluate promising but early-stage health-tech companies.",
            statement: "A biotech accelerator is selecting startups in diagnostics, therapeutics, and bioinformatics. Propose a scoring framework that balances scientific validity, regulatory feasibility, manufacturability, and commercialization readiness."
        },
        {
            scenario: "A national health program tracks a dangerous drop in routine adult vaccination rates.",
            statement: "A national immunization program wants to improve adult booster uptake in urban populations with vaccine hesitancy. Design a behavior-informed intervention plan with segmented messaging, provider incentives, and real-time monitoring indicators."
        },
        {
            scenario: "A diagnostic laboratory wants to introduce artificial intelligence to read oncology biopsy slides.",
            statement: "A medtech company is developing an AI-assisted pathology workflow for cancer screening. Outline validation design, bias testing strategy, clinical workflow integration, and post-deployment safety governance."
        },
        {
            scenario: "A pharmaceutical exploratory team discovers a novel gut-bacteria treatment for chronic digestive issues.",
            statement: "A research lab identified a promising microbiome therapy candidate for inflammatory bowel disease. Build a translational development strategy including biomarker design, manufacturing controls, and early clinical endpoint selection."
        },
        {
            scenario: "A local environmental agency is dealing with toxic ocean blooms wiping out marine life.",
            statement: "A coastal region reports repeated harmful algal blooms affecting fisheries and public health. Propose a biotechnology-enabled monitoring and response system covering sampling cadence, rapid diagnostics, and risk communication."
        },
        {
            scenario: "A medical research university needs a unified genetic database but faces patient-consent obstacles.",
            statement: "A university consortium is creating a biobank for rare genetic disorders across multiple hospitals. Design governance, consent architecture, sample quality management, and equitable data-access policies."
        },
        {
            scenario: "A health NGO operates in areas with frequent power outages and requires robust diagnostic tech.",
            statement: "An NGO is piloting low-cost molecular testing in remote clinics with unstable electricity. Recommend an implementation model covering platform selection, operator training, QA controls, and supply continuity."
        }
    ],
    law: [
        {
            scenario: "A massive social media network is subpoenaed over allegations of swaying public elections.",
            statement: "A global social platform is accused of amplifying election misinformation. Compare legal exposure under US Section 230 and the EU Digital Services Act, then propose a compliance and governance framework that balances speech and safety."
        },
        {
            scenario: "A wearable tech company is expanding into Europe and must completely overhaul its privacy standards.",
            statement: "Draft a plain-language privacy notice and consent flow for a health app collecting heart-rate, sleep, location, and mental-health self-reports. Ensure alignment with GDPR principles and include user-rights handling in practical terms."
        },
        {
            scenario: "An HR tech firm discovers its automated resume screener consistently penalizes minority applicants.",
            statement: "An AI hiring tool shows adverse impact against protected groups. Analyze employer liability under disparate-impact doctrine, required validation obligations, and a defensible remediation plan for continuing hiring operations."
        },
        {
            scenario: "A startup is fracturing as the technical co-founder demands a disproportionate share of the company.",
            statement: "Two startup founders are separating after 18 months: one built product IP, the other secured customers and funding. Propose a legally enforceable split/restructuring model with vesting, IP assignment, and non-compete/non-solicit considerations."
        },
        {
            scenario: "A senior scientist leaks evidence of fraudulent clinical trials at a major drug manufacturer.",
            statement: "A whistleblower in a pharma company reports manipulated trial endpoints and retaliation threats. Outline immediate legal steps, evidentiary safeguards, and comparative protections under US and EU whistleblower regimes."
        },
        {
            scenario: "A global oil conglomerate is sued in its home country for ecological disasters caused overseas.",
            statement: "A multinational is sued domestically for environmental harms caused abroad by a subsidiary. Evaluate jurisdiction, veil-piercing arguments, forum non conveniens, and strategic settlement vs litigation trade-offs."
        },
        {
            scenario: "An AI studio generates award-winning artwork, but traditional artists sue for copyright infringement.",
            statement: "Should AI-generated music and visual art receive copyright protection when humans provide prompts but minimal editing? Present competing legal theories and recommend a policy position with practical implementation criteria."
        },
        {
            scenario: "A local police department's new facial recognition program results in wrongful arrests.",
            statement: "A city deploys facial-recognition-enabled policing cameras. Build a legal risk assessment covering constitutional/privacy rights, procurement safeguards, retention limits, and transparency/accountability requirements."
        },
        {
            scenario: "A cloud storage provider suffers a ransomware attack that leaks sensitive European and Asian data.",
            statement: "A cross-border SaaS provider experiences a data breach affecting EU and Indian users. Propose a legal response timeline including regulator notifications, contractual obligations, user communication, and litigation risk controls."
        },
        {
            scenario: "A ride-hailing app argues its drivers are freelancers, but local courts are preparing to intervene.",
            statement: "A marketplace platform classifies workers as contractors, but regulators challenge the model. Compare legal tests for worker classification across two jurisdictions and design a compliance strategy with operational implications."
        },
        {
            scenario: "A popular text-generation AI is hit with a massive class-action lawsuit for training on copyrighted web data.",
            statement: "A generative-AI startup is training on scraped web content and receives copyright takedown claims. Analyze legal risk, possible defenses, licensing alternatives, and a practical compliance roadmap for product continuity."
        },
        {
            scenario: "A hospital deploys an AI chatbot to diagnose patients, but a misdiagnosis leads to severe injury.",
            statement: "A healthcare provider plans to use LLM-based triage chatbots for first-contact patient guidance. Build a legal and governance framework covering medical liability boundaries, informed consent, record retention, and auditability."
        },
        {
            scenario: "A digital bank's automated loan-approval algorithm is accused of racial redlining.",
            statement: "A digital lending company is accused of discriminatory outcomes from its credit model. Evaluate legal exposure under fair lending principles and propose a remediation plan including model documentation and explainability controls."
        },
        {
            scenario: "A blockbuster video game company is accused of exploiting vulnerable minors through predatory monetization.",
            statement: "A gaming platform is launching loot-box mechanics in multiple countries. Compare consumer-protection and gambling-law concerns, then recommend a harmonized policy and age-gating compliance controls."
        },
        {
            scenario: "A corporation mandates continuous video surveillance and keystroke logging for all remote employees.",
            statement: "A large employer wants to monitor employee productivity with invasive telemetry tools. Assess legal and ethical boundaries, consent validity, proportionality tests, and safer alternatives."
        },
        {
            scenario: "A controversial government contract is awarded to a tech firm amidst widespread corruption rumors.",
            statement: "A public authority awards an AI procurement contract with opaque scoring criteria and conflict-of-interest allegations. Propose an administrative-law response framework including disclosure obligations and judicial review strategy."
        }
    ],
    pharma: [
        {
            scenario: "A promising cancer drug trial is stalling due to highly restrictive patient enrolment criteria.",
            statement: "A Phase II oncology trial has strong efficacy signal but poor enrolment diversity and high screen-failure rates. Propose an ethical recruitment acceleration plan with site strategy, inclusion redesign, patient-support logistics, and retention metrics."
        },
        {
            scenario: "A breakthrough biologic drug is too unpalatable for oral consumption, requiring a shift in delivery strategy.",
            statement: "Compare oral, IV, and subcutaneous delivery for a biologic with poor oral bioavailability. Recommend a development path considering PK/PD profile, patient adherence, manufacturing complexity, and commercial viability."
        },
        {
            scenario: "A newly approved autoimmune drug is showing unexpected side effects in the general population.",
            statement: "Design a pharmacovigilance framework for a newly launched autoimmune biologic across 6 countries. Include signal detection workflow, periodic safety reporting, risk-minimization actions, and governance responsibilities."
        },
        {
            scenario: "A generic drug maker wants to undercut a lucrative patented biologic as its exclusivity expires.",
            statement: "A generic manufacturer plans a biosimilar launch for a monoclonal antibody expiring in 30 months. Outline regulatory and technical pathway: analytical similarity, non-clinical package, clinical bridging, interchangeability strategy, and launch sequencing."
        },
        {
            scenario: "A pharmaceutical firm wants to test a cure for a disease that affects fewer than 100 children worldwide.",
            statement: "A rare-disease pediatric trial can recruit only 50 patients globally. Propose an adaptive trial design, endpoint strategy, and statistical plan that balances scientific power, ethical constraints, and regulatory acceptability."
        },
        {
            scenario: "A massive pharmaceutical conglomerate's pipeline is bloated and returning diminishing profits.",
            statement: "A pharma portfolio review shows rising R&D spend but flat late-stage success rates. Build a portfolio optimization framework using risk-adjusted NPV, probability-of-technical-success assumptions, and decision gates."
        },
        {
            scenario: "Global health authorities are desperate for new antibiotics, but companies see no profit in developing them.",
            statement: "Antimicrobial resistance is increasing while antibiotic pipelines remain weak. Propose a 5-year incentive framework combining pull and push mechanisms, stewardship obligations, and safeguards against overuse."
        },
        {
            scenario: "A revolutionary one-time gene therapy is priced at $2 million, sparking severe backlash from insurers.",
            statement: "A company is preparing market access for a high-cost gene therapy with one-time dosing. Design a payer strategy covering outcomes-based contracts, long-term follow-up evidence, affordability concerns, and access equity."
        },
        {
            scenario: "A pharmaceutical factory must shift operations overseas without compromising sterile conditions.",
            statement: "A global CMC team is transferring production of a sterile injectable to a second manufacturing site. Create a tech-transfer and comparability plan including validation, contamination controls, and release-risk management."
        },
        {
            scenario: "Health regulators are demanding continuous safety monitoring after a drug’s rapid emergency approval.",
            statement: "A pharma launch team expects post-approval real-world evidence demands from regulators and payers. Propose an RWE roadmap with data sources, causal-inference approach, bias controls, and governance for transparent reporting."
        },
        {
            scenario: "A severe heart medicine works perfectly in trials but causes dangerously low blood pressure in some patients.",
            statement: "A cardiovascular drug candidate shows efficacy but dose-limiting adverse events in Phase II. Propose a clinical-development rescue strategy including dose optimization, enrichment criteria, and regulator engagement plan."
        },
        {
            scenario: "A company struggles to conduct long-term clinical trials due to patients missing physical hospital appointments.",
            statement: "A company wants to shorten development timelines using decentralized clinical trials for chronic disease. Design an operational model covering remote monitoring, data integrity, site coordination, and patient-safety escalation."
        },
        {
            scenario: "A multi-million dollar biologic drug batch fails final purity testing due to unknown manufacturing anomalies.",
            statement: "A biologics manufacturer faces repeated batch failures due to process drift. Build a quality-by-design recovery plan with CPP/CQA controls, process monitoring analytics, and CAPA governance."
        },
        {
            scenario: "A government healthcare system refuses to pay for a critically needed oncology drug unless the price is slashed.",
            statement: "An emerging-market payer demands significant price cuts before listing a new oncology therapy. Recommend a market-access negotiation strategy including indication sequencing, managed-entry agreements, and evidence commitments."
        },
        {
            scenario: "A massive global drug trial is compromised because an offshore site failed to properly record data.",
            statement: "A multi-country trial has protocol deviations concentrated in a few high-enrolling sites. Propose a risk-based quality management approach with targeted monitoring, root-cause analysis, and remediation checkpoints."
        },
        {
            scenario: "A mid-sized biotech firm has developed a successful drug but lacks the resources to sell it internationally.",
            statement: "A small pharma company must decide between out-licensing a late-stage asset or self-commercializing in two regions. Provide a decision framework using capital needs, execution risk, expected value, and strategic optionality."
        }
    ]
};

export const PROBLEMS_BY_FIELD: Record<Field, string[]> = {
    business: BASE_PROBLEMS_BY_FIELD.business.map(formatProblemStatement),
    computer_science: BASE_PROBLEMS_BY_FIELD.computer_science.map(formatProblemStatement),
    biotechnology: BASE_PROBLEMS_BY_FIELD.biotechnology.map(formatProblemStatement),
    law: BASE_PROBLEMS_BY_FIELD.law.map(formatProblemStatement),
    pharma: BASE_PROBLEMS_BY_FIELD.pharma.map(formatProblemStatement),
};

// Legacy flat list (all problems combined)
export const SAMPLE_PROBLEMS: string[] = Object.values(PROBLEMS_BY_FIELD).flat();

export function getRandomProblem(field?: FieldSelection): string {
    const pool =
        !field || field === "mix"
            ? SAMPLE_PROBLEMS
            : PROBLEMS_BY_FIELD[field];
    return pool[Math.floor(Math.random() * pool.length)];
}
