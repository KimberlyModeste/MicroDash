
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createScheduledOrderService
} = require("./scheduledOrderService");

function createTestSetup() {
  let currentTime = new Date("2026-10-25T17:00:00Z");

  const clock = {
    now: () => new Date(currentTime)
  };

  const orders = [
    {
      id: "1",
      restaurantId: "5",
      status: "SCHEDULED",
      releaseAt: "2026-10-25T17:30:00.000Z",
      releasedAt: null
    },
    {
      id: "2",
      restaurantId: "5",
      status: "CANCELLED",
      releaseAt: "2026-10-25T17:30:00.000Z",
      releasedAt: null
    }
  ];

  const service = createScheduledOrderService({
    orders,
    clock
  });

  return {
    orders,
    service,
    setTime: (time) => {
      currentTime = new Date(time);
    }
  };
}

test("does not release an order before releaseAt", () => {
  const { orders, service } = createTestSetup();

  const released = service.releaseEligibleOrders();

  assert.deepEqual(released, []);
  assert.equal(orders[0].status, "SCHEDULED");
});

test("releases an order exactly at releaseAt", () => {
  const { orders, service, setTime } = createTestSetup();

  setTime("2026-10-25T17:30:00Z");

  const released = service.releaseEligibleOrders();

  assert.deepEqual(released, ["1"]);
  assert.equal(orders[0].status, "PLACED");
  assert.equal(
    orders[0].releasedAt,
    "2026-10-25T17:30:00.000Z"
  );
});

test("does not release the same order twice", () => {
  const { orders, service, setTime } = createTestSetup();

  setTime("2026-10-25T17:30:00Z");

  service.releaseEligibleOrders();

  const secondRun = service.releaseEligibleOrders();

  assert.deepEqual(secondRun, []);
  assert.equal(orders[0].status, "PLACED");
});

test("never releases a cancelled order", () => {
  const { orders, service, setTime } = createTestSetup();

  setTime("2026-10-25T18:00:00Z");

  const released = service.releaseEligibleOrders();

  assert.equal(released.includes("2"), false);
  assert.equal(orders[1].status, "CANCELLED");
});

test("releases an overdue scheduled order on the next run", () => {
  const { orders, service, setTime } = createTestSetup();

  setTime("2026-10-25T17:45:00Z");

  const released = service.releaseEligibleOrders();

  assert.deepEqual(released, ["1"]);
  assert.equal(orders[0].status, "PLACED");
});
