# Expense Tracker

React + Vite expense tracker with a small AI assistant (bottom right) that runs on a model
trained from scratch with NumPy. No outside API.

```bash
npm install
npm run dev
```

## Train the AI
```bash
cd ai
pip install numpy
python train.py              # writes src/agent/model.json
python chat_terminal.py      # try it in the terminal
```
Read `ai/AI_GUIDE.md` to learn how it works.

## Try in the chat box
spent 500 on pizza | got 20000 salary | delete lunch | highest spend | lowest spend |
how much money is used? | what is my balance | show food | show all
