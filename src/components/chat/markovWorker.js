// markovWorker.js - Web Worker for Markov Chain chat message generation

let chain = {};
let startWords = [];

function train(sentences) {
  chain = {};
  startWords = [];
  for (const sentence of sentences) {
    const words = sentence.split(/\s+/).filter(Boolean);
    if (words.length === 0) continue;
    startWords.push(words[0]);
    for (let i = 0; i < words.length - 1; i++) {
      const key = words[i].toLowerCase();
      if (!chain[key]) chain[key] = [];
      chain[key].push(words[i + 1]);
    }
    const lastWord = words[words.length - 1].toLowerCase();
    if (!chain[lastWord]) chain[lastWord] = [];
    chain[lastWord].push(null);
  }
}

function generate(maxWords = 20) {
  if (startWords.length === 0) return "";
  let word = startWords[Math.floor(Math.random() * startWords.length)];
  const result = [word];
  for (let i = 1; i < maxWords; i++) {
    const nextWords = chain[word.toLowerCase()];
    if (!nextWords || nextWords.length === 0) break;
    const next = nextWords[Math.floor(Math.random() * nextWords.length)];
    if (!next) break;
    result.push(next);
    word = next;
  }
  return result.join(" ");
}

self.onmessage = function(e) {
  const { type, data } = e.data;
  if (type === 'train') {
    train(data);
    self.postMessage({ type: 'trained' });
  } else if (type === 'generate') {
    const msg = generate();
    self.postMessage({ type: 'message', data: msg });
  }
};
