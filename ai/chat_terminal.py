"""
chat_terminal.py  -  talk to the trained model in the terminal and see how it "thinks".

    python chat_terminal.py

Type a sentence; it prints the tokens, the top guesses with probabilities,
and the category guess. Type  q  to quit.
"""
import json
import os

from model import TextClassifier
from nlp import tokenize

BASE = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(BASE, "..", "src", "agent", "model.json")

with open(PATH, encoding="utf-8") as f:
    saved = json.load(f)
intent = TextClassifier.from_dict(saved["intent"])
category = TextClassifier.from_dict(saved["category"])

print("Type a sentence (q to quit). Try: i spent 500 on pizza\n")
while True:
    text = input("you > ").strip()
    if text.lower() in ("q", "quit", "exit"):
        break
    if not text:
        continue
    print("  tokens  :", tokenize(text))
    _, _, probs = intent.predict(text)
    top = sorted(probs.items(), key=lambda kv: -kv[1])[:3]
    print("  intent  :", "   ".join(f"{k} {v:.0%}" for k, v in top))
    label, prob, _ = category.predict(text)
    print(f"  category: {label} ({prob:.0%})  <- only meaningful for add_expense sentences\n")
