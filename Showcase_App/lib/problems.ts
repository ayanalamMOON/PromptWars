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

// Problems organised by field
export const PROBLEMS_BY_FIELD: Record<Field, string[]> = {
    business: [
        "A small coffee shop owner is losing customers to a large chain next door. Propose a 6-month turnaround strategy covering marketing, product differentiation, and customer loyalty.",
        "Explain the causes and consequences of inflation in simple terms that a high-school student could understand, and suggest 3 ways an average household can protect itself.",
        "A D2C skincare startup has $50K in monthly revenue but is burning $80K. Propose a path to profitability within 6 months without raising another round.",
        "A mid-size manufacturing firm wants to expand into Southeast Asia. Outline a market-entry strategy covering regulatory compliance, supply chain, and local partnerships.",
        "Design a pricing strategy for a SaaS product that serves both individual freelancers ($20/mo budget) and enterprise teams ($5K/mo budget). Justify your tier structure.",
        "A family-owned restaurant chain with 12 locations is considering franchising. Outline the legal, financial, and operational steps they should take before selling the first franchise.",
        "An e-commerce company's cart abandonment rate is 74%. Propose 5 data-driven interventions to reduce it, explaining the rationale behind each.",
        "A venture capital firm wants to evaluate a pre-revenue AI startup. Describe the qualitative and quantitative criteria you would use and present a simple scoring rubric.",
    ],
    computer_science: [
        "Write a function that checks if a string is a valid palindrome, ignoring spaces and punctuation. Then demonstrate it with 3 test cases.",
        "Design a simple REST API for a library book management system. Describe endpoints, methods, and example request/response bodies.",
        "Explain the CAP theorem in distributed systems. Give a real-world example for each of the three trade-off pairs (CP, AP, CA) and discuss when you would choose each.",
        "Design a rate-limiting middleware for a web API that supports both per-user and global limits. Describe the algorithm, data structures, and edge cases.",
        "You are given a stream of 1 billion integers that cannot fit in memory. Describe how to find the median using external sorting or a probabilistic approach. Analyse time and space complexity.",
        "Compare microservices and monolithic architectures. For a healthcare appointment system processing 10K requests/minute, recommend and justify one approach.",
        "Explain how a blockchain achieves consensus without a central authority. Compare Proof-of-Work and Proof-of-Stake, discussing energy use, security, and decentralisation trade-offs.",
        "Design a real-time collaborative text editor (like Google Docs). Describe the conflict-resolution strategy you would use (OT vs. CRDT), and explain how you would handle offline edits.",
    ],
    biotechnology: [
        "Design a public health campaign to reduce antibiotic resistance in a developing country. Cover messaging, target audiences, and distribution channels.",
        "A rural village has no nearby hospital and limited internet. Propose a telemedicine solution that works within these constraints, covering technology, staffing, and funding.",
        "CRISPR-Cas9 gene editing could eliminate sickle-cell disease but raises ethical concerns about germline modification. Present the scientific promise and the ethical boundaries, then propose a regulatory framework.",
        "Design a lab workflow for developing a rapid diagnostic test for a novel respiratory virus. Cover sample collection, assay design, validation steps, and scalability.",
        "A biotech startup wants to produce lab-grown meat at commercial scale. Outline the key technical challenges (cell culture media, scaffolding, bioreactor design) and a 3-year roadmap.",
        "Explain how mRNA vaccine technology works, why it enabled fast COVID-19 vaccine development, and identify two other diseases where mRNA vaccines show promise. Justify your choices.",
        "A research team has identified a soil bacterium that degrades microplastics in lab conditions. Propose a plan to move from lab finding to field-scale bioremediation, including safety and environmental assessments.",
        "Compare traditional selective breeding with modern marker-assisted selection for drought-resistant crops. Discuss timelines, precision, regulatory hurdles, and farmer adoption.",
    ],
    law: [
        "Should AI-generated art be eligible for copyright protection? Present arguments for and against, then state and justify your own position.",
        "A self-driving car must choose between two unavoidable accident outcomes. Discuss the ethical frameworks that could guide its decision and recommend one approach.",
        "A social media platform's algorithm amplifies harmful misinformation. Analyse the platform's legal liability under Section 230 (US) and the Digital Services Act (EU), and propose a balanced regulatory approach.",
        "Draft a plain-language privacy policy for a mobile health app that collects heart-rate and location data. Cover data collection, use, sharing, retention, and user rights under GDPR.",
        "Two co-founders of a startup are splitting up. One contributed the idea and early code; the other raised all the funding. Propose a fair equity-split framework and explain the legal mechanisms to enforce it.",
        "A whistleblower at a pharmaceutical company discovers falsified clinical trial data. Outline the legal protections available to them under US and EU law, and the steps they should take.",
        "An AI hiring tool is shown to have racial bias in its candidate rankings. Discuss employer liability, the legal standards for disparate impact, and remedies under Title VII of the Civil Rights Act.",
        "A multinational corporation is sued in Country A for environmental damage caused by its subsidiary in Country B. Analyse the jurisdictional challenges and explain the doctrine of forum non conveniens.",
    ],
    pharma: [
        "A university wants to improve mental health support for students. Design a program that includes early detection, peer support, and professional counselling.",
        "Explain why ocean currents are slowing down and propose 3 actionable steps governments could take to mitigate the impact on coastal communities.",
        "A pharmaceutical company has a promising cancer drug in Phase II trials, but enrollment is lagging. Propose a strategy to accelerate patient recruitment while maintaining ethical standards.",
        "Compare the pharmacokinetics of oral vs. intravenous drug delivery for a poorly water-soluble compound. Recommend a formulation strategy and justify your choice.",
        "Design a pharmacovigilance plan for a newly approved biologic therapy for rheumatoid arthritis. Cover adverse-event reporting, risk minimisation, and post-marketing surveillance timelines.",
        "A generic drug manufacturer wants to launch a biosimilar of a blockbuster monoclonal antibody. Outline the regulatory pathway (FDA/EMA), the analytical and clinical studies required, and go-to-market timing.",
        "Antimicrobial resistance is rising globally. Propose a 5-year incentive model to encourage pharmaceutical investment in new antibiotics, addressing both pull and push incentives.",
        "A clinical trial for a rare pediatric disease needs to enrol only 40 patients worldwide. Describe the adaptive trial design you would use, the statistical considerations, and how you would coordinate across multiple countries.",
    ],
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
