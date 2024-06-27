document.addEventListener('DOMContentLoaded', function () {
    let summarizeClickCount = 0;

    window.summarizeText = function summarizeText() {
        let inputText = document.getElementById('inputText').value;
        if (inputText.trim() === '') {
            alert('Please enter some text to summarize.');
            return;
        }

        // If this is not the first click, use the already summarized text as input
        if (summarizeClickCount > 0) {
            inputText = document.getElementById('outputText').innerText;
        }

        const sentences = inputText.split('.').filter(sentence => sentence.trim() !== '');
        const wordFrequency = {};
        const stopWords = new Set(['the', 'is', 'in', 'and', 'to', 'of', 'a', 'that', 'it', 'on', 'for', 'with', 'as', 'was', 'but', 'by', 'an', 'be', 'this', 'which', 'or', 'from', 'at', 'are', 'not']);

        // Calculate word frequency excluding stop words
        sentences.forEach(sentence => {
            const words = sentence.split(' ');
            words.forEach(word => {
                word = word.toLowerCase().replace(/[^a-z]/g, '');
                if (word && !stopWords.has(word)) {
                    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
                }
            });
        });

        // Score sentences based on word frequency
        const sentenceScores = sentences.map(sentence => {
            let score = 0;
            const words = sentence.split(' ');
            words.forEach(word => {
                word = word.toLowerCase().replace(/[^a-z]/g, '');
                if (word && wordFrequency[word]) {
                    score += wordFrequency[word];
                }
            });
            return { sentence, score };
        });

        // Sort sentences by score and select the top 3 sentences or fewer if there are not enough sentences
        sentenceScores.sort((a, b) => b.score - a.score);
        const topSentences = sentenceScores.slice(0, Math.max(1, Math.ceil(sentenceScores.length / 3))).map(item => item.sentence);

        const summary = topSentences.join('. ') + '.';
        document.getElementById('outputText').innerText = summary;

        summarizeClickCount++;
    }
});
