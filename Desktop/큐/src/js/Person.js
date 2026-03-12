class Person {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.joinedAt = new Date();
  }

  toString() {
    return `${this.id}번 ${this.name}`;
  }

  getWaitTime() {
    const diff = Date.now() - this.joinedAt.getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}초`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}분 ${seconds % 60}초`;
  }
}
