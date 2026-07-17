import { Chapter, QuizQuestion } from "./types";

export const chaptersData: Chapter[] = [
  {
    id: 0,
    title: "Introduction to Bias",
    intro: "Bias is an omnipresent force that filters the reality we consume daily. Far from being confined to formal political tracts, bias is woven into social media algorithms, news headlines, and advertising. It is engineered to alter our thoughts, drive our purchases, and manipulate our behaviors. Understanding how to deconstruct and identify bias is the critical first step to regaining cognitive sovereignty.",
    techniques: []
  },
  {
    id: 1,
    title: "Emotion Hooks",
    intro: "This chapter is about triggers, not arguments: language engineered to produce a feeling fast enough that you share or believe before you evaluate.",
    techniques: [
      {
        id: "1.1",
        name: "Outrage Farming",
        technique: "Loading a routine story with words like 'secretly' or 'quietly' to manufacture a sense of betrayal.",
        spun: "Neighborhood Association Quietly Changes Pool Hours Behind Residents' Backs.",
        unspun: "The change was announced at two publicized open meetings and posted on the community board for a month. 'Quietly' and 'behind residents' backs' exist purely to trigger anger, because angry readers share more.",
        headlines: [
          { text: "School District Schedules Standard Inspection of Air Conditioning Units During Summer Break.", isCorrect: true },
          { text: "School Administrators Surreptitiously Postpone Air Quality Testing to Avoid Parent Scrutiny.", isCorrect: false },
          { text: "Underhanded School Board Officials Sneakily Delay Vital Safety Upgrades Behind Parents' Backs.", isCorrect: false }
        ]
      },
      {
        id: "1.2",
        name: "Fear Appeals",
        technique: "Inflating a rare or minor risk with alarming language to override a calm read of the actual odds.",
        spun: "New Playground Equipment Could Be Putting Your Child's Life at Risk.",
        unspun: "The equipment passed every required safety certification. The 'concern' was a single minor scrape reported once in two years — well below average playground injury rates — but the headline implies a widespread hazard.",
        headlines: [
          { text: "Water Authority Adjusts Fluoride Levels to Remain Within Standard EPA Tolerances.", isCorrect: true },
          { text: "Toxic Chemical Adjustments in Local Tap Water Spark Urgent Health Warnings.", isCorrect: false },
          { text: "Fluoride Overhaul by City Officials Could Leave Children Exposed to Undetected Neurotoxins.", isCorrect: false }
        ]
      },
      {
        id: "1.3",
        name: "Confirmation Baiting",
        technique: "Framing a claim to match an audience's existing assumptions so they accept it without checking the evidence behind it.",
        spun: "Poll Confirms Older Employees Struggle to Adapt to New Technology.",
        unspun: "The 'poll' was fifteen self-selected comments from one office's break room, not a study. It's packaged as data because the intended audience already wants to believe the conclusion.",
        headlines: [
          { text: "Real Estate Board Reports Seven Percent Decline in Quarter-One Commercial Lease Applications.", isCorrect: true },
          { text: "Dying Office Culture Proves Remote Working Has Permanently Destroyed Commercial Real Estate.", isCorrect: false },
          { text: "Data Confirms Out-of-Touch Landlords Are Desperately Clinging to Empty Office Buildings.", isCorrect: false }
        ]
      },
      {
        id: "1.4",
        name: "Tribal Polarizing (Us vs. Them)",
        technique: "Framing an ordinary civic disagreement as a moral battle between a virtuous 'us' and a hostile 'them' — a frame that can be aimed in either direction.",
        spun: "Longtime Local Shop Owners Forced to Fight Back Against Hostile Corporate Chain Invasion.",
        unspun: "A resident-led proposal for a bike lane or zoning application gets recast as an 'invasion' or attack on 'tradition' to trigger defensive local pride, skipping past actual traffic or rent impacts.",
        headlines: [
          { text: "City Council Proposes Allocating Three Percent of Municipal Transportation Budget to Cycling Lanes.", isCorrect: true },
          { text: "Out-of-Touch Bicyclist Lobby Pushes Radical Transit Agenda on Struggling Local Driver Community.", isCorrect: false },
          { text: "Defiant Local Drivers Band Together to Defeat Anti-Car Bike Lane Threat.", isCorrect: false }
        ]
      },
      {
        id: "1.5",
        name: "Bandwagon Pressure",
        technique: "Implying near-universal agreement to make an individual reader feel out of step for doubting the claim.",
        spun: "Everyone Agrees the New Recycling Program Is a Disaster.",
        unspun: "An informal poll of 40 self-selected members of one Facebook group actually split about evenly. 'Everyone agrees' invents a consensus that isn't there.",
        headlines: [
          { text: "Regional Transit Authority Implements Electronic Fare Validation Across Three Light-Rail Lines.", isCorrect: true },
          { text: "Furious Commuters Unanimously Reject Broken Light-Rail Ticket Updates.", isCorrect: false },
          { text: "Massive Backlash as Public Outrage Mounts Over New Light-Rail App.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Loaded Language and Tone",
    intro: "Same facts, different verbs — the words chosen to describe an action can turn a memo into a war, or a layoff into a whisper.",
    techniques: [
      {
        id: "2.1",
        name: "Combat Verbs",
        technique: "Swapping neutral verbs for violent ones to simulate conflict where there was a disagreement.",
        spun: "Board Member Destroys Colleague's Budget Proposal in Fiery Exchange.",
        unspun: "A board member pointed out two arithmetic errors during a routine meeting. 'Destroys' and 'fiery' convert a boring correction into a staged fight.",
        headlines: [
          { text: "Acoustical Society Panel Discusses Differing Interpretations of Recent Echo-Chamber Data.", isCorrect: true },
          { text: "Acoustics Experts Tear Apart Rival Noise Pollution Claims in Heated Debate.", isCorrect: false },
          { text: "Lead Researcher Obliterates Critic's Flawed Sound Wave Methodology During Presentation.", isCorrect: false }
        ]
      },
      {
        id: "2.2",
        name: "Euphemism and Softening",
        technique: "Replacing a blunt, accurate term with a mild or technical-sounding one to bury the real impact of an action.",
        spun: "Company Undergoes Workforce Optimization to Improve Efficiency.",
        unspun: "300 employees were laid off with two weeks' notice. 'Workforce optimization' is chosen specifically because it doesn't sound like what happened to the people it happened to.",
        headlines: [
          { text: "Municipal Hospital Closes Outpatient Pediatric Clinic to Offset $4 Million Deficit.", isCorrect: true },
          { text: "Hospital Initiates Healthcare Delivery Integration Protocol to Optimize Local Services.", isCorrect: false },
          { text: "Pediatric Care Streamlined as Administration Deploys Facility Resource Realignment.", isCorrect: false }
        ]
      },
      {
        id: "2.3",
        name: "Insinuation Formatting (The Question Mark Loophole)",
        technique: "Phrasing a baseless accusation as a question so the outlet can plant it without technically asserting anything false.",
        spun: "Is a Popular Bakery Secretly Reusing Expired Ingredients?",
        unspun: "There's no complaint, inspection, or evidence behind the claim. The question format lets the idea take root in readers' minds while the outlet can say it never claimed anything.",
        headlines: [
          { text: "Logistics Provider Conducts Routine Annual Inventory Reconciliation Audit.", isCorrect: true },
          { text: "Is a Major Retail Shipping Provider Covertly Seizing Undocumented Packages?", isCorrect: false },
          { text: "Are Tech Executives Accessing Private Security Cameras Without Consent?", isCorrect: false }
        ]
      },
      {
        id: "2.4",
        name: "Threat / Demand Framing",
        technique: "Describing an ordinary, previously agreed-upon request using hostile verbs to make the requester look unreasonable.",
        spun: "Renters Demand Sweeping Concessions from Landlords Amid Standoff.",
        unspun: "Tenants asked for repairs already promised in their lease and confirmed by the landlord months earlier. 'Demand' and 'standoff' reframe a routine follow-up as a hostile confrontation.",
        headlines: [
          { text: "Postal Union Submits Written Request for Additional Ten-Minute Afternoon Break.", isCorrect: true },
          { text: "Postal Workers Deliver Hostile Ultimatum to Management Over Paid Break Hours.", isCorrect: false },
          { text: "Angered Mail Carriers Issue Threats to Halt Deliveries Over Office Furniture Disputes.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Visual Manipulation",
    intro: "Images get processed by your brain faster than text, and faster than your skepticism. This is often the most powerful, and least questioned, layer of bias.",
    techniques: [
      {
        id: "3.1",
        name: "Selective Cropping",
        technique: "Slicing away the edges of a photo to erase the context that explains what's actually happening.",
        spun: "A widely shared photo shows a delivery driver's van blocking a fire lane while a firefighter gestures angrily toward it.",
        unspun: "The uncropped photo shows the street ahead was blocked by storm debris and a downed power line — the firefighter was directing traffic away from the hazard, not confronting the driver.",
        headlines: [
          { text: "Local Representative Addresses Town Hall of Forty Registered Voters in Gymnasium.", isCorrect: true },
          { text: "Close-Up Photo Depicts Representative Speaking in Front of Empty Bleachers.", isCorrect: false },
          { text: "Narrowly Framed Angle Image Shows Negligible Crowd at Local Town Hall Event.", isCorrect: false }
        ]
      },
      {
        id: "3.2",
        name: "Decontextualized / Recycled Imagery",
        technique: "Pairing a real, unaltered photo from a different time or place with a breaking headline to make it look like current evidence.",
        spun: "A post about a local water-quality complaint features a shocking photo of brown, murky tap water filling a glass.",
        unspun: "The photo is genuine — and six years old, from an unrelated town on another continent. Laundering it into a new story manufactures instant panic.",
        headlines: [
          { text: "County Public Works Schedules Asphalt Crack Sealing on Three Miles of Highway 10.", isCorrect: true },
          { text: "Severe Structural Failures: Old Image of Massive Sinkhole Posted Amid Road Notice.", isCorrect: false },
          { text: "Cracked Highways: Six-Year-Old Seismic Damage Photo Surfaces Online to Illustrate Local Potholes.", isCorrect: false }
        ]
      },
      {
        id: "3.3",
        name: "Juxtaposition Mismatch",
        technique: "Placing a neutral photo of uninvolved people directly beside an alarming headline so readers subconsciously link them to the story.",
        spun: "'Warehouse Cited for Multiple Safety Violations' runs above a photo of employees on a smoke break.",
        unspun: "The violations were electrical wiring issues; the pictured employees had nothing to do with them. The photo was stock filler, but readers now associate those specific faces with the wrongdoing.",
        headlines: [
          { text: "Health Inspector Cites Local Diner for Out-of-Service Refrigeration Condenser Fan.", isCorrect: true },
          { text: "Restaurant Violations: Sanitary Fine Paired with Stock Photo of Chef Slicing Meat Barehanded.", isCorrect: false },
          { text: "Dirty Kitchens: Health Citation Displayed Alongside Photo of Staff Eating Lunch.", isCorrect: false }
        ]
      },
      {
        id: "3.4",
        name: "Manipulated or Synthetic Images",
        technique: "Using digitally altered or AI-generated images as if they were authentic photographic evidence of an event.",
        spun: "A viral image appears to show a candidate's campaign office with its windows smashed and graffiti sprayed across the front.",
        unspun: "Reverse image search and file metadata show the image was AI-generated days before the alleged 'incident' — no such damage ever occurred.",
        headlines: [
          { text: "Municipal Architects Publish Blueprint Schematics for Proposed Civic Center Extension.", isCorrect: true },
          { text: "AI-Generated Concept Art Portrays Science-Fiction Style Glass Citadel Planned for Local Park.", isCorrect: false },
          { text: "Manipulated Renderings Show Cyberpunk High-Rise Fortress Replacing Downtown Library.", isCorrect: false }
        ]
      },
      {
        id: "3.5",
        name: "Misleading Video Editing",
        technique: "Cutting a clip to start midway through an interaction, hiding what provoked it and reversing who looks like the aggressor.",
        spun: "A viral clip shows a customer shouting and throwing a drink at a barista.",
        unspun: "The full security footage shows the barista insulted the customer's child several minutes earlier. The clip's start point was chosen to hide the provocation and make the reaction look unprovoked.",
        headlines: [
          { text: "Company Chief Executive Discusses Global Tariffs and Logistics Constraints in Full Ten-Minute Video.", isCorrect: true },
          { text: "Viral Five-Second Clip Shows Chief Executive Mocking Inflation Concerns.", isCorrect: false },
          { text: "CEO Dismisses Customer Scarcity Fears in Chopped Snippet Shared Online.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Labels and Framing",
    intro: "Different nouns for the identical action, chosen entirely based on who did it.",
    techniques: [
      {
        id: "4.1",
        name: "False Equivalence ('The Clash Illusion')",
        technique: "Using a balanced-sounding verb to imply two mismatched sides fought as equals.",
        spun: "Security Guards and Concertgoers Clash Outside Venue.",
        unspun: "Footage shows trained security staff in tactical gear restraining a handful of unarmed teenagers. 'Clash' implies parity where there was none.",
        headlines: [
          { text: "Grocery Security Officer Detains Shoplifter Following Verbal Confrontation near Checkout.", isCorrect: true },
          { text: "Store Guard and Customer Engaged in High-Stakes Physical Brawl over Groceries.", isCorrect: false },
          { text: "Retailer and Shopper Clash in Violent Scuffle Inside Neighborhood Supermarket.", isCorrect: false }
        ]
      },
      {
        id: "4.2",
        name: "Asymmetric Classification",
        technique: "Applying a heroic label to one actor and a sinister label to another for the exact same physical action.",
        spun: "Foreign Engineers Infiltrate National Grid System While Domestic Technicians Safeguard Infrastructure.",
        unspun: "Both groups performed the same contracted maintenance task in the same server room. 'Infiltrate' versus 'safeguard' assigns roles based purely on which team did it.",
        headlines: [
          { text: "Both Software Developers File Concurrent Copyright Registrations for Code Libraries.", isCorrect: true },
          { text: "Tech Startup Plagiarizes Codebases While Industry Giant Safeguards Proprietary Software.", isCorrect: false },
          { text: "Amateur Developer Copies Algorithms as Reputable Team Defends Creative Innovations.", isCorrect: false }
        ]
      },
      {
        id: "4.3",
        name: "Adjective Preloading",
        technique: "Inserting an opinionated adjective directly before a neutral noun so readers judge it before seeing any facts.",
        spun: "City Council Rejects Radical Bike Lane Proposal.",
        unspun: "The design in question is a standard traffic-calming layout already used in dozens of comparable towns. 'Radical' is doing all the persuading.",
        headlines: [
          { text: "Community Center Raises Yearly Individual Membership Fees by Twelve Dollars.", isCorrect: true },
          { text: "Center Imposes Extortive Price Hikes on Struggling Neighborhood Families.", isCorrect: false },
          { text: "Board Approves Exploitative Membership Pricing Overhauls.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Numbers and Data Tricks",
    intro: "Techniques that stay technically true while making the reader see something false.",
    techniques: [
      {
        id: "5.1",
        name: "Base-Rate Fallacy (Raw Numbers vs. Percentages)",
        technique: "Reporting a raw count instead of a proportion to make a tiny shift look dramatic.",
        spun: "Local Break-Ins Double in Suburban District.",
        unspun: "Break-ins went from 1 to 2 for the year. Mathematically a 'doubling' — but the phrase implies a crime wave instead of statistical noise in a tiny sample.",
        headlines: [
          { text: "Dietary Trial Reports Rash Occurrence Rates Rose from 0.05% to 0.1% Among Participants.", isCorrect: true },
          { text: "New Diet Supplement Trial Triggers Dangerous Doubling of Skin Rashes.", isCorrect: false },
          { text: "Allergic Reactions Double in Unsafe Dietary Supplement Study.", isCorrect: false }
        ]
      },
      {
        id: "5.2",
        name: "Selective Time-Slicing",
        technique: "Choosing a narrow date range that shows a dramatic trend while hiding the broader, ordinary pattern around it.",
        spun: "Downtown Foot Traffic Collapses Over Six-Month Period.",
        unspun: "The window chosen runs from summer festival season into winter — a normal seasonal dip. Compared year-over-year for the same months, traffic is flat.",
        headlines: [
          { text: "Solar Plant Output Varies Month-to-Month in Accordance with Seasonal Cloud Coverage Patterns.", isCorrect: true },
          { text: "Solar Grid Generation Collapses Over Consecutive Winter Months.", isCorrect: false },
          { text: "Solar Failure: Grid Energy Levels Plummet in Deep Winter Slide.", isCorrect: false }
        ]
      },
      {
        id: "5.3",
        name: "Misleading Chart Design",
        technique: "Manipulating a chart's axis range or starting point to visually exaggerate (or hide) a real change, without altering a single number.",
        spun: "A bar chart of a satisfaction score has its vertical axis starting at 80% instead of 0%, making a shift from 82% to 85% look like the bar has doubled in height.",
        unspun: "The real change is a modest three-point increase. Starting the axis near the data range is a purely visual trick.",
        headlines: [
          { text: "Enterprise Software Provider Reports Quarterly Profit Growth of One Percent.", isCorrect: true },
          { text: "Visual Representation of Financial Report Depicts Quarterly Income Doubling.", isCorrect: false },
          { text: "Interactive Profits Chart Depicts Massive Revenue Surge of One Percent.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 6,
    title: "What's Missing",
    intro: "Sometimes the bias isn't in what's said — it's in what's left out or reordered.",
    techniques: [
      {
        id: "6.1",
        name: "Contextual Coupling",
        technique: "Placing two true but unrelated statistics side by side so the reader infers a cause-and-effect link that was never demonstrated.",
        spun: "Gym Membership Sign-Ups Surge as Local Injuries Rise.",
        unspun: "Both facts are real and entirely independent. Putting them in one sentence implies the gym is causing injuries, with zero supporting evidence offered.",
        headlines: [
          { text: "July Weather Reports Record High Temperatures and Elevated Air Conditioning Demand.", isCorrect: true },
          { text: "Sunscreen Sales Linked directly to Sharp Surge in Local Pool Rescue Operations.", isCorrect: false },
          { text: "Sunscreen Purchasing Spikes Coincide with Rise in Water Accidents.", isCorrect: false }
        ]
      },
      {
        id: "6.2",
        name: "Chronological Reversal",
        technique: "Omitting or reordering the timeline so a response looks like an unprovoked attack.",
        spun: "Shop Owner Calls Police as Crowd Gathers Outside Store.",
        unspun: "The shop owner had been shouting threats at passersby for twenty minutes before neighbors gathered to ask him to stop. Reversing the order makes the crowd look like the aggressor.",
        headlines: [
          { text: "Building Inspector Declares Concrete Balconies Structurally Unsound, Ordering Evacuation.", isCorrect: true },
          { text: "Tenants Evacuated from Apartment Complex as Inspector Issues Violation Notice.", isCorrect: false },
          { text: "Angry Renters Face Sudden Evacuation Orders in Tense Municipal Feud.", isCorrect: false }
        ]
      },
      {
        id: "6.3",
        name: "Buried Nuance (The Headline/Footer Disconnect)",
        technique: "Putting an alarming claim in the headline and the actual context in the last paragraph, where most readers never reach.",
        spun: "Study Finds Local Tap Water Contains Trace Industrial Compound.",
        unspun: "Buried at the very end: the trace level is far below the safety threshold. Headline-only readers walk away needlessly alarmed.",
        headlines: [
          { text: "State Laboratory Confirms Agricultural Crop Deliveries Meet Federal Safety Guidelines.", isCorrect: true },
          { text: "Local Crop Shipments Discovered to Contain Trace Levels of Toxic Pesticides.", isCorrect: false },
          { text: "Carcinogen Pesticide Traces Found in Local Apples, Sparking Food Safety Fears.", isCorrect: false }
        ]
      },
      {
        id: "6.4",
        name: "False Balance ('Bothsidesism')",
        technique: "Presenting two positions as equally credible when the actual evidence overwhelmingly supports one of them, in the name of 'fairness.'",
        spun: "Experts Divided on Whether the Bridge Repairs Are Structurally Necessary.",
        unspun: "47 of the 50 licensed engineers who reviewed the bridge agree the repairs are urgent. The 'divided' framing comes from quoting the same three dissenters.",
        headlines: [
          { text: "World Health Council Formally Adopts Standard Pediatric Vaccine Guidelines.", isCorrect: true },
          { text: "Medical Field Divided as Pediatricians Debate Safety of Standard Vaccines.", isCorrect: false },
          { text: "Fierce Debate Rages Among Doctors Over Standard Childhood Vaccines.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 7,
    title: "Tracing the Source",
    intro: "Who's actually talking — and who's paying them to?",
    techniques: [
      {
        id: "7.1",
        name: "Anonymous Authority",
        technique: "Using vague, authoritative-sounding terms like 'experts' or 'officials' to make one opinion sound like a consensus.",
        spun: "Experts Warn New Zoning Rules Will Hurt Small Businesses.",
        unspun: "The 'experts' are two shop owners interviewed outside a hardware store — no economists or urban planners were consulted.",
        headlines: [
          { text: "Two Transit Commuters Formally Express Opposition to Relocating the Fourth Street Bus Stop.", isCorrect: true },
          { text: "Transit Professionals Warn Bus Stop Relocation Threatens Neighborhood Security.", isCorrect: false },
          { text: "Experts Denounce Transit Planners Over Arbitrary Bus Stop Relocations.", isCorrect: false }
        ]
      },
      {
        id: "7.2",
        name: "Hidden Affiliations",
        technique: "Presenting a funded or partisan group as an independent, neutral source.",
        spun: "Independent Research Group Concludes New Emissions Standards Will Cripple Local Manufacturing.",
        unspun: "The 'independent' group is funded entirely by the coalition of manufacturers the new standards would regulate.",
        headlines: [
          { text: "Corporate-Funded Food Industry Panel Concludes Sugar Substitutes are Safe for Daily Consumption.", isCorrect: true },
          { text: "Independent Health Research Coalition Finds Diet Sweeteners Benefit Metabolic Wellness.", isCorrect: false },
          { text: "Unbiased Nutrition Panel Formally Endorses Artificial Sweeteners for Weight Management.", isCorrect: false }
        ]
      },
      {
        id: "7.3",
        name: "Native Advertising",
        technique: "Formatting a paid advertisement to look identical to independent editorial coverage.",
        spun: "Why Families Are Switching to At-Home Meal Kits This Year.",
        unspun: "The piece is a paid placement by a meal-kit company, styled with standard journalistic layout and quotes to disguise its commercial purpose.",
        headlines: [
          { text: "Paid Advertisement: Fitness App Creator Promotes New Virtual Cardio Trainer.", isCorrect: true },
          { text: "Trending: Why Gym-Goers are Swapping Free Weights for Interactive Home Screens.", isCorrect: false },
          { text: "Modern Workouts: How a Digital Training App is Replacing the Local Gym.", isCorrect: false }
        ]
      },
      {
        id: "7.4",
        name: "Citation Laundering",
        technique: "Passing an unverified claim through several outlets until it can be cited as an established fact.",
        spun: "Reports Confirm Beloved Local Diner Is Closing Permanently.",
        unspun: "It began as one anonymous online comment, repeated by a blog, cited by an opinion column, and now 'confirmed' by this headline.",
        headlines: [
          { text: "Anonymous Online Forum Post Speculates on Next-Generation Console Release Dates.", isCorrect: true },
          { text: "Industry Insiders Confirm Next-Gen Gaming Hardware Launching by Winter.", isCorrect: false },
          { text: "Reports Multiply Confirming Imminent Virtual Reality Console Release.", isCorrect: false }
        ]
      },
      {
        id: "7.5",
        name: "Astroturfing",
        technique: "Manufacturing the appearance of organic grassroots support or opposition when it's actually organized by a well-funded outside interest.",
        spun: "Hundreds of Concerned Local Parents Flood City Hall to Oppose New Curriculum.",
        unspun: "Attendance was coordinated by a national advocacy group that bused in supporters from three neighboring counties and supplied pre-printed signs.",
        headlines: [
          { text: "Ride-Sharing Platform Coordinates Structured Driver Rally at Capitol to Protest Regulations.", isCorrect: true },
          { text: "Spontaneous Grassroots Driver Assembly Floods Capital Streets to Reject Wage Mandates.", isCorrect: false },
          { text: "Concerned Local Rideshare Operators Assemble to Defend Flexible Working Freedom.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 8,
    title: "The Grammar Underneath",
    intro: "The subtlest layer: sentence structure that hides who did what, before you've even noticed there's a 'who' missing.",
    techniques: [
      {
        id: "8.1",
        name: "Agent Deletion (Passive Voice)",
        technique: "Removing the subject who performed an action so a deliberate decision reads like a natural event.",
        spun: "Dozens of Homes Flooded During Overnight Water Management Event.",
        unspun: "The passive phrasing hides that a utility company made the specific decision to open dam floodgates without adequate warning. It reads like weather; it was a choice.",
        headlines: [
          { text: "Superintendent Shuts Down High School Orchestra Program to Reduce District Spending.", isCorrect: true },
          { text: "High School Orchestra Program Suspended Amidst Ongoing Cost Readjustments.", isCorrect: false },
          { text: "After-School Music Classes Terminated as Budget Pressures Mount.", isCorrect: false }
        ]
      },
      {
        id: "8.2",
        name: "Nominalization (Turning Actions into Nouns)",
        technique: "Converting an active decision into a static noun phrase so it feels like an unchangeable condition rather than something someone chose to do.",
        spun: "Neighborhood Grapples with Sudden Housing Cost Escalation.",
        unspun: "'Cost escalation' turns the active decision of specific landlords to raise rents into something that sounds like weather rather than a policy someone set.",
        headlines: [
          { text: "Pharmaceutical Board Raises Retail Price of Essential Insulin by Twenty Percent.", isCorrect: true },
          { text: "Diabetic Patients Struggle to Manage Sudden Insulin Cost Inflation.", isCorrect: false },
          { text: "Healthcare Sector Undergoes Insulin Price Appreciation.", isCorrect: false }
        ]
      },
      {
        id: "8.3",
        name: "Exclusivity Pronouns",
        technique: "Inserting words like 'our' or 'us' to make the reader unconsciously adopt one side of a debate as their own identity.",
        spun: "How the New Noise Ordinance Threatens Our Community Traditions.",
        unspun: "'Our' assumes the reader already belongs to the side opposing the ordinance, framing the city council as outsiders before a single detail is presented.",
        headlines: [
          { text: "Library Trustees Approve Plans to Reconfigure Main Hall for Study Cubicles.", isCorrect: true },
          { text: "How the Proposed Library Overhaul Destroys Our Quiet Reading Sanctuary.", isCorrect: false },
          { text: "Board Authorizes Plan Threatening to Gut Our Community Historical Archives.", isCorrect: false }
        ]
      }
    ]
  }
];

export const syllabusOverview = {
  title: "Why Media Literacy?",
  description: "What we consume pushes biased narratives which leads to mass misinformation. In school, we are never taught how to consume media and identify misinformation correctly. This field guide is built to break down the specific techniques writers, editors, and image-makers use to shape how a story feels before you've had a chance to think about what it actually says. Every technique here is a tool: it can be picked up by anyone, aimed at any target, regardless of who's 'right.' Once you can see the mechanism, it stops working on you automatically.",
  fundamentals: [
    {
      title: "Recognize the Emotional Spark",
      text: "If an article makes you instantly furious, terrified, or smugly satisfied, slow down. Bias bypasses intellect to trigger immediate action."
    },
    {
      title: "Verbs and Pronouns Tell All",
      text: "Look at WHO is acting and how they are described. Passive voice hides accountability, while combat verbs invent conflict."
    },
    {
      title: "Context is Currency",
      text: "What lies outside the photo frame? What's buried in the footers? Always ask: what did they leave out?"
    }
  ]
};

export const diagnosticQuestions: QuizQuestion[] = [
  // --- Chapter 1: Emotion Hooks ---
  {
    id: 1,
    chapterId: 1,
    type: "identify-technique",
    scenario: "A local newspaper covers a routine zoning proposal to build a small community garden.",
    spunText: "City Council Quietly Approves Secret Garden Plot Behind Closed Doors.",
    choices: [
      "Outrage Farming",
      "Fear Appeals",
      "Asymmetric Classification",
      "Native Advertising"
    ],
    correctIndex: 0,
    techniqueName: "Outrage Farming",
    explanation: "Using words like 'quietly' and 'behind closed doors' for a routine, publicly scheduled city meeting manufactures a sense of betrayal and anger where none exists."
  },
  {
    id: 2,
    chapterId: 1,
    type: "select-biased-headline",
    scenario: "A health department report mentions that local drinking water contains fluoride levels well within safe, standard EPA guidelines.",
    spunText: "Select the headline that uses Fear Appeals to manufacture public panic:",
    choices: [
      "Water Quality Report Confirms Fluoride Levels Meet All EPA Standards.",
      "Chemical Infiltration: Dangerous Fluoride Levels Discovered in Tap Water.",
      "Local Officials Complete Annual Review of Drinking Water Safety.",
      "Fluoride Levels Remain Stable Following Quarterly Municipal Audit."
    ],
    correctIndex: 1,
    techniqueName: "Fear Appeals",
    explanation: "The option 'Chemical Infiltration...' uses Fear Appeals by calling standard fluoride 'chemical infiltration' and 'dangerous', overriding a calm, factual assessment of the safe, certified levels."
  },

  // --- Chapter 2: Loaded Language and Tone ---
  {
    id: 3,
    chapterId: 2,
    type: "identify-technique",
    scenario: "A corporate press release reports the laying off of 15% of the engineering department.",
    spunText: "The Company undergoes standard organizational synergy alignment and resource allocation refinement.",
    choices: [
      "Combat Verbs",
      "Euphemism and Softening",
      "Astroturfing",
      "Adjective Preloading"
    ],
    correctIndex: 1,
    techniqueName: "Euphemism and Softening",
    explanation: "'Synergy alignment' and 'resource allocation' are chosen to soften the blow and bury the human reality of employees losing their jobs behind sterile, corporate double-speak."
  },
  {
    id: 4,
    chapterId: 2,
    type: "select-biased-headline",
    scenario: "Two lawmakers have a standard, calm policy disagreement during a budget meeting.",
    spunText: "Select the headline that uses Combat Verbs to simulate a physical conflict:",
    choices: [
      "Lawmakers Discuss Differing Perspectives on Next Year's Budget Proposal.",
      "Budget Committee Reviews Alternative Funding Projections.",
      "Lawmaker Destroys Opponent's Budget Plan in Fiery Meeting Exchange.",
      "Representatives Debate Allocation Details for School Funding."
    ],
    correctIndex: 2,
    techniqueName: "Combat Verbs",
    explanation: "The option 'Lawmaker Destroys...' uses Combat Verbs ('Destroys', 'Fiery') to translate a routine, calm policy disagreement into a simulated theatrical fight."
  },

  // --- Chapter 3: Visual Manipulation ---
  {
    id: 5,
    chapterId: 3,
    type: "identify-technique",
    scenario: "A viral video clip shows a customer shouting and throwing a drink at a barista, but omits that the barista insulted the customer's child several minutes earlier.",
    spunText: "Customer Launches Hostile Assault on Barista in Local Coffee Shop.",
    choices: [
      "Selective Cropping",
      "Decontextualized / Recycled Imagery",
      "Misleading Video Editing",
      "Juxtaposition Mismatch"
    ],
    correctIndex: 2,
    techniqueName: "Misleading Video Editing",
    explanation: "The video clip starts midway through the interaction, hiding the provocation to make the customer's reaction look entirely unprovoked."
  },
  {
    id: 6,
    chapterId: 3,
    type: "select-biased-headline",
    scenario: "A municipal council candidate holds a small, standard campaign rally in a high school gymnasium that is partly empty.",
    spunText: "Select the headline that uses Selective Cropping or biased media selection to distort the event:",
    choices: [
      "Candidate Details Five-Point Policy Agenda at High School Gym Assembly.",
      "Close-Up Photo Depicts Candidate Addressing Empty Bleachers.",
      "Campaign Team Holds Scheduled Public Gathering with Local Residents.",
      "Town Hall Concludes with Candidate Answering Questions from the Audience."
    ],
    correctIndex: 1,
    techniqueName: "Selective Cropping",
    explanation: "Using a tightly cropped photo of empty bleachers frames the event as a failure, omitting the crowd of actual attendees sitting in the other sections of the gym."
  },

  // --- Chapter 4: Labels and Framing ---
  {
    id: 7,
    chapterId: 4,
    type: "identify-technique",
    scenario: "A policy announcement describes a standard bike lane proposal using pre-framed opinionated adjectives.",
    spunText: "City Council Rejects Radical Bike Lane Initiative.",
    choices: [
      "Adjective Preloading",
      "Agent Deletion",
      "Citation Laundering",
      "Fear Appeals"
    ],
    correctIndex: 0,
    techniqueName: "Adjective Preloading",
    explanation: "Inserting 'radical' right before a standard bike-lane layout makes readers judge and dismiss the proposal before they have seen any actual traffic data."
  },
  {
    id: 8,
    chapterId: 4,
    type: "select-biased-headline",
    scenario: "A tech startup releases a standard copy of a public database algorithm.",
    spunText: "Select the headline that uses Asymmetric Classification to vilify the action:",
    choices: [
      "Local Startup Launches Database Tool Utilizing Standard Open-Source Library.",
      "Tech Giants Safeguard Proprietary Code While Local Startup Plagiarizes Algorithms.",
      "Engineers Implement Common Computational Techniques in New Update.",
      "Database Architecture Updates Released to Public Domain by Local Firm."
    ],
    correctIndex: 1,
    techniqueName: "Asymmetric Classification",
    explanation: "The option 'Tech Giants Safeguard... Plagiarizes...' applies heroic, defensive terminology to the giant while using criminalized, loaded words for the startup doing the exact same thing."
  },

  // --- Chapter 5: Numbers and Data Tricks ---
  {
    id: 9,
    chapterId: 5,
    type: "identify-technique",
    scenario: "A regional crime statistics report notes that break-ins went from 2 cases to 4 cases in a quiet suburb.",
    spunText: "SUBURBAN CRIME WAVE: Break-Ins Double as Chaos Descends on Quiet District.",
    choices: [
      "Base-Rate Fallacy",
      "Chronological Reversal",
      "Native Advertising",
      "Selective Cropping"
    ],
    correctIndex: 0,
    techniqueName: "Base-Rate Fallacy",
    explanation: "Saying break-ins 'doubled' is mathematically true, but using sensational words like 'crime wave' masks the tiny base-rate (2 to 4) to manufacture panic."
  },
  {
    id: 10,
    chapterId: 5,
    type: "select-biased-headline",
    scenario: "A solar energy grid's monthly electricity output predictably fluctuates downwards during standard winter months.",
    spunText: "Select the headline that uses Selective Time-Slicing to manufacture a sense of systemic collapse:",
    choices: [
      "Solar Grid Production Varies in Compliance with Standard Seasonal Weather Patterns.",
      "Solar Failure: Clean Energy Grid Generation Collapses Over Consecutive Winter Months.",
      "Clean Energy Grid Records Scheduled Maintenance and Seasonal Adjustments.",
      "Annual Report Confirms Stable Renewable Energy Grid Generation Year-Over-Year."
    ],
    correctIndex: 1,
    techniqueName: "Selective Time-Slicing",
    explanation: "The option 'Solar Failure... Collapses...' isolates the winter drop (which is a standard seasonal cycle) to imply a permanent, catastrophic failure of solar technology."
  },

  // --- Chapter 6: What's Missing ---
  {
    id: 11,
    chapterId: 6,
    type: "identify-technique",
    scenario: "A food safety inspector notices trace residue on fruit shipments that are far below any safety hazard threshold.",
    spunText: "Carcinogen Pesticide Traces Discovered on Crop Shipments, Sparking Food Safety Panic.",
    choices: [
      "Buried Nuance (Headline Disconnect)",
      "Native Advertising",
      "Insinuation Formatting",
      "Tribal Polarizing"
    ],
    correctIndex: 0,
    techniqueName: "Buried Nuance (Headline Disconnect)",
    explanation: "The headline alarms readers with 'Carcinogen Pesticide Traces' while burying the crucial fact (that levels are completely safe and negligible) in the fine print at the bottom."
  },
  {
    id: 12,
    chapterId: 6,
    type: "select-biased-headline",
    scenario: "A neighborhood gym opens a new branch, and coincidently, the municipal clinic reports a minor increase in sprained ankles.",
    spunText: "Select the headline that uses Contextual Coupling to invent a causal relationship:",
    choices: [
      "Gym Membership Sign-ups Rise, and Local Clinic Treats Seasonal Sprained Ankles.",
      "New Gym Opens as Local Ankle Injuries Spike.",
      "Neighborhood Wellness Center Launches Additional Class Schedule.",
      "Clinic Reports Minor Fluctuations in Standard Sports Injury Statistics."
    ],
    correctIndex: 1,
    techniqueName: "Contextual Coupling",
    explanation: "Placing 'New Gym Opens' and 'Ankle Injuries Spike' in the same headline leads the reader's brain to assume the gym is causing injuries, even though there is no connection."
  },

  // --- Chapter 7: Tracing the Source ---
  {
    id: 13,
    chapterId: 7,
    type: "identify-technique",
    scenario: "A corporate-funded group representing car manufacturers publishes a study on fuel emissions.",
    spunText: "Independent Research Panel Concludes Fuel Emissions Rules Will Cripple Local Commerce.",
    choices: [
      "Hidden Affiliations",
      "Outrage Farming",
      "Agent Deletion",
      "Euphemism and Softening"
    ],
    correctIndex: 0,
    techniqueName: "Hidden Affiliations",
    explanation: "Calling the study 'independent' when it was funded directly by the auto manufacturers who would be regulated hides their financial interest."
  },
  {
    id: 14,
    chapterId: 7,
    type: "select-biased-headline",
    scenario: "A rideshare corporation organizes and funds a rally of paid drivers at the Capitol to protest wage laws.",
    spunText: "Select the headline that uses Astroturfing to manufacture an organic grassroots movement:",
    choices: [
      "Corporation Coordinates Driver Assembly at Capital to Protest Proposed Regulations.",
      "Spontaneous Grassroots Driver Coalition Floods Capital Streets to Reject Wage Mandates.",
      "Rideshare Contractors Gather for Scheduled Protest of Capital Legislation.",
      "Local Assembly Gathers at Capital Following Corporate Policy Circular."
    ],
    correctIndex: 1,
    techniqueName: "Astroturfing",
    explanation: "The option 'Spontaneous Grassroots...' represents Astroturfing by styling a highly funded corporate-orchestrated lobbying rally as a spontaneous, organic movement of ordinary citizens."
  },

  // --- Chapter 8: The Grammar Underneath ---
  {
    id: 15,
    chapterId: 8,
    type: "identify-technique",
    scenario: "A city official's decision to close a public park early for maintenance resulted in residents being shut out.",
    spunText: "Public Park Closed and Dozens of Families Locked Out in Unexpected Event.",
    choices: [
      "Agent Deletion (Passive Voice)",
      "Bandwagon Pressure",
      "Insinuation Formatting",
      "Misleading Chart Design"
    ],
    correctIndex: 0,
    techniqueName: "Agent Deletion (Passive Voice)",
    explanation: "The passive verb 'closed' hides who made the active decision to close the park early, making a human-made policy decision sound like an act of nature or weather."
  },
  {
    id: 16,
    chapterId: 8,
    type: "select-biased-headline",
    scenario: "A landlord board votes to increase monthly rent prices by ten percent.",
    spunText: "Select the headline that uses Nominalization to hide human agency:",
    choices: [
      "Local Board Approves Ten Percent Increase in Apartment Rental Prices.",
      "Property Owners Vote to Raise Tenant Rents in Latest Meeting.",
      "Neighborhood Grapples with Sudden Rent Inflation and Housing Cost Escalation.",
      "Landlords Enforce Rent Surcharges on Local Resident Families."
    ],
    correctIndex: 2,
    techniqueName: "Nominalization",
    explanation: "The phrase 'Housing Cost Escalation' converts the active, human decision of landlords raising rent into an abstract, passive noun ('escalation') that sounds like an unalterable natural phenomenon."
  }
];
