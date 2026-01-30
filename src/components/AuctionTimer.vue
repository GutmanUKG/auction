<template>
  <div v-if="timeLeft || isExpired" class="auction-timer" :class="{ expired: isExpired }">
    <span v-if="!isExpired" class="timer-label">Осталось:</span>
    <span v-if="!isExpired" class="timer-value">{{ timeLeft }}</span>
    <span v-else class="timer-expired">Аукцион завершен</span>
  </div>
</template>

<script>
export default {
  name: 'AuctionTimer',
  props: {
    auctionStartDate: {
      type: String,
      required: true
    },
    auctionEndDate: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      timeLeft: '',
      isExpired: false,
      intervalId: null
    };
  },
  mounted() {
    this.updateTimer();
    this.intervalId = setInterval(this.updateTimer, 1000);
  },
  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
  methods: {
    updateTimer() {
      const now = new Date();
      const start = new Date(this.auctionStartDate);
      const end = new Date(this.auctionEndDate);

      // Проверка: если аукцион еще не начался, не показываем таймер
      if (now < start) {
        this.timeLeft = '';
        return;
      }

      const diff = end - now;

      if (diff <= 0) {
        this.isExpired = true;
        this.timeLeft = '';
        this.$emit('expired');
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        this.timeLeft = `${days}д ${hours}ч ${minutes}м`;
      } else if (hours > 0) {
        this.timeLeft = `${hours}ч ${minutes}м ${seconds}с`;
      } else if (minutes > 0) {
        this.timeLeft = `${minutes}м ${seconds}с`;
      } else {
        this.timeLeft = `${seconds}с`;
      }
    }
  }
};
</script>

<style scoped>
.auction-timer {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #e3f2fd;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #1976d2;
}

.auction-timer.expired {
  background: #ffebee;
  color: #c62828;
}

.timer-label {
  font-weight: 400;
  color: #666;
}

.timer-value {
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.timer-expired {
  font-weight: 600;
}
</style>
