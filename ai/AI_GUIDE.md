# Build-an-AI guide (from scratch, no API)

You are training your own small neural network with NumPy, saving its numbers in a file, and the website reads that file.

> Honest note: this is not a chatbot that can talk about anything. It is a small model that
> **understands money commands** ("spent 500 on pizza", "delete lunch", "highest spend").
> The model decides *what you want*; short rules fetch the amount and item; the reply text is
> written by us. That is how many real assistants (Alexa-style) work.

## 1. The big picture

```
 "i spent 500 on pizza"
        |
        v   nlp.py        tokenize        ["i","spent","<num>","on","pizza"]
        v   nlp.py        features        {"spent", "pizza", "spent <num>", ...}
        v   model.py      neural network  -> add_expense 99%, summary 0.3% ...
        v   agent.js      rules           amount = 500, title = "Pizza"
        v   model.py      category model  -> Food
        v   AgentChat     action          add { Pizza, 500, expense, Food }
```

Two small networks are trained:
| Model | Question it answers | Labels |
|---|---|---|
| intent | what does the user want? | add_expense, add_income, delete, highest, lowest, budget_usage, summary, filter, greeting, help, other |
| category | which category is this item? | Food, Travel, Bills, Shopping, Salary |

## 2. Run it (3 commands)

```bash
cd ai
pip install numpy
python train.py          # makes data, trains, tests, saves ../src/agent/model.json
python chat_terminal.py  # talk to the model and watch its probabilities
```
Then `npm run dev`, click **Ask AI** (bottom right).

Every time you change the data or settings: run `python train.py --regen` again.

## 3. The ideas, in plain words

**Tokenizing** - cut a sentence into words. All numbers become `<num>`, so "500" and "20000"
look the same: the model should learn "a number is here", not memorise every amount.

**Features (bag of words)** - the model does not read order, it only checks *which words
and word-pairs are present*. Pairs ("spent <num>", "how much") keep a little order.
Each known word/pair is one slot in a long 0/1 list. A sentence lights up a few slots.

**Neuron / layer** - a neuron multiplies each input by a *weight*, adds them up, and
passes the result on. Our network: inputs -> 24 hidden neurons (ReLU: negatives become 0)
-> one output score per label.

**Softmax** - turns the output scores into probabilities that add up to 100%.
"add_expense 99%" means the network is very sure.

**Weights** - the only thing the model "knows" is these numbers (about 50,000 for the intent
model). Training = finding good values for them. They start random.

**Loss (cross-entropy)** - one number saying how wrong the model is. Right and confident
-> near 0. Wrong and confident -> big.

**Gradient descent / backpropagation** - for each weight, the maths tells us
"if I increase you a bit, does the loss go up or down?" (that is the gradient). Then every weight
takes a tiny step (the *learning rate*) in the direction that lowers the loss. Doing this layer by
layer from the output backwards is *backpropagation*. You can read it in `model.py`, in the
"backward" lines: they are only 6 lines.

**Epoch** - one full pass over all training sentences. We do many epochs and print the loss.

**Train / validation / test** - never judge a model on what it studied.
- train 80%: the model learns from it
- validation 10%: checked after each epoch; tells us when to stop
- test 10%: final check on the generated data
- **human test** (`data/test_*.csv`): sentences *I wrote by hand*, never used for training.
  This is the honest score. Our result: **intent 100/101, category 46/49**.

**Overfitting** - the model memorises the training sentences and fails on new ones. Sign: train
accuracy 100% but validation loss rises. We use *early stopping* (keep the best weights) and a
small weight decay to prevent it.

**Where does the training data come from?** `make_data.py` fills templates:
"i spent {amount} on {item}" -> thousands of sentences, with typos and polite words added
(*data augmentation*). Real products collect real user messages; templates are the beginner way.

## 4. Code map

| File | What it does |
|---|---|
| `ai/nlp.py` | tokenizer + features |
| `ai/make_data.py` | word lists + templates -> `data/intent.csv`, `data/category.csv` |
| `ai/model.py` | the neural network: forward, backward, training loop, save/load |
| `ai/train.py` | splits data, trains both models, tests, writes `src/agent/model.json` |
| `ai/evaluate.py` | accuracy on the human-written test files |
| `ai/chat_terminal.py` | try the model in the terminal |
| `src/agent/nlp.js` | same tokenizer in JavaScript |
| `src/agent/classifier.js` | the forward pass in JavaScript (loads `model.json`) |
| `src/agent/agent.js` | intent -> amount/title/target -> reply + action |
| `src/components/agent/AgentChat.jsx` | the chat box bottom right |

Training runs in Python once. The browser only does the forward pass (multiply and add), so it
needs no server and no API.

## 5. What the agent does with your sentences

| You say | Intent | Result |
|---|---|---|
| spent 500 on pizza | add_expense | adds Pizza, Food, 500 (top of the list) |
| got 20000 salary | add_income | adds income |
| delete lunch / delete last transaction | delete | removes the best matching transaction |
| highest spend / lowest spend | highest / lowest | biggest/smallest expense + category |
| how much money is used? / 90% of money used | budget_usage | expense / income as a percent |
| what is my balance / how much i spent this month | summary | income, expense, balance |
| show food / show all | filter | sets the filter button |

Warning: after every expense the agent checks the usage. At **90% or more** it adds a warning
(change `WARNING_PERCENT` in `agent.js`). Confidence below 50% -> it says it did not understand
instead of touching your money. "add 300" (expense or income?) -> it asks.

## 6. Make it smarter (your exercises)

1. **Teach a new word.** The agent put "pani puri" in Food only because "puri" is in the word list.
   Add words to `ITEMS` in `make_data.py` (e.g. "scooter" in Travel), run
   `python train.py --regen`. Check with `chat_terminal.py`.
2. **Fix a mistake.** The category test said "wifi" -> Food (only 41% sure). Add more Bills words ("wifi",
   "internet pack"...) to the Bills list and train again. See the score go up.
3. **Add an intent**, e.g. `set_budget` ("set my budget to 20000"):
   - add a list of templates in `TEMPLATES` in `make_data.py`
   - add test sentences in `data/test_intent.csv`
   - retrain
   - add a handler function and an entry in `HANDLERS` in `agent.js`
4. **Change the settings** in `train.py` / `model.py`: hidden size (24), learning rate (0.1),
   epochs. Watch the loss lines. Too high a learning rate makes loss jump; too low makes it crawl.
5. **Break it on purpose.** Remove the 'other' templates and train: the model will now answer
   "tell me a joke" with some money intent. Models only know what you teach them.

## 7. Limits (so you can explain them honestly)

- It does not know words it never saw in training (ignored, then low confidence).
- It reads numbers as digits ("500", "2k"), not words ("five hundred").
- Replies are written templates, not generated text. Generating free text needs a language
  model with millions of parameters and huge data. This project is the right first step.
- Training data is synthetic (templates). A real app should add real user sentences.

## 8. Glossary
token, feature, vocabulary, weight, bias, layer, activation (ReLU), softmax, loss, gradient,
learning rate, epoch, batch, overfitting, early stopping, train/validation/test split.
