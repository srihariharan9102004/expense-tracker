// nlp.js  -  the JavaScript twin of ai/nlp.py
// It MUST behave exactly like the Python version, otherwise the model
// would read sentences differently in the browser than it did in training.

const NUMBER_RE = /\d[\d,]*(?:\.\d+)?k?/g

export function tokenize(text) {
  let t = text.toLowerCase()
  t = t.replace(/%/g, ' percent ')
  t = t.replace(NUMBER_RE, ' <num> ')
  t = t.replace(/[^a-z<>\s]/g, ' ')
  return t.split(/\s+/).filter(Boolean)
}

// single words + pairs of neighbouring words
export function features(tokens) {
  const feats = new Set(tokens)
  for (let i = 0; i < tokens.length - 1; i++) {
    feats.add(tokens[i] + ' ' + tokens[i + 1])
  }
  return feats
}
