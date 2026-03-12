class QueueSimulator {
  constructor() {
    this.queue = new Queue();
    this.personCounter = 0;
    this.animationManager = null;
    this.koreanNames = [
      '홍길동', '김철수', '이영희', '박민수', '정수진',
      '강동원', '윤서연', '조현우', '한지민', '송중기',
      '김지은', '이준호', '최유리', '박서준', '장미란',
    ];
  }

  init() {
    const queueContainer = document.getElementById('queue-container');
    const admissionArea = document.getElementById('admission-area');

    this.animationManager = new AnimationManager(queueContainer, admissionArea);

    document.getElementById('btn-enqueue').addEventListener('click', () => this.handleEnqueue());
    document.getElementById('btn-dequeue').addEventListener('click', () => this.handleDequeue());
    document.getElementById('btn-peek').addEventListener('click', () => this.handlePeek());
    document.getElementById('btn-clear').addEventListener('click', () => this.handleClear());

    this.animationManager.clearAdmission();
    this._updateStatus();
    this._updateEmptyMessage();
  }

  async handleEnqueue() {
    if (this.animationManager.isAnimating) return;

    const name = this._randomName();
    const person = new Person(++this.personCounter, name);
    this.queue.enqueue(person);

    this._showExplain(
      '➡️',
      `<strong>${person}</strong>이(가) 줄 맨 뒤에 섰어요!`,
      'enqueue'
    );

    const card = this._createCard(person);
    await this.animationManager.animateEnqueue(card);
    this._updateStatus();
    this._updateEmptyMessage();
  }

  async handleDequeue() {
    if (this.animationManager.isAnimating) return;

    if (this.queue.isEmpty()) {
      this._showExplain(
        '⚠️',
        '줄이 비어있어서 입장시킬 사람이 없어요!',
        'error'
      );
      this._shakeButton('btn-dequeue');
      return;
    }

    const person = this.queue.dequeue();

    this._showExplain(
      '🚪',
      `맨 앞의 <strong>${person}</strong>이(가) 예매 페이지로 입장했어요!`,
      'dequeue'
    );

    const queueContainer = document.getElementById('queue-container');
    const firstCard = queueContainer.firstElementChild;
    if (firstCard) {
      await this.animationManager.animateDequeue(firstCard);
    }
    this.animationManager.showAdmission(person);
    this._updateStatus();
    this._updateEmptyMessage();
  }

  handlePeek() {
    if (this.queue.isEmpty()) {
      this._showExplain(
        '⚠️',
        '줄이 비어있어서 확인할 사람이 없어요!',
        'error'
      );
      return;
    }

    const person = this.queue.peek();

    this._showExplain(
      '👀',
      `맨 앞에 <strong>${person}</strong>이(가) 있어요! (확인만, 줄에서 안 빠져요)`,
      'peek'
    );

    const queueContainer = document.getElementById('queue-container');
    const firstCard = queueContainer.firstElementChild;
    if (firstCard) {
      this.animationManager.animatePeek(firstCard);
    }
    this._updateStatus();
  }

  handleClear() {
    this.queue.clear();
    const queueContainer = document.getElementById('queue-container');
    queueContainer.innerHTML = '';
    this.animationManager.clearAdmission();
    this.personCounter = 0;
    this._showExplain(
      '🗑️',
      '대기열을 완전히 비웠어요! 처음부터 다시 해볼까요?',
      'clear'
    );
    this._updateStatus();
    this._updateEmptyMessage();
  }

  _updateStatus() {
    const peekPerson = this.queue.peek();
    const peekEl = document.getElementById('status-peek');
    const sizeEl = document.getElementById('status-size');
    const emptyEl = document.getElementById('status-empty');

    peekEl.textContent = peekPerson ? peekPerson.toString() : '없음';
    sizeEl.innerHTML = this.queue.size() + '<small>명</small>';

    if (this.queue.isEmpty()) {
      emptyEl.innerHTML = '<span class="badge badge-true">네</span>';
    } else {
      emptyEl.innerHTML = '<span class="badge badge-false">아니요</span>';
    }

    peekEl.className = 'status-value' + (peekPerson ? ' has-value' : '');
  }

  _updateEmptyMessage() {
    const msg = document.getElementById('queue-empty-msg');
    const container = document.getElementById('queue-container');
    if (this.queue.isEmpty()) {
      msg.style.display = 'block';
      container.style.display = 'none';
    } else {
      msg.style.display = 'none';
      container.style.display = 'flex';
    }
  }

  _createCard(person) {
    const card = document.createElement('div');
    card.className = 'queue-card';
    card.setAttribute('data-person-id', person.id);
    card.setAttribute('role', 'listitem');

    card.innerHTML = `
      <div class="card-number">${person.id}</div>
      <div class="card-avatar">🧑</div>
      <div class="card-info">
        <div class="card-name">${person.name}</div>
        <div class="card-time">방금 도착</div>
      </div>
    `;
    return card;
  }

  _randomName() {
    return this.koreanNames[Math.floor(Math.random() * this.koreanNames.length)];
  }

  _shakeButton(buttonId) {
    const btn = document.getElementById(buttonId);
    btn.classList.add('btn-shake');
    setTimeout(() => btn.classList.remove('btn-shake'), 500);
  }

  _showExplain(icon, text, type) {
    const banner = document.getElementById('explain-banner');
    const iconEl = document.getElementById('explain-icon');
    const textEl = document.getElementById('explain-text');

    iconEl.textContent = icon;
    textEl.innerHTML = text;

    banner.className = 'explain-banner explain-' + type;

    clearTimeout(this._explainTimer);
    this._explainTimer = setTimeout(() => {
      banner.classList.add('explain-fade-out');
      setTimeout(() => {
        banner.className = 'explain-banner hidden';
      }, 400);
    }, 3000);
  }
}
