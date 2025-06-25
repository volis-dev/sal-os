import type { Book, Chapter } from "@/types/modules"

export const salBooks: Book[] = [
  {
    id: "book-1",
    title: "Life Leadership & Education",
    subtitle: "Book the First",
    totalChapters: 5,
    completedChapters: 5,
    currentChapter: 1,
    lastRead: "2024-01-15",
    totalPages: 180,
    pagesRead: 180,
    color: "from-emerald-500 to-teal-600",
    description: "Foundation of SAL education and cultural literacy",
    estimatedHours: 8,
  },
  {
    id: "book-2",
    title: "Change, Growth & Freedom",
    subtitle: "Book the Second",
    totalChapters: 12,
    completedChapters: 9,
    currentChapter: 10,
    lastRead: "2024-01-20",
    totalPages: 420,
    pagesRead: 315,
    color: "from-blue-500 to-indigo-600",
    description: "Understanding change processes and freedom principles",
    estimatedHours: 18,
  },
  {
    id: "book-3",
    title: "SAL Philosophy",
    subtitle: "Book the Third",
    totalChapters: 7,
    completedChapters: 0,
    currentChapter: 1,
    lastRead: null,
    totalPages: 280,
    pagesRead: 0,
    color: "from-purple-500 to-pink-600",
    description: "Core philosophical foundations of Self-Action Leadership",
    estimatedHours: 12,
  },
  {
    id: "book-4",
    title: "SAL Theory",
    subtitle: "Book the Fourth",
    totalChapters: 21,
    completedChapters: 0,
    currentChapter: 1,
    lastRead: null,
    totalPages: 650,
    pagesRead: 0,
    color: "from-amber-500 to-orange-600",
    description: "Theoretical framework for existential growth",
    estimatedHours: 28,
  },
  {
    id: "book-5",
    title: "SAL Model",
    subtitle: "Book the Fifth",
    totalChapters: 9,
    completedChapters: 0,
    currentChapter: 1,
    lastRead: null,
    totalPages: 350,
    pagesRead: 0,
    color: "from-red-500 to-rose-600",
    description: "Practical implementation model for daily life",
    estimatedHours: 15,
  },
  {
    id: "book-6",
    title: "Success Stories",
    subtitle: "Book the Sixth",
    totalChapters: 12,
    completedChapters: 0,
    currentChapter: 1,
    lastRead: null,
    totalPages: 400,
    pagesRead: 0,
    color: "from-cyan-500 to-blue-600",
    description: "Real-life SAL transformations and case studies",
    estimatedHours: 16,
  },
  {
    id: "book-7",
    title: "Pedagogy",
    subtitle: "Book the Seventh",
    totalChapters: 10,
    completedChapters: 0,
    currentChapter: 1,
    lastRead: null,
    totalPages: 320,
    pagesRead: 0,
    color: "from-violet-500 to-purple-600",
    description: "Teaching personal leadership to others",
    estimatedHours: 14,
  },
  {
    id: "book-8",
    title: "Sovereignty",
    subtitle: "Book the Eighth",
    totalChapters: 5,
    completedChapters: 0,
    currentChapter: 1,
    lastRead: null,
    totalPages: 200,
    pagesRead: 0,
    color: "from-slate-600 to-gray-700",
    description: "You are sovereign - final principles of SAL mastery",
    estimatedHours: 10,
  },
]

export const sampleChapters: Record<string, Chapter[]> = {
  "book-2": [
    {
      id: "ch-2-10",
      bookId: "sal-book",
      number: 10,
      title: "Things That Enslave",
      content: `# Chapter 10: Things That Enslave

## Introduction

Self-Action Leadership is fundamentally about freedom - the freedom to choose our responses, our direction, and our destiny. Yet we live in a world filled with forces that seek to enslave us, to rob us of our agency and reduce us to mere reactors rather than conscious actors.

In this chapter, we will explore the various forms of enslavement that threaten our development as Self-Action Leaders. Understanding these threats is the first step toward liberation.

## The Nature of Enslavement

Enslavement comes in many forms. Some are obvious - addiction, debt, toxic relationships. Others are subtle - social pressure, limiting beliefs, the tyranny of the urgent over the important.

The most dangerous forms of enslavement are those we don't recognize as such. When we mistake comfort for security, convenience for efficiency, or popularity for worth, we begin to surrender our freedom without even realizing it.

## Physical Enslavement

Our bodies can become our masters when we fail to exercise proper stewardship over them. Poor health habits, lack of exercise, inadequate sleep, and substance abuse all represent forms of physical enslavement.

The Self-Action Leader recognizes that physical wellness is not vanity but stewardship - a responsibility to maintain the vessel that houses our spirit and enables our service.

## Mental Enslavement

Perhaps more insidious than physical enslavement is mental enslavement. This occurs when we allow others to do our thinking for us, when we accept limiting beliefs without question, or when we become addicted to entertainment and distraction.

Mental enslavement manifests in:
- Intellectual laziness
- Uncritical acceptance of popular opinion
- Addiction to social media and entertainment
- Fear of independent thought
- Reliance on others for validation

## Emotional Enslavement

Emotional enslavement occurs when our feelings control our actions rather than inform them. When we become slaves to anger, fear, jealousy, or any other emotion, we lose our capacity for rational choice.

The Self-Action Leader learns to acknowledge emotions without being controlled by them. Feelings are data, not directives.

## Social Enslavement

The pressure to conform, to fit in, to avoid standing out can become a powerful form of enslavement. When we sacrifice our values for acceptance, we trade our freedom for the illusion of belonging.

Social enslavement includes:
- People-pleasing at the expense of principle
- Fear of criticism or rejection
- Conformity to destructive group norms
- Dependence on others for self-worth

## Financial Enslavement

Debt, materialism, and the pursuit of wealth for its own sake can become forms of enslavement. When our financial obligations or desires control our choices, we lose our freedom to act according to our values.

The Self-Action Leader practices financial stewardship, living below their means and avoiding the trap of lifestyle inflation.

## Spiritual Enslavement

Perhaps the most tragic form of enslavement is spiritual - when we lose connection to our higher purpose and become slaves to base appetites and immediate gratification.

Spiritual enslavement manifests as:
- Loss of meaning and purpose
- Cynicism and despair
- Addiction to pleasure-seeking
- Disconnection from transcendent values

## The Path to Freedom

Recognition is the first step toward freedom. We cannot escape what we do not acknowledge. The Self-Action Leader regularly examines their life for signs of enslavement and takes deliberate action to maintain their freedom.

Freedom is not the absence of constraints but the ability to choose our constraints wisely. The Self-Action Leader chooses to be bound by principles rather than impulses, by values rather than circumstances.

## Practical Applications

1. **Regular Self-Assessment**: Conduct weekly reviews to identify areas where you may be surrendering your freedom.

2. **Principle-Based Decision Making**: Before making decisions, ask yourself: "Does this choice increase or decrease my freedom to act according to my values?"

3. **Simplification**: Regularly eliminate unnecessary complications from your life that may be enslaving you.

4. **Education**: Continuously educate yourself to avoid intellectual enslavement.

5. **Financial Discipline**: Live below your means and avoid debt that would limit your choices.

## Conclusion

The journey of Self-Action Leadership is ultimately a journey toward freedom - not freedom from responsibility, but freedom to choose our responsibilities wisely. By recognizing and resisting the various forms of enslavement that surround us, we maintain our capacity to act rather than merely react.

Remember: You are free to choose, but you are not free from the consequences of your choices. Choose wisely, and choose with full awareness of what you are accepting and what you are rejecting.

The Self-Action Leader is, above all, a free agent - free to choose, free to act, and free to become who they are meant to be.`,
      estimatedMinutes: 45,
      completed: false,
    },
    {
      id: "ch-2-11",
      bookId: "sal-book",
      number: 11,
      title: "Chapter 11: Building Lasting Change",
      content: "Strategies for creating sustainable change...",
      estimatedMinutes: 50,
      completed: false,
    },
    {
      id: "ch-2-12",
      bookId: "sal-book",
      number: 12,
      title: "Chapter 12: The Journey Continues",
      content: "Reflection on the journey and next steps...",
      estimatedMinutes: 40,
      completed: false,
    },
  ],
} 