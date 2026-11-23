"""
evaluate.py  -  tests the model on sentences it has NEVER seen.

Accuracy on training data tells you nothing (the model may have just memorised it).
The honest test is a set of sentences written by a human, separate from the
generated data: data/test_intent.csv and data/test_category.csv.
"""
import csv
import os

BASE = os.path.dirname(os.path.abspath(__file__))


def read_csv(name):
    with open(os.path.join(BASE, "data", name), encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    return [r["text"] for r in rows], [r["label"] for r in rows]


def report(clf, csv_name, title, unsure_below=0.0):
    texts, labels = read_csv(csv_name)
    correct, wrong = 0, []
    per_label = {}
    for text, truth in zip(texts, labels):
        guess, prob, _ = clf.predict(text)
        ok = guess == truth
        correct += ok
        stats = per_label.setdefault(truth, [0, 0])
        stats[1] += 1
        stats[0] += ok
        if not ok:
            wrong.append((text, truth, guess, prob))

    print(f"\n=== {title}: {correct}/{len(texts)} correct = {correct / len(texts):.1%}")
    for label, (good, total) in sorted(per_label.items()):
        print(f"   {label:13s} {good}/{total}")
    if wrong:
        print("   mistakes:")
        for text, truth, guess, prob in wrong:
            print(f"     '{text}'  expected {truth}, model said {guess} ({prob:.0%})")
    return correct / len(texts)
