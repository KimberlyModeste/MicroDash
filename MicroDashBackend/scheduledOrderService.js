
function createScheduledOrderService({ orders, clock }) {
  function releaseEligibleOrders() {
    // const now = clock.now;
    const now = clock.now();
    const releasedOrderIds = [];

    for (const order of orders) {
      // Only scheduled orders may be released.
      if (order.status !== "scheduled") {
        continue;
      }

      if (!order.releaseAt) {
        continue;
      }

      const releaseTime = new Date(order.releaseAt);

      if (Number.isNaN(releaseTime.getTime())) {
        continue;
      }

      // The order becomes eligible exactly at releaseAt.
      if (now.getTime() >= releaseTime.getTime()) {
        order.status = "placed";
        order.releasedAt = now.toISOString();

        releasedOrderIds.push(order.id);
      }
    }

    return releasedOrderIds;
  }

  return { releaseEligibleOrders };
}

function startReleaseScheduler(service, intervalMs = 5000) {
  const timer = setInterval(() => {
    try {
      const releasedIds = service.releaseEligibleOrders();

      if (releasedIds.length > 0) {
        console.log("Released scheduled orders:", releasedIds);
      }
    } catch (error) {
      console.error("Scheduled-order release failed:", error);
    }
  }, intervalMs);

  return () => clearInterval(timer);
}

module.exports = {
  createScheduledOrderService,
  startReleaseScheduler,
};
