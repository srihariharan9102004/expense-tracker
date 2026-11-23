"""
make_data.py  -  creates the training data.

A model learns from examples, so we need thousands of example sentences.
Writing them by hand is slow, so we write a few TEMPLATES and let the
computer fill the blanks with different amounts and items:

    "i spent {amount} on {item}"  ->  "i spent 450 on pizza"

Run:  python make_data.py
Output: data/intent.csv   (sentence, intent)
        data/category.csv (item words, category)

To make the AI smarter, add more templates / more item words below, then train again.
"""
import csv
import os
import random

rng = random.Random(42)
BASE = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------- word lists
ITEMS = {
    "Food": ["lunch", "dinner", "breakfast", "pizza", "biryani", "dosa", "idli", "tea", "coffee",
             "snacks", "groceries", "vegetables", "fruits", "milk", "burger", "juice", "restaurant",
             "swiggy", "zomato", "ice cream", "chicken", "mutton", "parotta", "samosa", "chai",
             "cake", "chocolate", "sweets", "meals", "fast food", "food", "rice", "bakery", "eggs",
             "fish", "noodles", "sandwich", "pasta", "momos", "puri", "pongal", "vada", "kebab",
             "shawarma", "fries", "cool drink", "ice tea", "tiffin", "parcel", "grocery", "supermarket",
             "canteen", "snack", "brunch", "dessert", "milkshake", "water bottle", "biscuits", "bread"],
    "Travel": ["petrol", "diesel", "bus ticket", "train ticket", "auto fare", "uber", "ola", "taxi",
               "metro", "flight ticket", "bus pass", "cab", "toll", "parking", "bike service", "fuel",
               "rapido", "travel", "trip", "hotel stay", "auto", "bus", "train", "flight", "ticket",
               "bus fare", "metro card", "bike petrol", "car service", "tyre", "ferry", "road trip",
               "airport cab", "railway ticket", "cab fare", "travel pass", "scooter petrol", "tour",
               "vehicle repair", "highway toll", "booking", "journey", "commute", "fare"],
    "Bills": ["electricity bill", "water bill", "wifi bill", "internet bill", "mobile recharge",
              "phone recharge", "rent", "gas cylinder", "dth recharge", "insurance", "emi", "loan emi",
              "maintenance", "tax", "credit card bill", "gas bill", "bills", "school fees", "netflix",
              "subscription", "electricity", "recharge", "broadband", "house rent", "phone bill",
              "current bill", "eb bill", "water tax", "property tax", "college fees", "tuition fees",
              "cable bill", "lpg", "bill", "postpaid", "prepaid", "light bill", "premium", "fees",
              "loan", "emi payment", "hospital bill", "medical bill", "medicine", "spotify"],
    "Shopping": ["shoes", "shirt", "jeans", "dress", "amazon order", "flipkart", "headphones", "watch",
                 "bag", "new phone", "laptop", "clothes", "shopping", "gift", "furniture", "makeup",
                 "cap", "sunglasses", "books", "charger", "amazon", "myntra", "tshirt", "saree",
                 "sandals", "perfume", "earphones", "mobile cover", "keyboard", "mouse", "tv", "fridge",
                 "bedsheet", "toys", "watch strap", "jacket", "belt", "wallet", "slippers", "purse",
                 "cosmetics", "stationery", "pen", "notebook", "online order", "mall", "shop", "kurta",
                 "socks", "backpack", "speaker", "smartwatch", "tablet"],
    "Salary": ["salary", "bonus", "freelance work", "pocket money", "stipend", "interest", "refund",
               "cashback", "gift money", "rent income", "payment from client", "commission", "dividend",
               "freelance", "pay", "wages", "incentive", "allowance", "scholarship", "pension",
               "side income", "tuition income", "project payment", "overtime", "reward", "income",
               "salary credit", "monthly salary", "business profit", "profit", "earnings"],
}
EXPENSE_CATEGORIES = ["Food", "Travel", "Bills", "Shopping"]
ALL_EXPENSE_ITEMS = [i for c in EXPENSE_CATEGORIES for i in ITEMS[c]]
INCOME_WORDS = ITEMS["Salary"]
FILTER_WORDS = ["food", "travel", "bills", "shopping", "all"]

PREFIX = ["", "", "", "", "please ", "pls ", "can you ", "could you ", "hey ", "hi ", "ok ", "bro ",
          "kindly ", "assistant ", "i want to ", "tell me "]
SUFFIX = ["", "", "", "", "", " please", " pls", " now", " ok"]


# ---------------------------------------------------------------- helpers
def amount():
    n = rng.choice([rng.randint(10, 99), rng.randint(100, 999),
                    rng.randint(1000, 9999), rng.randint(10000, 50000)])
    style = rng.random()
    if style < 0.60:
        return str(n)
    if style < 0.72:
        return f"{n:,}"
    if style < 0.82 and n >= 1000:
        return f"{round(n / 1000, 1):g}k"
    if style < 0.92:
        return "rs " + str(n)
    return "₹" + str(n)


def typo(text):
    """randomly damages one word, like a real person typing fast"""
    words = text.split()
    spots = [i for i, w in enumerate(words) if len(w) >= 4 and w.isalpha()]
    if not spots:
        return text
    i = rng.choice(spots)
    w = words[i]
    k = rng.randint(1, len(w) - 2)
    kind = rng.choice(["drop", "swap", "double"])
    if kind == "drop":
        w = w[:k] + w[k + 1:]
    elif kind == "swap":
        w = w[:k] + w[k + 1] + w[k] + w[k + 2:]
    else:
        w = w[:k] + w[k] + w[k:]
    words[i] = w
    return " ".join(words)


def decorate(text):
    text = rng.choice(PREFIX) + text + rng.choice(SUFFIX)
    if rng.random() < 0.10:
        text = typo(text)
    return text.strip()


# ---------------------------------------------------------------- templates
def fill(template, **extra):
    return template.format(a=amount(), i=rng.choice(ALL_EXPENSE_ITEMS),
                           inc=rng.choice(INCOME_WORDS), p=rng.choice([50, 60, 70, 75, 80, 85, 90, 95, 100]),
                           c=rng.choice(FILTER_WORDS), **extra)


TEMPLATES = {
    "add_expense": [
        "i spent {a} on {i}", "spent {a} for {i}", "add {a} for {i}", "add expense {a} {i}",
        "paid {a} for {i}", "bought {i} for {a}", "{i} {a}", "{a} on {i}", "i paid {a} on {i}",
        "add {i} {a} expense", "just spent {a} on {i}", "spent {a} on {i} today",
        "yesterday i spent {a} on {i}", "expense {i} {a}", "i bought {i} worth {a}",
        "record {a} spent on {i}", "{i} cost me {a}", "note down {a} for {i}", "log {a} {i}",
        "spent {a} rupees on {i}", "i used {a} for {i}", "paid {a} {i}", "add new expense {i} {a}",
        "{i} {a} paid", "i gave {a} for {i}", "put {a} for {i} in expenses", "spend {a} {i}",
    ],
    "add_income": [
        "i got {a} {inc}", "received {a} {inc}", "add income {a} {inc}", "i earned {a} from {inc}",
        "got {a} as {inc}", "credited {a} {inc}", "add {a} to my income", "my {inc} {a} came",
        "{inc} credited {a}", "income {a}", "i received {a} from {inc}", "{inc} {a} received",
        "earned {a} today", "add income {a}", "new income {inc} {a}", "{a} {inc} received today",
        "i got paid {a}", "{inc} of {a} arrived", "add {inc} {a}", "i made {a} from {inc}",
        "money came {a} {inc}", "deposit {a} {inc}",
    ],
    "delete": [
        "delete {i}", "remove {i}", "delete the {i} expense", "remove my {i} transaction",
        "delete {i} entry", "erase {i}", "delete last transaction", "remove the last expense",
        "delete latest entry", "cancel {i}", "delete {a} {i}", "remove {i} of {a}",
        "get rid of {i}", "undo the last one", "delete the last one", "remove last entry",
        "delete recent transaction", "remove the {i}", "delete my {i} spending", "drop {i}",
        "please remove {a} {i}", "delete previous expense", "i want to delete {i}",
    ],
    "highest": [
        "what is my highest spend", "show highest expense", "biggest expense", "where did i spend the most",
        "which is my top spending", "max expense", "most expensive thing i bought", "largest spending",
        "high spend", "what was my costliest purchase", "highest spending category",
        "which category costs most", "top expense", "show me the highest spending", "my biggest spend",
        "what is the maximum i spent", "highest expense this month", "where did most money go",
        "which expense is the biggest", "most spent category", "tell me my high expense",
        "show high spend", "greatest expense", "what is my largest expense",
        "maximum spend", "maximum spending", "max spending", "highest spending", "top spend",
        "biggest spend", "most expensive expense",
    ],
    "lowest": [
        "what is my lowest spend", "show lowest expense", "smallest expense", "where did i spend the least",
        "which is my least spending", "min expense", "cheapest thing i bought", "smallest spending",
        "low spend", "what was my cheapest purchase", "lowest spending category",
        "which category costs least", "lowest expense this month", "show me the lowest spending",
        "my smallest spend", "what is the minimum i spent", "least amount i spent",
        "which expense is the smallest", "least spent category", "tell me my low expense",
        "show low spend", "tiniest expense", "what is my smallest expense",
        "minimum spending", "minimum expense", "min spending", "least spend", "smallest spend",
        "least expense", "lowest spending",
    ],
    "budget_usage": [
        "how much of my money is used", "{p}% of money used", "i used {p} percent of my money",
        "have i used {p}% of my money", "how much percent spent", "am i overspending",
        "budget status", "how much budget used", "is my money almost finished", "money used percentage",
        "check my spending limit", "did i cross {p} percent", "am i running out of money",
        "what percent of income is spent", "spending percentage", "how much have i used",
        "{p} percent money used", "how much money is used", "what percentage of my money is gone",
        "is {p}% of my income used", "check budget", "tell me how much money i used",
        "alert me if {p}% money is used", "money used so far", "have i spent most of my money",
        "how much of my salary is used", "percent of money used",
    ],
    "summary": [
        "what is my balance", "how much money is left", "show balance", "money left",
        "remaining amount", "how much do i have", "total expense", "total income",
        "how much did i spend in total", "my monthly spending", "how much i spent this month",
        "summary", "show summary", "total spent this month", "what is my total spending",
        "how much money do i have left", "balance please", "show my total expense", "what is left",
        "how much did i earn this month", "give me a summary", "tell me my balance",
        "how much money remains", "monthly summary", "my expense this month", "how much i spend in month",
    ],
    "filter": [
        "show {c} expenses", "filter {c}", "only {c}", "show me {c}", "list {c} transactions",
        "show all transactions", "show everything", "clear filter", "{c} only", "display all",
        "go to {c}", "show only {c} spending", "show {c}", "filter by {c}", "display {c} list",
        "reset filter", "show {c} transactions", "view {c}", "see all", "remove filter",
    ],
    "greeting": [
        "hi", "hello", "hey", "good morning", "good evening", "good afternoon", "hey there", "thanks",
        "thank you", "bye", "ok thanks", "hello assistant", "hii", "yo", "hi there", "thanks a lot",
        "good night", "see you", "thank you so much", "hello friend", "hey buddy", "vanakkam",
    ],
    "help": [
        "help", "what can you do", "how to use", "what are the commands", "how do you work",
        "i need help", "show commands", "guide me", "how can you help me", "what can i ask you",
        "help me please", "what are your features", "how to use this assistant", "give me examples",
        "who are you", "what do you do", "how does this work", "i am confused",
    ],
    "other": [
        "what is the weather today", "tell me a joke", "who is the prime minister", "play some music",
        "asdf qwer", "how old are you", "what is the capital of france", "sing a song",
        "book a movie ticket", "random words here", "open youtube", "translate hello to tamil",
        "who won the cricket match", "what is the time now", "write a poem", "i like cats",
        "how tall is mount everest", "call my friend", "set an alarm", "what is two plus two",
        "send a message to mom", "which is the best phone", "explain machine learning", "zzz",
        "lorem ipsum dolor", "what is your favourite colour", "turn on the lights", "show me a picture",
        "tell me a story", "how to cook rice", "recommend a movie", "what day is it",
    ],
}

SAMPLES_PER_INTENT = 500


def make_intent_rows():
    rows = []
    for intent, templates in TEMPLATES.items():
        seen = set()
        tries = 0
        while len(seen) < SAMPLES_PER_INTENT and tries < 20000:
            tries += 1
            text = decorate(fill(rng.choice(templates)))
            seen.add(text)
        rows += [(t, intent) for t in sorted(seen)]
    rng.shuffle(rows)
    return rows


# ---------------------------------------------------------------- category data
WRAPPERS = ["{w}", "my {w}", "{w} payment", "new {w}", "{w} expense", "monthly {w}", "bought {w}",
            "{w} today", "paid {w}", "the {w}", "{w} bill", "{w} charges", "some {w}", "{w} again"]


def make_category_rows():
    rows = []
    for category, words in ITEMS.items():
        seen = set()
        for w in words:
            for wrapper in WRAPPERS:
                seen.add(wrapper.format(w=w))
        seen.add(category.lower())
        rows += [(t, category) for t in sorted(seen)]
    rng.shuffle(rows)
    return rows


def save(rows, name):
    path = os.path.join(BASE, "data", name)
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["text", "label"])
        writer.writerows(rows)
    print(f"  wrote {len(rows)} rows -> data/{name}")


def main():
    os.makedirs(os.path.join(BASE, "data"), exist_ok=True)
    print("Creating training data ...")
    save(make_intent_rows(), "intent.csv")
    save(make_category_rows(), "category.csv")


if __name__ == "__main__":
    main()
