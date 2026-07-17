import { QuizQuestion } from "./types";

export const chapterQuizzesData: Record<number, QuizQuestion[]> = {
  1: [
    {
      id: 101,
      scenario: "A local city zoning committee changes a neighborhood park's parking permit registration process.",
      spunText: "City Council Quietly Overhauls Parking Rules in Underhanded Late-Night Move Behind Residents' Backs.",
      choices: ["Outrage Farming", "Fear Appeals", "Confirmation Baiting", "Tribal Polarizing (Us vs. Them)", "Bandwagon Pressure"],
      correctIndex: 0,
      techniqueName: "Outrage Farming",
      explanation: "The headline loaded a routine process with words like 'quietly', 'underhanded', and 'behind residents' backs' to manufacture rage and betrayal."
    },
    {
      id: 102,
      scenario: "The Water Department adjusts water mineral content to meet standard federal guidelines.",
      spunText: "Find the headline that uses Fear Appeals:",
      choices: [
        "Water Department schedules routine mineral level check for Tuesday.",
        "Mysterious Chemical Adjustments in Local Drinking Water Spark Emergency Safety Alarm.",
        "Data Confirms Lazy Municipal Workers Are Neglecting Local Water Standards.",
        "Everyone Agrees the Local Water System is Completely Broken."
      ],
      correctIndex: 1,
      techniqueName: "Fear Appeals",
      explanation: "This headline exaggerates mineral level adjustments as 'mysterious chemical adjustments' and 'emergency safety alarm' to override logical thinking with terror."
    },
    {
      id: 103,
      scenario: "A community center adds an online booking option for tennis courts, and some older members post criticism on a private group.",
      spunText: "Massive Backlash: Furious Commuters and Players Unanimously Revolt Against Broken Reservation App.",
      choices: ["Outrage Farming", "Fear Appeals", "Confirmation Baiting", "Tribal Polarizing (Us vs. Them)", "Bandwagon Pressure"],
      correctIndex: 4,
      techniqueName: "Bandwagon Pressure",
      explanation: "Using 'Massive Backlash', 'Furious', and 'Unanimously Revolt' overestimates the reaction of a few members to create pressure that everyone is outraged."
    }
  ],
  2: [
    {
      id: 201,
      scenario: "A developer of a video game delays the launch by two weeks to resolve minor bugs.",
      spunText: "Disappointed Gamers Deliver Savage Ultimatum as Studio Officials Hostilely Delay Franchise Sequel.",
      choices: ["Combat Verbs", "Euphemism and Softening", "Insinuation Formatting (The Question Mark Loophole)", "Threat / Demand Framing"],
      correctIndex: 3,
      techniqueName: "Threat / Demand Framing",
      explanation: "The words 'Ultimatum' and 'Hostilely Delay' describe a simple bug delay and fan disappointment as a hostile standoff or threat."
    },
    {
      id: 202,
      scenario: "An airline company cancels 50 flights due to a technical outage, leaving travelers stranded.",
      spunText: "Find the headline that uses Euphemism and Softening:",
      choices: [
        "Airline Cancels Fifty Flights Following Sudden Software System Interruption.",
        "Airline Initiates Tactical Fleet Repositioning and Resource Realignment Protocol.",
        "Angry Travelers Clash with Airline Representatives over Cancelled Flight Fiasco.",
        "Is Your Local Airline Intentionally Stranding Families for Profit?"
      ],
      correctIndex: 1,
      techniqueName: "Euphemism and Softening",
      explanation: "'Tactical fleet repositioning' and 'resource realignment protocol' are used as euphemisms to soften and bury the harsh truth that 50 flights were cancelled."
    },
    {
      id: 203,
      scenario: "An internet service provider performs standard network maintenance.",
      spunText: "Is Your Internet Provider Secretly Logging Your Private Activity During Upgrades?",
      choices: ["Combat Verbs", "Euphemism and Softening", "Insinuation Formatting (The Question Mark Loophole)", "Threat / Demand Framing"],
      correctIndex: 2,
      techniqueName: "Insinuation Formatting (The Question Mark Loophole)",
      explanation: "By framing an unverified claim as a question, the author plants suspicion of spying without needing any facts or proof."
    }
  ],
  3: [
    {
      id: 301,
      scenario: "A newspaper reports on a local assembly where the main speaker had a normal water bottle. They print a highly edited digital version of the photo.",
      spunText: "Altered Photographic Rendering Depicts Campaign Representative Holding Flask of Alcohol.",
      choices: ["Selective Cropping", "Decontextualized / Recycled Imagery", "Juxtaposition Mismatch", "Manipulated or Synthetic Images", "Misleading Video Editing"],
      correctIndex: 3,
      techniqueName: "Manipulated or Synthetic Images",
      explanation: "Using digitally modified or synthetic details to misrepresent a real photo is a classic example of Manipulated or Synthetic Images."
    },
    {
      id: 302,
      scenario: "A local politician was interrupted by a single protester, but calm discussion resumed immediately.",
      spunText: "Find the headline using Misleading Video Editing:",
      choices: [
        "Politician answers local community concerns about school funding in open assembly.",
        "Viral Six-Second Clip Captures Politician Shouting Back at Assembly Attendee.",
        "Slashed Speech: Uncropped Footage Exposes Local Protester Disruption.",
        "Newspaper Displays Stock Image of Empty Assembly Next to Budget Story."
      ],
      correctIndex: 1,
      techniqueName: "Misleading Video Editing",
      explanation: "Cutting out the full interaction and showing only the 6 seconds of heightened volume hides the context and misrepresents the interaction."
    },
    {
      id: 303,
      scenario: "An article about a health code violation in a restaurant uses an unrelated stock photo showing chefs cooking without gloves.",
      spunText: "Kitchen Citations: Fine Imposed on Restaurant Displayed Beside Stock Photo of Staff Slicing Vegetables Barehanded.",
      choices: ["Selective Cropping", "Decontextualized / Recycled Imagery", "Juxtaposition Mismatch", "Manipulated or Synthetic Images", "Misleading Video Editing"],
      correctIndex: 2,
      techniqueName: "Juxtaposition Mismatch",
      explanation: "Juxtaposition mismatch places unrelated imagery next to negative headlines so readers subconsciously connect the visual wrongdoing to the story's subjects."
    }
  ],
  4: [
    {
      id: 401,
      scenario: "Two companies are applying for patent rights. One is a giant corporation and the other is a small startup.",
      spunText: "Reputable Market Leader Defends Creative Innovations as Rogue Competitor Clones Codebases.",
      choices: ["False Equivalence ('The Clash Illusion')", "Asymmetric Classification", "Adjective Preloading"],
      correctIndex: 1,
      techniqueName: "Asymmetric Classification",
      explanation: "Applying a noble label ('Defends', 'Market Leader') to one actor and a criminal label ('Rogue', 'Clones') to another for the exact same patent application is asymmetric classification."
    },
    {
      id: 402,
      scenario: "A neighborhood board proposes a standard 5% increase in annual dues.",
      spunText: "Find the headline that uses Adjective Preloading:",
      choices: [
        "Board Votes to Adjust Annual Membership Contribution by Twelve Dollars.",
        "Board Imposes Outrageous Price Hikes on Struggling Local Residents.",
        "Residents and Board Members Clash in Heavy Feud over Monthly Fee Increases.",
        "How the Proposed Fee Shift Protects Our Neighborhood Sanctuary."
      ],
      correctIndex: 1,
      techniqueName: "Adjective Preloading",
      explanation: "'Outrageous' is inserted right before the noun to make readers judge the 5% increase before seeing any details."
    },
    {
      id: 403,
      scenario: "A security guard easily restrains an unarmed rowdy customer at an entrance.",
      spunText: "Guard and Rowdy Patron Clash in Intense Physical Brawl at Venue.",
      choices: ["False Equivalence ('The Clash Illusion')", "Asymmetric Classification", "Adjective Preloading"],
      correctIndex: 0,
      techniqueName: "False Equivalence ('The Clash Illusion')",
      explanation: "'Clash' and 'Intense Brawl' paint a false picture of equality or match in strength, when it was a standard containment of an unarmed person by professional staff."
    }
  ],
  5: [
    {
      id: 501,
      scenario: "An annual company report shows sales rose by 0.2% but the graph's Y-axis starts at 10% instead of 0%.",
      spunText: "Interactive Sales Graph Displays Massive Skyrocketing Peak in Quarterly Profit Heights.",
      choices: ["Base-Rate Fallacy (Raw Numbers vs. Percentages)", "Selective Time-Slicing", "Misleading Chart Design"],
      correctIndex: 2,
      techniqueName: "Misleading Chart Design",
      explanation: "Exaggerating a tiny 0.2% change by cropping the Y-axis of a chart is a classic example of misleading chart design."
    },
    {
      id: 502,
      scenario: "The school district reports that the number of students caught vaping went from 1 to 2 in a school of 1000.",
      spunText: "Find the headline that uses Base-Rate Fallacy:",
      choices: [
        "School District Reports Two Individual Vaping Citations in Quarter Four.",
        "Vaping Rates Skyrocket and Double Among Local High School Students.",
        "School Administrators Uncover Ongoing Teen Substance Abuse Problem.",
        "Graphic Representation Depicts Massive Surge in Student Wellness Citations."
      ],
      correctIndex: 1,
      techniqueName: "Base-Rate Fallacy (Raw Numbers vs. Percentages)",
      explanation: "Saying vaping 'doubled' is mathematically true, but masks the tiny raw count (1 to 2) to imply a sudden epidemic."
    },
    {
      id: 503,
      scenario: "A retail group reports a major decline in clothing sales by comparing December sales with January sales.",
      spunText: "Retail Sales Plummet and Collapse Over Consecutive Weeks.",
      choices: ["Base-Rate Fallacy (Raw Numbers vs. Percentages)", "Selective Time-Slicing", "Misleading Chart Design"],
      correctIndex: 1,
      techniqueName: "Selective Time-Slicing",
      explanation: "Comparing post-holiday January sales to peak holiday December sales is an intentional seasonal slice used to manufacture a false trend."
    }
  ],
  6: [
    {
      id: 601,
      scenario: "An article has an alarming headline about a crop disease, but buries in the last sentence that it only affects a rare wild flower.",
      spunText: "Destructive Plant Disease Identified locally, Spurring Urgent Food Crop Fears.",
      choices: ["Contextual Coupling", "Chronological Reversal", "Buried Nuance (The Headline/Footer Disconnect)", "False Balance ('Bothsidesism')"],
      correctIndex: 2,
      techniqueName: "Buried Nuance (The Headline/Footer Disconnect)",
      explanation: "Putting the panic in the headline while burying the actual safe reality at the very bottom leverages the fact that most readers never read the full article."
    },
    {
      id: 602,
      scenario: "98% of climate scientists agree on a warming trend, but a talk show hosts one advocate and one climate denier side-by-side.",
      spunText: "Find the headline showing False Balance ('Bothsidesism'):",
      choices: [
        "Meteorological Board Publishes Long-Term Temperature Trends Summary.",
        "Fierce Scientific Debate Rages as Experts Clash on Rising Weather Temperatures.",
        "Global Scientists Document Five-Year Consecutive Rise in Summer Heating.",
        "Record-Setting Pool Sales Reported Alongside Minor Climate Adjustments."
      ],
      correctIndex: 1,
      techniqueName: "False Balance ('Bothsidesism')",
      explanation: "Framing a 98% scientific consensus as a 'fierce debate' with equal weight given to a tiny minority of dissenters is classic False Balance."
    },
    {
      id: 603,
      scenario: "A reporter lists pool sales increasing alongside local dog bite reports in July.",
      spunText: "Backyard Swimming Pool Sales Spike Coincides with Sharp Rise in Dog Attacks.",
      choices: ["Contextual Coupling", "Chronological Reversal", "Buried Nuance (The Headline/Footer Disconnect)", "False Balance ('Bothsidesism')"],
      correctIndex: 0,
      techniqueName: "Contextual Coupling",
      explanation: "Coupling two unrelated summer statistics side-by-side tricks the brain into imagining a cause-and-effect link when there is none."
    }
  ],
  7: [
    {
      id: 701,
      scenario: "An article about real estate trends is a paid promotion by a mortgage firm but uses standard news typography.",
      spunText: "Why Modern Renters are Hurrying to Secure New Suburban Home Mortgages.",
      choices: ["Anonymous Authority", "Hidden Affiliations", "Native Advertising", "Astroturfing"],
      correctIndex: 2,
      techniqueName: "Native Advertising",
      explanation: "Formatting a paid commercial advertisement to resemble an objective, independent news article is Native Advertising."
    },
    {
      id: 702,
      scenario: "A gas company pays a national PR firm to assemble a rally of paid actors opposing clean energy bills.",
      spunText: "Find the headline that uses Astroturfing:",
      choices: [
        "Dozens of Spontaneous Grassroots Citizens Assemble to Fight Clean Energy Bills.",
        "Energy Coalition Coordinates Legislative Lobby Assembly at State Capitol.",
        "Are Gas Executive Profits Threatened by Proposed Clean Air Standards?",
        "Industry Insiders Confirm Local Utilities Oppose Clean Energy Laws."
      ],
      correctIndex: 0,
      techniqueName: "Astroturfing",
      explanation: "Representing a funded public relations stunt as an organic, passionate grassroots protest is Astroturfing."
    },
    {
      id: 703,
      scenario: "An article cites 'reputable planners' who oppose a zoning law, but they are just two landlords who own buildings on the street.",
      spunText: "Planning Experts and Officials Warn New Zoning Laws Will Ruin Neighborhood Design.",
      choices: ["Anonymous Authority", "Hidden Affiliations", "Citation Laundering", "Astroturfing"],
      correctIndex: 0,
      techniqueName: "Anonymous Authority",
      explanation: "Using vague, authoritative terms like 'Experts' or 'Officials' to inflate a self-interested opinion into an objective consensus is Anonymous Authority."
    }
  ],
  8: [
    {
      id: 801,
      scenario: "A city administrator decides to cancel the free school bus route, but the headline omits who did it.",
      spunText: "Free School Bus Service Cancelled and Defunded Amid Financial Adjustments.",
      choices: ["Agent Deletion (Passive Voice)", "Nominalization (Turning Actions into Nouns)", "Exclusivity Pronouns"],
      correctIndex: 0,
      techniqueName: "Agent Deletion (Passive Voice)",
      explanation: "Passive framing ('service cancelled') hides the specific decision-maker who cancelled it, making it read like an act of nature."
    },
    {
      id: 802,
      scenario: "A major landlord decides to increase rents, turning that active choice into a noun phrase.",
      spunText: "Find the headline that uses Nominalization:",
      choices: [
        "Landlord Approves $150 Rental Increase Across Sixty Residential Units.",
        "Struggling Tenants Overwhelmed by Sudden Housing Cost Escalation.",
        "How the New Rent Decision Threatens Our Beautiful Community Tradition.",
        "Rental Services Suspended Following Landlord Budget Restructures."
      ],
      correctIndex: 1,
      techniqueName: "Nominalization (Turning Actions into Nouns)",
      explanation: "Converting the verb phrase 'landlord increased rents' into the abstract noun phrase 'cost escalation' treats a deliberate choice as a passive, natural condition."
    },
    {
      id: 803,
      scenario: "An article about a proposed garbage dump assumes the reader is already fighting it.",
      spunText: "How the Distant Council's Garbage Dump Proposal Threatens Our Beautiful Neighborhood.",
      choices: ["Agent Deletion (Passive Voice)", "Nominalization (Turning Actions into Nouns)", "Exclusivity Pronouns"],
      correctIndex: 2,
      techniqueName: "Exclusivity Pronouns",
      explanation: "The word 'Our' pre-loads a collective group identity and assumes the reader opposes the dump, framing the council as hostile outsiders."
    }
  ]
};
