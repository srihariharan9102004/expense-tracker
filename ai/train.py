"""
train.py  -  trains the two small neural networks and saves them for the website.

    python train.py

Model 1 "intent"   : what does the user WANT?   (add_expense, delete, highest, ...)
Model 2 "category" : which category is this item? (Food, Travel, Bills, ...)

Steps
  1. read data/*.csv  (create them first with make_data.py if missing)
  2. split: 80% train, 10% validation, 10% test
       train      -> the model learns from this
       validation -> used while training to know when to stop
       test       -> final check
  3. train
  4. check on human-written sentences (data/test_*.csv)
  5. save everything to ../src/agent/model.json  (the website reads this file)
"""
import csv
import json
import os
import random
import sys

import make_data
from evaluate import report
from model import TextClassifier

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "..", "src", "agent", "model.json")


def load(name):
    with open(os.path.join(BASE, "data", name), encoding="utf-8") as f:
        rows = [(r["text"], r["label"]) for r in csv.DictReader(f)]
    random.Random(7).shuffle(rows)
    n = len(rows)
    a, b = int(n * 0.8), int(n * 0.9)
    return rows[:a], rows[a:b], rows[b:]


def train_one(name, csv_name, labels, hidden, lr):
    print(f"\n##### Training the {name} model #####")
    train, val, test = load(csv_name)
    print(f"  {len(train)} train / {len(val)} validation / {len(test)} test sentences")

    clf = TextClassifier(labels, hidden=hidden)
    clf.fit([t for t, _ in train], [l for _, l in train],
            [t for t, _ in val], [l for _, l in val], lr=lr)

    test_x, test_y = clf.vectorize([t for t, _ in test]), clf.encode([l for _, l in test])
    _, acc = clf.score(test_x, test_y)
    print(f"  vocabulary size: {len(clf.vocab)} features, "
          f"weights: {clf.W1.size + clf.W2.size} numbers")
    print(f"  accuracy on generated test split: {acc:.1%}")
    return clf


def main():
    if "--regen" in sys.argv or not os.path.exists(os.path.join(BASE, "data", "intent.csv")):
        make_data.main()

    intent = train_one("intent", "intent.csv", list(make_data.TEMPLATES.keys()), hidden=24, lr=0.1)
    category = train_one("category", "category.csv", list(make_data.ITEMS.keys()), hidden=16, lr=0.1)

    print("\n##### Human-written test (sentences the model never saw) #####")
    report(intent, "test_intent.csv", "INTENT")
    report(category, "test_category.csv", "CATEGORY")

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump({"intent": intent.to_dict(), "category": category.to_dict()},
                  f, separators=(",", ":"))
    size = os.path.getsize(OUT) / 1024
    print(f"\nSaved the trained model to src/agent/model.json ({size:.0f} KB)")


if __name__ == "__main__":
    main()
