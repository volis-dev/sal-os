export const formFieldConfig = {
  word: {
    placeholder: "Enter the word",
    required: true,
  },
  partOfSpeech: {
    placeholder: "Select part of speech",
    required: true,
  },
  definition: {
    placeholder: "Enter the definition",
    required: true,
  },
  etymology: {
    placeholder: "Word origin and history",
    required: false,
  },
  pronunciation: {
    placeholder: "Phonetic pronunciation",
    required: false,
  },
  exampleSentence: {
    placeholder: "Use the word in a sentence",
    required: false,
  },
  bookReference: {
    placeholder: "e.g., Book the Second, Chapter 5",
    required: false,
  },
  personalNotes: {
    placeholder: "Your thoughts, connections, or memory aids",
    required: false,
  },
} as const 