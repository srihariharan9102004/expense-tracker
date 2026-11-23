"""
nlp.py  -  turns a sentence into numbers.

A neural network can only read numbers, not words. So we need two steps:
  1) tokenize : "I spent 500 on pizza"  ->  ["i", "spent", "<num>", "on", "pizza"]
  2) features : tokens -> a set of "features" (single words + pairs of words)

The SAME logic is written again in JavaScript (src/agent/nlp.js).
If you change something here, change it there too, otherwise the
browser will understand sentences differently from the trainer.
"""
import re

# matches 500   1,200   2.5   5k   1.5k
NUMBER_RE = re.compile(r"\d[\d,]*(?:\.\d+)?k?")


def tokenize(text):
    text = text.lower()
    text = text.replace("%", " percent ")
    # every number becomes the same token, so "500" and "2000" look alike to the model
    text = NUMBER_RE.sub(" <num> ", text)
    # keep only letters (and the < > of <num>)
    text = re.sub(r"[^a-z<>\s]", " ", text)
    return text.split()


def features(tokens):
    """single words + pairs of neighbouring words (bigrams)."""
    feats = set(tokens)
    for first, second in zip(tokens, tokens[1:]):
        feats.add(first + " " + second)
    return feats
