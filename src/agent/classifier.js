// classifier.js  -  runs a trained network (the forward pass only).
// Training happened in Python; here we just load the saved numbers and do the maths.

import { tokenize, features } from './nlp'

// turn the saved JSON into something fast to use
export function loadClassifier(saved) {
  return {
    labels: saved.labels,
    index: new Map(saved.vocab.map((f, i) => [f, i])),
    W1: saved.W1,
    b1: saved.b1,
    W2: saved.W2,
    b2: saved.b2,
  }
}

// returns { label, prob, probs } ; `allowed` limits which labels may win
export function predict(clf, text, allowed) {
  const hiddenSize = clf.b1.length

  // layer 1: add up the weight rows of every feature found in the sentence
  const hidden = clf.b1.slice()
  for (const f of features(tokenize(text))) {
    const i = clf.index.get(f)
    if (i === undefined) continue // unknown word -> ignored
    const row = clf.W1[i]
    for (let j = 0; j < hiddenSize; j++) hidden[j] += row[j]
  }
  for (let j = 0; j < hiddenSize; j++) hidden[j] = Math.max(0, hidden[j]) // ReLU

  // layer 2: one score per label
  const scores = clf.b2.slice()
  for (let j = 0; j < hiddenSize; j++) {
    const row = clf.W2[j]
    for (let k = 0; k < scores.length; k++) scores[k] += hidden[j] * row[k]
  }

  // softmax -> probabilities (labels not allowed get probability 0)
  const ok = (k) => !allowed || allowed.includes(clf.labels[k])
  const max = Math.max(...scores.filter((_, k) => ok(k)))
  const exps = scores.map((s, k) => (ok(k) ? Math.exp(s - max) : 0))
  const total = exps.reduce((a, b) => a + b, 0)
  const probs = exps.map((e) => e / total)

  let best = 0
  probs.forEach((p, k) => {
    if (p > probs[best]) best = k
  })
  return { label: clf.labels[best], prob: probs[best], probs }
}
