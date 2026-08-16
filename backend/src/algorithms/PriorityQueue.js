/**
 * PriorityQueue (Max-Heap) for NIRMAAN Smart Collection Scheduling
 * 
 * Orders bins by calculated Urgency Priority Score:
 * Score = (fillPercent * 0.50) + (riskFactor * 0.30) + (hoursSincePickup * 0.20)
 * 
 * CRITICAL (>90%) and fast-filling bins bubble to the top of the heap.
 */
export class PriorityQueue {
  constructor(comparator = (a, b) => a.priorityScore - b.priorityScore) {
    this.heap = [];
    this.comparator = comparator; // Default Max-Heap if returning positive when a > b
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  peek() {
    return this.heap[0] || null;
  }

  enqueue(item) {
    this.heap.push(item);
    this._bubbleUp(this.heap.length - 1);
  }

  dequeue() {
    if (this.isEmpty()) return null;
    const top = this.heap[0];
    const bottom = this.heap.pop();
    if (!this.isEmpty()) {
      this.heap[0] = bottom;
      this._bubbleDown(0);
    }
    return top;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parentIndex]) > 0) {
        [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  _bubbleDown(index) {
    const length = this.heap.length;
    while (true) {
      let target = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < length && this.comparator(this.heap[left], this.heap[target]) > 0) {
        target = left;
      }
      if (right < length && this.comparator(this.heap[right], this.heap[target]) > 0) {
        target = right;
      }

      if (target !== index) {
        [this.heap[index], this.heap[target]] = [this.heap[target], this.heap[index]];
        index = target;
      } else {
        break;
      }
    }
  }

  toArray() {
    return [...this.heap].sort((a, b) => this.comparator(b, a));
  }
}

/**
 * Calculates priority score for a Smart Bin based on real-time telematics
 */
export function calculateBinPriorityScore(bin) {
  const fill = bin.currentFill || 0;
  const eta = bin.overflowEtaHours !== undefined ? bin.overflowEtaHours : 24;
  const hoursSince = bin.lastCollectedHoursAgo || 12;

  // Overflow risk weighting: 100 if <= 2h, 75 if <= 4h, 50 if <= 8h, 20 otherwise
  let riskScore = 20;
  if (eta <= 2) riskScore = 100;
  else if (eta <= 4) riskScore = 80;
  else if (eta <= 8) riskScore = 55;
  else if (eta <= 16) riskScore = 35;

  // Critical status boost
  let statusBoost = 0;
  if (fill >= 90 || bin.status === 'CRITICAL') statusBoost = 25;
  else if (fill >= 75 || bin.status === 'HIGH') statusBoost = 15;

  const rawScore = (fill * 0.45) + (riskScore * 0.30) + (Math.min(hoursSince * 2, 50) * 0.15) + statusBoost;
  return Number(rawScore.toFixed(1));
}
