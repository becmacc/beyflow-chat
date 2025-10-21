export const motivationalQuotes = [
  // Corporate & Business
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "corporate" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "corporate" },
  { text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.", author: "Steve Jobs", category: "corporate" },
  { text: "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.", author: "Mark Zuckerberg", category: "corporate" },
  { text: "Ideas are easy. Implementation is hard.", author: "Guy Kawasaki", category: "corporate" },
  { text: "The biggest risk is not taking any risk.", author: "Mark Zuckerberg", category: "corporate" },
  
  // Military & Discipline
  { text: "Discipline equals freedom.", author: "Jocko Willink", category: "military" },
  { text: "Get comfortable being uncomfortable.", author: "Jocko Willink", category: "military" },
  { text: "Under pressure, you don't rise to the occasion, you sink to the level of your training.", author: "Navy SEALs", category: "military" },
  { text: "The only easy day was yesterday.", author: "Navy SEALs", category: "military" },
  { text: "Everyone wants to be a beast, until it's time to do what real beasts do.", author: "Unknown", category: "military" },
  { text: "Victory has a hundred fathers, but defeat is an orphan.", author: "John F. Kennedy", category: "military" },
  { text: "Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.", author: "Sun Tzu", category: "military" },
  
  // Existentialism & Philosophy
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche", category: "existential" },
  { text: "That which does not kill us makes us stronger.", author: "Friedrich Nietzsche", category: "existential" },
  { text: "To live is to suffer, to survive is to find some meaning in the suffering.", author: "Friedrich Nietzsche", category: "existential" },
  { text: "Man is condemned to be free.", author: "Jean-Paul Sartre", category: "existential" },
  { text: "Life has no meaning a priori. It is up to you to give it a meaning, and value is nothing but the meaning that you choose.", author: "Jean-Paul Sartre", category: "existential" },
  { text: "The absurd is the essential concept and the first truth.", author: "Albert Camus", category: "existential" },
  { text: "In the midst of winter, I found there was, within me, an invincible summer.", author: "Albert Camus", category: "existential" },
  { text: "One must imagine Sisyphus happy.", author: "Albert Camus", category: "existential" },
  
  // Tech & Innovation
  { text: "Code is poetry.", author: "Unknown", category: "tech" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds", category: "tech" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler", category: "tech" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson", category: "tech" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay", category: "tech" },
  
  // Personal Growth
  { text: "The cave you fear to enter holds the treasure you seek.", author: "Joseph Campbell", category: "growth" },
  { text: "Do not pray for an easy life, pray for the strength to endure a difficult one.", author: "Bruce Lee", category: "growth" },
  { text: "What we fear doing most is usually what we most need to do.", author: "Tim Ferriss", category: "growth" },
  { text: "Comfort is the enemy of progress.", author: "P.T. Barnum", category: "growth" },
  { text: "The obstacle is the way.", author: "Marcus Aurelius", category: "growth" }
]

export const getRandomQuote = () => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
}

export const getQuoteByCategory = (category) => {
  const filtered = motivationalQuotes.filter(q => q.category === category)
  return filtered[Math.floor(Math.random() * filtered.length)]
}
