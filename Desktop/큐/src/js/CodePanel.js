class CodePanel {
  constructor(codeElement, logElement) {
    this.codeElement = codeElement;
    this.logElement = logElement;
    this.lineElements = [];
    this.methodLineMap = {
      enqueue: [7, 8, 9, 10, 11],
      dequeue: [13, 14, 15, 16, 17, 18, 19],
      peek: [21, 22, 23, 24, 25, 26, 27],
      size: [29, 30, 31, 32],
      isEmpty: [34, 35, 36, 37],
    };
    this.highlightTimer = null;
  }

  render() {
    const codeLines = [
      'class Queue {                      // 큐 클래스 선언',
      '  constructor() {',
      '    this.items = [];               // 빈 배열 = 빈 줄',
      '  }',
      '',
      '  // ✅ 줄 맨 뒤에 새 사람 추가',
      '  enqueue(person) {                // "인큐"라고 읽어요',
      '    this.items.push(person);       // 배열 맨 뒤에 넣기',
      '  }',
      '  //   📌 push() = 배열 끝에 추가하는 함수',
      '',
      '  // ✅ 맨 앞 사람을 꺼내서 입장시킴',
      '  dequeue() {                      // "디큐"라고 읽어요',
      '    if (this.isEmpty()) {          // 줄이 비어있으면?',
      '      return null;                 //   → 꺼낼 사람 없음!',
      '    }',
      '    return this.items.shift();     // 배열 맨 앞에서 꺼내기',
      '  }',
      '  //   📌 shift() = 배열 맨 앞을 꺼내는 함수',
      '',
      '  // ✅ 맨 앞 사람 살짝 확인만 (빠지지 않음!)',
      '  peek() {                         // "픽"이라고 읽어요',
      '    if (this.isEmpty()) {',
      '      return null;',
      '    }',
      '    return this.items[0];          // 맨 앞(0번째)만 확인',
      '  }',
      '',
      '  // ✅ 지금 몇 명이 줄 서있는지',
      '  size() {',
      '    return this.items.length;      // 배열 길이 = 줄 길이',
      '  }',
      '',
      '  // ✅ 줄이 비어있는지 확인',
      '  isEmpty() {',
      '    return this.items.length === 0; // 0명이면 true',
      '  }',
      '}',
    ];

    this.codeElement.innerHTML = '';
    this.lineElements = [];

    codeLines.forEach((line, index) => {
      const lineEl = document.createElement('div');
      lineEl.className = 'code-line';

      const numEl = document.createElement('span');
      numEl.className = 'line-number';
      numEl.textContent = String(index + 1).padStart(2, ' ');

      const contentEl = document.createElement('span');
      contentEl.className = 'line-content';

      const parts = (line || ' ').split('//');
      if (parts.length > 1) {
        const codePart = document.createElement('span');
        codePart.className = 'code-keyword';
        codePart.textContent = parts[0];

        const commentPart = document.createElement('span');
        commentPart.className = 'code-comment';
        commentPart.textContent = '//' + parts.slice(1).join('//');

        contentEl.appendChild(codePart);
        contentEl.appendChild(commentPart);
      } else {
        contentEl.textContent = line || ' ';
      }

      lineEl.appendChild(numEl);
      lineEl.appendChild(contentEl);
      this.codeElement.appendChild(lineEl);
      this.lineElements.push(lineEl);
    });
  }

  highlight(methodName) {
    this.lineElements.forEach(el => el.classList.remove('code-highlight'));

    if (this.highlightTimer) {
      clearTimeout(this.highlightTimer);
    }

    const lines = this.methodLineMap[methodName];
    if (!lines) return;

    lines.forEach(lineNum => {
      if (this.lineElements[lineNum - 1]) {
        this.lineElements[lineNum - 1].classList.add('code-highlight');
      }
    });

    const firstHighlight = this.lineElements[lines[0] - 1];
    if (firstHighlight) {
      firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    this.highlightTimer = setTimeout(() => {
      this.lineElements.forEach(el => el.classList.remove('code-highlight'));
    }, 4000);
  }

  addLog(message) {
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';

    const timeStr = new Date().toLocaleTimeString('ko-KR');
    logEntry.innerHTML = `<span class="log-time">[${timeStr}]</span> ${message}`;

    this.logElement.insertBefore(logEntry, this.logElement.firstChild);

    logEntry.classList.add('log-entry-new');
    setTimeout(() => logEntry.classList.remove('log-entry-new'), 500);

    while (this.logElement.children.length > 20) {
      this.logElement.removeChild(this.logElement.lastChild);
    }
  }
}
