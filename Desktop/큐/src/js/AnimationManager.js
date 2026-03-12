class AnimationManager {
  constructor(queueContainer, admissionArea) {
    this.queueContainer = queueContainer;
    this.admissionArea = admissionArea;
    this.isAnimating = false;
  }

  async animateEnqueue(cardElement) {
    this.isAnimating = true;
    cardElement.classList.add('card-enqueue-enter');
    this.queueContainer.appendChild(cardElement);

    this._addArrows();

    await this._waitForAnimation(cardElement, 'animationend');
    cardElement.classList.remove('card-enqueue-enter');
    this.isAnimating = false;
  }

  async animateDequeue(cardElement) {
    this.isAnimating = true;
    cardElement.classList.add('card-dequeue-exit');

    await this._waitForAnimation(cardElement, 'animationend');
    cardElement.remove();
    this._addArrows();
    this.isAnimating = false;
  }

  animatePeek(cardElement) {
    cardElement.classList.add('card-peek-highlight');
    setTimeout(() => {
      cardElement.classList.remove('card-peek-highlight');
    }, 1500);
  }

  showAdmission(person) {
    this.admissionArea.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'admission-card';
    card.innerHTML = `
      <div class="admission-ticket">🎫</div>
      <div class="admission-info">
        <div class="admission-name">${person.toString()}</div>
        <div class="admission-status">예매 페이지 입장 완료!</div>
      </div>
    `;
    card.classList.add('admission-enter');
    this.admissionArea.appendChild(card);
  }

  clearAdmission() {
    this.admissionArea.innerHTML = `
      <div class="admission-empty">아직 아무도<br>입장하지 않았어요</div>
    `;
  }

  _addArrows() {
    const cards = this.queueContainer.querySelectorAll('.queue-card');
    const arrows = this.queueContainer.querySelectorAll('.queue-arrow');
    arrows.forEach(a => a.remove());

    cards.forEach((card, index) => {
      card.classList.remove('is-front', 'is-rear', 'is-only');

      if (cards.length === 1) {
        card.classList.add('is-only');
      } else if (index === 0) {
        card.classList.add('is-front');
      }
      if (index === cards.length - 1 && cards.length > 1) {
        card.classList.add('is-rear');
      }

      if (index < cards.length - 1) {
        const arrow = document.createElement('div');
        arrow.className = 'queue-arrow';
        arrow.textContent = '→';
        card.after(arrow);
      }
    });
  }

  _waitForAnimation(element, eventName) {
    return new Promise(resolve => {
      const handler = () => {
        element.removeEventListener(eventName, handler);
        resolve();
      };
      element.addEventListener(eventName, handler);
      setTimeout(resolve, 1000);
    });
  }
}
