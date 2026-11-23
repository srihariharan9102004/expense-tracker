"""
model.py  -  a small neural network written from scratch with only NumPy.

Shape of the network:

    sentence --> features (0/1 vector, one slot per known word/word-pair)
             --> hidden layer  (H neurons, ReLU)
             --> output layer  (one neuron per label)
             --> softmax       (turns scores into probabilities that add up to 1)

Learning = repeat many times:
    1. forward pass : make a prediction
    2. loss         : how wrong was it?  (cross-entropy)
    3. backward pass: find how each weight should change to be less wrong (gradients)
    4. update       : move every weight a tiny step in that direction
"""
import numpy as np
from nlp import tokenize, features


class TextClassifier:
    def __init__(self, labels, hidden=24, seed=1):
        self.labels = list(labels)
        self.hidden = hidden
        self.rng = np.random.default_rng(seed)
        self.vocab = []      # list of known features
        self.index = {}      # feature -> position in the vector
        self.W1 = self.b1 = self.W2 = self.b2 = None

    # ---------- text -> numbers ----------
    def build_vocab(self, texts, min_count=2):
        counts = {}
        for text in texts:
            for f in features(tokenize(text)):
                counts[f] = counts.get(f, 0) + 1
        # a feature seen only once is probably noise, so we skip it
        self.vocab = sorted(f for f, c in counts.items() if c >= min_count)
        self.index = {f: i for i, f in enumerate(self.vocab)}

    def vectorize(self, texts):
        X = np.zeros((len(texts), len(self.vocab)))
        for row, text in enumerate(texts):
            for f in features(tokenize(text)):
                i = self.index.get(f)
                if i is not None:          # unknown words are simply ignored
                    X[row, i] = 1.0
        return X

    def encode(self, labels):
        return np.array([self.labels.index(l) for l in labels])

    # ---------- the network ----------
    def init_weights(self):
        V, H, K = len(self.vocab), self.hidden, len(self.labels)
        self.W1 = self.rng.normal(0, 0.1, (V, H))
        self.b1 = np.zeros(H)
        self.W2 = self.rng.normal(0, 1 / np.sqrt(H), (H, K))
        self.b2 = np.zeros(K)

    def forward(self, X):
        z1 = X @ self.W1 + self.b1
        a1 = np.maximum(0, z1)                      # ReLU
        z2 = a1 @ self.W2 + self.b2
        z2 = z2 - z2.max(axis=1, keepdims=True)     # for numeric stability
        e = np.exp(z2)
        p = e / e.sum(axis=1, keepdims=True)        # softmax
        return z1, a1, p

    def score(self, X, y):
        """returns (loss, accuracy) for a dataset"""
        _, _, p = self.forward(X)
        loss = -np.log(p[np.arange(len(y)), y] + 1e-12).mean()
        acc = (p.argmax(axis=1) == y).mean()
        return loss, acc

    # ---------- training ----------
    def fit(self, train_texts, train_labels, val_texts, val_labels,
            epochs=200, lr=0.1, batch_size=64, momentum=0.9,
            weight_decay=1e-4, patience=15, verbose=True):

        self.build_vocab(train_texts)
        self.init_weights()
        X, y = self.vectorize(train_texts), self.encode(train_labels)
        Xv, yv = self.vectorize(val_texts), self.encode(val_labels)
        Y = np.eye(len(self.labels))[y]             # one-hot answers

        params = [self.W1, self.b1, self.W2, self.b2]
        velocity = [np.zeros_like(p) for p in params]

        best_loss, best_weights, waited = 1e9, None, 0

        for epoch in range(1, epochs + 1):
            order = self.rng.permutation(len(X))    # shuffle every epoch
            for start in range(0, len(X), batch_size):
                idx = order[start:start + batch_size]
                xb, yb = X[idx], Y[idx]
                m = len(idx)

                # forward
                z1, a1, p = self.forward(xb)

                # backward (the chain rule, layer by layer)
                dz2 = (p - yb) / m
                dW2 = a1.T @ dz2 + weight_decay * self.W2
                db2 = dz2.sum(axis=0)
                da1 = dz2 @ self.W2.T
                dz1 = da1 * (z1 > 0)
                dW1 = xb.T @ dz1 + weight_decay * self.W1
                db1 = dz1.sum(axis=0)

                # update every weight a small step downhill
                grads = [dW1, db1, dW2, db2]
                for i, (param, grad) in enumerate(zip(params, grads)):
                    velocity[i] = momentum * velocity[i] - lr * grad
                    param += velocity[i]

            tr_loss, tr_acc = self.score(X, y)
            va_loss, va_acc = self.score(Xv, yv)
            if verbose and (epoch == 1 or epoch % 10 == 0):
                print(f"  epoch {epoch:3d} | train loss {tr_loss:.4f} acc {tr_acc:.3f}"
                      f" | val loss {va_loss:.4f} acc {va_acc:.3f}")

            # early stopping: keep the weights that did best on data it never trained on
            if va_loss < best_loss - 1e-4:
                best_loss, waited = va_loss, 0
                best_weights = [p.copy() for p in params]
            else:
                waited += 1
                if waited >= patience:
                    if verbose:
                        print(f"  stopped early at epoch {epoch} (val loss stopped improving)")
                    break

        self.W1, self.b1, self.W2, self.b2 = best_weights

    # ---------- using the trained model ----------
    def predict_proba(self, text):
        _, _, p = self.forward(self.vectorize([text]))
        return p[0]

    def predict(self, text):
        p = self.predict_proba(text)
        i = int(p.argmax())
        return self.labels[i], float(p[i]), {l: float(v) for l, v in zip(self.labels, p)}

    # ---------- save / load ----------
    def to_dict(self):
        r = lambda a: np.round(a, 4).tolist()
        return {"labels": self.labels, "vocab": self.vocab,
                "W1": r(self.W1), "b1": r(self.b1), "W2": r(self.W2), "b2": r(self.b2)}

    @classmethod
    def from_dict(cls, d):
        clf = cls(d["labels"], hidden=len(d["b1"]))
        clf.vocab = d["vocab"]
        clf.index = {f: i for i, f in enumerate(clf.vocab)}
        clf.W1, clf.b1 = np.array(d["W1"]), np.array(d["b1"])
        clf.W2, clf.b2 = np.array(d["W2"]), np.array(d["b2"])
        return clf
