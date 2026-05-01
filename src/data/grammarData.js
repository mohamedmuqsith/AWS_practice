export const grammarSteps = [
  {
    id: 1,
    title: "Modal Verb: CAN",
    icon: "🎯",
    color: "from-blue-400 to-blue-600",
    sections: [
      {
        id: "can-intro",
        title: "What is CAN?",
        content: `CAN is a modal verb expressing ability, permission, or possibility.`,
        examples: [
          "I can close the door.",
          "Can you come to the shop?",
          "He can read a lot."
        ]
      },
      {
        id: "can-affirmative",
        title: "Affirmative (I CAN...)",
        pattern: "Subject + CAN + Base Verb",
        examples: [
          "I can close the door.",
          "You can come to the shop.",
          "We can go out.",
          "They can plant a tree.",
          "He can read a lot.",
          "She can speak the truth."
        ]
      },
      {
        id: "can-negative",
        title: "Negative (I CAN'T...)",
        pattern: "Subject + CAN'T + Base Verb",
        examples: [
          "I can't read a book.",
          "You can't speak the truth.",
          "We can't go out.",
          "They can't pass the exam.",
          "He can't plant a tree.",
          "She can't go early."
        ]
      },
      {
        id: "can-questions",
        title: "Questions (Can I...?)",
        pattern: "CAN + Subject + Base Verb + ?",
        examples: [
          "Can I close the door?",
          "Can you come to the shop?",
          "Can we go out?",
          "Can they plant a tree?",
          "Can he read a lot?",
          "Can she speak the truth?",
          "Can the bus stop here?"
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Present Tense",
    icon: "⏱️",
    color: "from-green-400 to-green-600",
    sections: [
      {
        id: "present-simple",
        title: "Simple Present",
        pattern: "Subject + Base Verb (+ S/ES for 3rd person)",
        examples: [
          "I play football.",
          "You write letters.",
          "He studies English.",
          "She works in an office.",
          "They go to school."
        ]
      },
      {
        id: "present-continuous",
        title: "Present Continuous (Now)",
        pattern: "Subject + AM/IS/ARE + Verb-ING",
        examples: [
          "I am playing football.",
          "You are reading a book.",
          "He is drinking tea.",
          "She is making tea.",
          "They are playing games."
        ]
      },
      {
        id: "present-do-does",
        title: "Do/Does Questions",
        pattern: "DO/DOES + Subject + Base Verb + ?",
        examples: [
          "Do you read?",
          "Does he play football?",
          "Do they go to school?",
          "Does she speak English?",
          "Do I understand correctly?"
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Past Tense",
    icon: "📅",
    color: "from-purple-400 to-purple-600",
    sections: [
      {
        id: "past-regular",
        title: "Regular Past (Base + ED)",
        pattern: "Subject + Base Verb + ED",
        examples: [
          "I played football.",
          "You studied English.",
          "He worked in a shop.",
          "She called her friend.",
          "They walked to school.",
          "I watched a movie."
        ]
      },
      {
        id: "past-irregular",
        title: "Irregular Past Verbs",
        pattern: "Special forms (not +ED)",
        examples: [
          "I went to the market. (go → went)",
          "He saw a beautiful movie. (see → saw)",
          "They ate delicious food. (eat → ate)",
          "She drank water. (drink → drank)",
          "We ran very fast. (run → ran)",
          "I wrote a letter. (write → wrote)",
          "She read a book. (read → read)",
          "They sang a song. (sing → sang)"
        ]
      },
      {
        id: "past-questions",
        title: "Past Questions",
        pattern: "DID + Subject + Base Verb + ?",
        examples: [
          "Did you go to school?",
          "Did she study English?",
          "Did they play football?",
          "Did he eat lunch?",
          "Did I close the door?"
        ]
      },
      {
        id: "past-negative",
        title: "Negative Past",
        pattern: "Subject + DIDN'T + Base Verb",
        examples: [
          "I didn't go to school.",
          "You didn't study English.",
          "She didn't eat well.",
          "They didn't play football.",
          "He didn't finish his work."
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Future Tense",
    icon: "🚀",
    color: "from-yellow-400 to-yellow-600",
    sections: [
      {
        id: "future-will",
        title: "Future with WILL",
        pattern: "Subject + WILL + Base Verb",
        examples: [
          "I will go to school.",
          "You will finish the work.",
          "He will find the answer.",
          "She will study English.",
          "They will sleep tonight.",
          "We will help you."
        ]
      },
      {
        id: "future-going-to",
        title: "Future with GOING TO",
        pattern: "Subject + AM/IS/ARE + GOING TO + Verb",
        examples: [
          "I am going to close the door.",
          "You are going to come to the shop.",
          "He is going to do good.",
          "They are going to go out.",
          "She is going to help me."
        ]
      },
      {
        id: "future-questions",
        title: "Future Questions",
        pattern: "WILL + Subject + Base Verb + ?",
        examples: [
          "Will you go to school?",
          "Will he finish the work?",
          "Will they come tomorrow?",
          "Will she study English?",
          "Will I pass the exam?"
        ]
      },
      {
        id: "future-negative",
        title: "Negative Future",
        pattern: "Subject + WON'T (WILL NOT) + Verb",
        examples: [
          "I won't go to school.",
          "You won't finish the work.",
          "She won't come tomorrow.",
          "They won't help us.",
          "He won't study English."
        ]
      }
    ]
  },
  {
    id: 5,
    title: "WH-Questions",
    icon: "❓",
    color: "from-red-400 to-red-600",
    sections: [
      {
        id: "who-questions",
        title: "WHO - Ask About Person",
        pattern: "WHO + Verb + ?",
        examples: [
          "Who opens the door?",
          "Who comes to the shop?",
          "Who eats well?",
          "Who helps him?",
          "Who teaches you English?"
        ]
      },
      {
        id: "what-questions",
        title: "WHAT - Ask About Thing/Action",
        pattern: "WHAT + DO/DOES/DID + Subject + ?",
        examples: [
          "What do you do?",
          "What do you eat?",
          "What did you read?",
          "What will you do?",
          "What book did you read?"
        ]
      },
      {
        id: "where-questions",
        title: "WHERE - Ask About Place",
        pattern: "WHERE + DO/DOES/DID + Subject + ?",
        examples: [
          "Where do you go?",
          "Where did you study?",
          "Where will you sit?",
          "Where is the library?",
          "Where will they play?"
        ]
      },
      {
        id: "when-questions",
        title: "WHEN - Ask About Time",
        pattern: "WHEN + DO/DOES/DID + Subject + ?",
        examples: [
          "When do you go?",
          "When did you study?",
          "When will you come?",
          "When did you sleep?",
          "When did they arrive?"
        ]
      },
      {
        id: "why-questions",
        title: "WHY - Ask About Reason",
        pattern: "WHY + DO/DOES/DID + Subject + ?",
        examples: [
          "Why do you go?",
          "Why did you study?",
          "Why will you come?",
          "Why did you sleep?",
          "Why do you learn English?"
        ]
      },
      {
        id: "how-questions",
        title: "HOW - Ask About Manner",
        pattern: "HOW + DO/DOES/DID + Subject + ?",
        examples: [
          "How do you come?",
          "How did you study?",
          "How will you help?",
          "How do you speak?",
          "How did they solve it?"
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Imperatives (Commands)",
    icon: "🎤",
    color: "from-pink-400 to-pink-600",
    sections: [
      {
        id: "imperative-positive",
        title: "Positive Commands",
        pattern: "Base Verb + ... (no subject)",
        examples: [
          "Come here!",
          "Close the door!",
          "Drink water!",
          "Go to school!",
          "Read a book!",
          "Help me!"
        ]
      },
      {
        id: "imperative-negative",
        title: "Negative Commands",
        pattern: "DON'T + Base Verb",
        examples: [
          "Don't come late!",
          "Don't sleep now!",
          "Don't eat too much!",
          "Don't talk loudly!",
          "Don't forget!",
          "Don't worry!"
        ]
      },
      {
        id: "imperative-polite",
        title: "Polite Commands",
        pattern: "Please + Command",
        examples: [
          "Please come here.",
          "Please open the door.",
          "Please help me.",
          "Please wait.",
          "Please read this.",
          "Please listen carefully."
        ]
      }
    ]
  },
  {
    id: 7,
    title: "Prepositions",
    icon: "📍",
    color: "from-indigo-400 to-indigo-600",
    sections: [
      {
        id: "prepositions-location",
        title: "Location Prepositions",
        pattern: "Place descriptors",
        examples: [
          "IN: The book is in the table.",
          "ON: The cup is on the table.",
          "AT: I am at school.",
          "NEAR: The river is near my home.",
          "BEHIND: He is behind the door.",
          "UNDER: The cat is under the table.",
          "ABOVE: The bird is above the tree.",
          "BETWEEN: Sit between them."
        ]
      },
      {
        id: "prepositions-time",
        title: "Time Prepositions",
        pattern: "Time descriptors",
        examples: [
          "IN: In January, in the morning",
          "ON: On Monday, on 29th April",
          "AT: At 9 o'clock, at noon",
          "BEFORE: Before 5 PM",
          "AFTER: After school",
          "DURING: During the meeting",
          "SINCE: Since yesterday",
          "UNTIL: Until tomorrow"
        ]
      },
      {
        id: "prepositions-adjectives",
        title: "Prepositions with Adjectives",
        pattern: "Adjective + Preposition",
        examples: [
          "afraid OF: I am afraid of dogs.",
          "interested IN: She is interested in sports.",
          "good AT: He is good at English.",
          "bad AT: She is bad at math.",
          "happy WITH: I am happy with my life.",
          "angry WITH: She is angry with him.",
          "proud OF: I am proud of my work.",
          "different FROM: This is different from that."
        ]
      },
      {
        id: "prepositions-verbs",
        title: "Prepositions with Verbs",
        pattern: "Verb + Preposition",
        examples: [
          "listen TO: Listen to music.",
          "look AT: Look at the sky.",
          "look FOR: Look for your keys.",
          "wait FOR: Wait for me.",
          "ask FOR: Ask for help.",
          "care ABOUT: Care about family.",
          "think ABOUT: Think about the problem.",
          "depend ON: Depend on your friends."
        ]
      }
    ]
  },
  {
    id: 8,
    title: "Phrasal Verbs",
    icon: "🔗",
    color: "from-cyan-400 to-cyan-600",
    sections: [
      {
        id: "phrasal-basic",
        title: "Common Phrasal Verbs",
        pattern: "Verb + Preposition/Adverb",
        examples: [
          "Turn on: Turn on the light.",
          "Turn off: Turn off the light.",
          "Look for: Look for your keys.",
          "Look after: Look after your brother.",
          "Put on: Put on your shirt.",
          "Take off: Take off your shoes.",
          "Give up: Don't give up!",
          "Get up: Get up early."
        ]
      },
      {
        id: "phrasal-work",
        title: "Work-Related Phrasal Verbs",
        pattern: "Business/Office verbs",
        examples: [
          "Figure it out: Solve the problem",
          "Sort it out: Resolve the issue",
          "Move on: Continue forward",
          "Check it out: Examine carefully",
          "Hand it over: Give/pass to someone",
          "Get ready: Prepare",
          "Go ahead: Proceed",
          "Follow up: Contact again"
        ]
      }
    ]
  },
  {
    id: 9,
    title: "Irregular Verbs",
    icon: "🎲",
    color: "from-orange-400 to-orange-600",
    sections: [
      {
        id: "irregular-group1",
        title: "Group 1: Same Form",
        pattern: "Base = Past = Past Participle",
        examples: [
          "hit → hit → hit",
          "put → put → put",
          "cut → cut → cut",
          "read → read → read",
          "split → split → split"
        ]
      },
      {
        id: "irregular-group2",
        title: "Group 2: Common Changes",
        pattern: "Different past and past participle",
        examples: [
          "go → went → gone",
          "see → saw → seen",
          "eat → ate → eaten",
          "drink → drank → drunk",
          "run → ran → run",
          "write → wrote → written",
          "sing → sang → sung",
          "swim → swam → swum"
        ]
      },
      {
        id: "irregular-group3",
        title: "Group 3: More Verbs",
        pattern: "Additional irregular forms",
        examples: [
          "take → took → taken",
          "give → gave → given",
          "break → broke → broken",
          "choose → chose → chosen",
          "speak → spoke → spoken",
          "bring → brought → brought",
          "buy → bought → bought",
          "teach → taught → taught"
        ]
      }
    ]
  },
  {
    id: 10,
    title: "Advanced Grammar",
    icon: "⚡",
    color: "from-teal-400 to-teal-600",
    sections: [
      {
        id: "about-to",
        title: "About To (Immediate Future)",
        pattern: "AM/IS/ARE + ABOUT TO + Base Verb",
        examples: [
          "I am about to open the door.",
          "She is about to make tea.",
          "They are about to go out.",
          "He is about to call you.",
          "The sun is about to rise."
        ]
      },
      {
        id: "should-have",
        title: "Should Have (Past Regret)",
        pattern: "SHOULD HAVE + Past Participle",
        examples: [
          "I should have studied more.",
          "She should have gone early.",
          "They should have finished their work.",
          "He should have asked for help.",
          "We should have prepared better."
        ]
      },
      {
        id: "conditionals",
        title: "Conditional (If Clauses)",
        pattern: "If + Present, Will + Verb",
        examples: [
          "If I prepare, I will pass the exam.",
          "If it rains, we will stay inside.",
          "If you study, you will learn.",
          "If he comes, I will help him.",
          "If she calls, answer immediately."
        ]
      },
      {
        id: "trying-to",
        title: "Trying To (Attempting)",
        pattern: "AM/IS/ARE + TRYING TO + Base Verb",
        examples: [
          "I am trying to pass the exam.",
          "She is trying to learn English.",
          "They are trying to solve the problem.",
          "He is trying to help.",
          "We are trying to improve."
        ]
      }
    ]
  }
];
