import  {test, expect} from "@playwright/test"
// const { request } = require("node:http");
console.log("Here")

const API_URL = "http://localhost:3000";

// Reset the clock before each test.
test.beforeEach(async ({ request }) => {
  const response = await request.post(`${API_URL}/clock`, {
    data: { minutes: 0 },
  });

  expect(response.ok()).toBeTruthy();
});

//check what happens when you get to release at after an order has beeen canceled and another test (make one up).
test("A released scheduled order cannot be cancelled", async ({
	request,
}) => {
	const clockRes = await request.post(`${API_URL}/clock`, {
		data: {minutes: 0},
	});

	const ClockData = await clockRes.json()
	const now = new Date(ClockData.simulatedTime);


	const deliveryTime = new Date(now.getTime() + 60 * 60* 1000).toISOString();

	const createResponse = await request.post(`${API_URL}/orders`, {
		data: {
			name: "Tester Test",
			deliveryAddress: "123 Testing street",
			items: [
				{
          restaurantId: "1",
          menuItemId: "101",
          quantity: 1,
        },
			],
        scheduledDeliveryTime: deliveryTime,
		}
	});

  expect(createResponse.status(), await createResponse.text()).toBe(201);
  const order = await createResponse.json();

  expect(order.status).toBe("scheduled");
  expect(order.releaseAt).toBeTruthy();

  // Advance 30 minutes to the scheduled release boundary.
  const advanceResponse = await request.post(`${API_URL}/clock`, {
    data: { minutes: 30 },
  });

  expect(advanceResponse.ok()).toBeTruthy();

  const advanceData = await advanceResponse.json();
  expect(advanceData.releasedIds).toContain(order.id);

  // Confirm release.
  const releasedResponse = await request.get(
    `${API_URL}/orders/${order.id}`
  );

  expect(releasedResponse.ok()).toBeTruthy();

  const releasedOrder = await releasedResponse.json();
  expect(releasedOrder.status).toBe("placed");

  // Attempt cancellation after release.
  const cancelResponse = await request.patch(
    `${API_URL}/orders/${order.id}/cancel`
  );

  expect(cancelResponse.status()).toBe(400);

  // The status must remain placed.
  const finalResponse = await request.get(
    `${API_URL}/orders/${order.id}`
  );

  const finalOrder = await finalResponse.json();
  expect(finalOrder.status).toBe("placed");
});

test("Three scheduled orders for the next three days for the same time with items under $30", async ({
  request,
}) => {
  const clockRes = await request.post(`${API_URL}/clock`, {
    data: { minutes: 0 },
  });

  expect(clockRes.ok()).toBeTruthy();

  const clockData = await clockRes.json();
  const now = new Date(clockData.simulatedTime);
  const deliveryHours = [24, 48, 72];

  const orders = [];
  let items;

  for (let i = 0; i < 3; i++) {
    const deliveryTime = new Date(now.getTime() + 60 * 60 * 1000 * (deliveryHours[i] + 12)).toISOString();
    items = [];

    switch (i) {
      case 0:
        items.push({
          restaurantId: "3",
          menuItemId: "301",
          quantity: 1,
        });
        items.push({
          restaurantId: "5",
          menuItemId: "501",
          quantity: 1,
        });
        break;

      case 1:
        items.push({
          restaurantId: "1",
          menuItemId: "103",
          quantity: 1,
        });
        items.push({
          restaurantId: "5",
          menuItemId: "504",
          quantity: 1,
        });
        break;

      case 2:
        items.push({
          restaurantId: "2",
          menuItemId: "202",
          quantity: 1,
        });
        items.push({
          restaurantId: "4",
          menuItemId: "403",
          quantity: 1,
        });
        break;
    }

    const createResponse = await request.post(`${API_URL}/orders`, {
      data: {
        name: "Tester Test",
        deliveryAddress: "123 Testing Street",
        items: items,
        scheduledDeliveryTime: deliveryTime,
      },
    });

    expect(createResponse.status(), await createResponse.text()).toBe(201);
    const order = await createResponse.json();

    expect(order.status).toBe("scheduled");
    expect(order.subtotal).toBeLessThan(3000);

    orders.push(order);
  }

  const expectedRestaurants = [
    ["3", "5"],
    ["1", "5"],
    ["2", "4"],
  ];

  let restaurant1Response = await request.get(`${API_URL}/restaurants/1/orders`);
  let restaurant2Response = await request.get(`${API_URL}/restaurants/2/orders`);
  let restaurant3Response = await request.get(`${API_URL}/restaurants/3/orders`);
  let restaurant4Response = await request.get(`${API_URL}/restaurants/4/orders`);
  let restaurant5Response = await request.get(`${API_URL}/restaurants/5/orders`);

  expect(restaurant1Response.ok()).toBeTruthy();
  expect(restaurant2Response.ok()).toBeTruthy();
  expect(restaurant3Response.ok()).toBeTruthy();
  expect(restaurant4Response.ok()).toBeTruthy();
  expect(restaurant5Response.ok()).toBeTruthy();

  let restaurant1Orders = await restaurant1Response.json();
  let restaurant2Orders = await restaurant2Response.json();
  let restaurant3Orders = await restaurant3Response.json();
  let restaurant4Orders = await restaurant4Response.json();
  let restaurant5Orders = await restaurant5Response.json();

  // Scheduled orders should not appear in restaurant order lists before release.
  const restaurantOrdersBeforeRelease = {
    "1": restaurant1Orders,
    "2": restaurant2Orders,
    "3": restaurant3Orders,
    "4": restaurant4Orders,
    "5": restaurant5Orders,
  };

  for (const order of orders) {
    for (const restaurantId of ["1", "2", "3", "4", "5"]) {
      expect(
        restaurantOrdersBeforeRelease[restaurantId].some(
          (restaurantOrder) => restaurantOrder.id === order.id
        )
      ).toBe(false);
    }
  }

  // Advance the clock to each order's release boundary.
  const advanceMinutes = [2130, 1440, 1440];

  for (let i = 0; i < orders.length; i++) {
    const advanceResponse = await request.post(`${API_URL}/clock`, {
      data: { minutes: advanceMinutes[i] },
    });

    expect(advanceResponse.ok()).toBeTruthy();

    const advanceData = await advanceResponse.json();

    expect(advanceData.releasedIds).toContain(orders[i].id);

    // Confirm the order's status changed after release.
    const orderResponse = await request.get(
      `${API_URL}/orders/${orders[i].id}`
    );

    expect(orderResponse.ok()).toBeTruthy();

    const releasedOrder = await orderResponse.json();

    expect(releasedOrder.status).toBe("placed");
  }

  // Fetch the restaurant order lists again after releasing the scheduled orders.
  restaurant1Response = await request.get(`${API_URL}/restaurants/1/orders`);
  restaurant2Response = await request.get(`${API_URL}/restaurants/2/orders`);
  restaurant3Response = await request.get(`${API_URL}/restaurants/3/orders`);
  restaurant4Response = await request.get(`${API_URL}/restaurants/4/orders`);
  restaurant5Response = await request.get(`${API_URL}/restaurants/5/orders`);

  expect(restaurant1Response.ok()).toBeTruthy();
  expect(restaurant2Response.ok()).toBeTruthy();
  expect(restaurant3Response.ok()).toBeTruthy();
  expect(restaurant4Response.ok()).toBeTruthy();
  expect(restaurant5Response.ok()).toBeTruthy();

  restaurant1Orders = await restaurant1Response.json();
  restaurant2Orders = await restaurant2Response.json();
  restaurant3Orders = await restaurant3Response.json();
  restaurant4Orders = await restaurant4Response.json();
  restaurant5Orders = await restaurant5Response.json();

  const restaurantOrdersById = {
    "1": restaurant1Orders,
    "2": restaurant2Orders,
    "3": restaurant3Orders,
    "4": restaurant4Orders,
    "5": restaurant5Orders,
  };

  // Each released order should appear only in the lists of restaurants
  // that have items in that order.
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];

    for (const restaurantId of ["1", "2", "3", "4", "5"]) {
      const isVisible = restaurantOrdersById[restaurantId].some(
        (restaurantOrder) => restaurantOrder.id === order.id
      );

      expect(isVisible).toBe(
        expectedRestaurants[i].includes(restaurantId)
      );
    }
  }
})

test("A cancelled scheduled order never releases", async ({
  request,
}) => {
  const clockRes = await request.post(`${API_URL}/clock`, {
    data: { minutes: 0 },
  });

  const clockData = await clockRes.json();
  const now = new Date(clockData.simulatedTime);

  const deliveryTime = new Date(
    now.getTime() + 60 * 60 * 1000
  ).toISOString();

  const createResponse = await request.post(`${API_URL}/orders`, {
    data: {
      name: "Tester Test",
      deliveryAddress: "123 Testing Street",
      items: [
        {
          restaurantId: "1",
          menuItemId: "101",
          quantity: 1,
        },
      ],
      scheduledDeliveryTime: deliveryTime,
    },
  });

  expect(createResponse.status(), await createResponse.text()).toBe(201);

  const order = await createResponse.json();
  expect(order.status).toBe("scheduled");

  // Cancel before the release boundary.
  const cancelResponse = await request.patch(
    `${API_URL}/orders/${order.id}/cancel`
  );

  expect(cancelResponse.ok()).toBeTruthy();

  const cancelledResponse = await request.get(
    `${API_URL}/orders/${order.id}`
  );

  const cancelledOrder = await cancelledResponse.json();
  expect(cancelledOrder.status).toBe("cancelled");

  // Advance to the release boundary.
  const advanceResponse = await request.post(`${API_URL}/clock`, {
    data: { minutes: 30 },
  });

  const advanceData = await advanceResponse.json();
  expect(advanceData.releasedIds).not.toContain(order.id);

  const finalResponse = await request.get(
    `${API_URL}/orders/${order.id}`
  );

  const finalOrder = await finalResponse.json();
  expect(finalOrder.status).toBe("cancelled");
});

// TEST 4: An order releases exactly at the release-time boundary.
test("A scheduled order releases exactly at the boundary", async ({
  request,
}) => {
  const clockRes = await request.post(`${API_URL}/clock`, {
    data: { minutes: 0 },
  });

  const clockData = await clockRes.json();
  const now = new Date(clockData.simulatedTime);

  const deliveryTime = new Date(
    now.getTime() + 60 * 60 * 1000
  ).toISOString();

  const createResponse = await request.post(`${API_URL}/orders`, {
    data: {
      name: "Tester Test",
      deliveryAddress: "123 Testing Street",
      items: [
        {
          restaurantId: "1",
          menuItemId: "101",
          quantity: 1,
        },
      ],
      scheduledDeliveryTime: deliveryTime,
    },
  });

  expect(createResponse.status(), await createResponse.text()).toBe(201);

  const order = await createResponse.json();

  // Advance to one minute before release.
  const beforeResponse = await request.post(`${API_URL}/clock`, {
    data: { minutes: 29 },
  });

  expect(beforeResponse.ok()).toBeTruthy();

  const beforeOrderResponse = await request.get(
    `${API_URL}/orders/${order.id}`
  );

  const beforeOrder = await beforeOrderResponse.json();
  expect(beforeOrder.status).toBe("scheduled");

  // Advance the final minute to the release boundary.
  const boundaryResponse = await request.post(`${API_URL}/clock`, {
    data: { minutes: 1 },
  });

  const boundaryData = await boundaryResponse.json();
  expect(boundaryData.releasedIds).toContain(order.id);

  const releasedResponse = await request.get(
    `${API_URL}/orders/${order.id}`
  );

  const releasedOrder = await releasedResponse.json();
  expect(releasedOrder.status).toBe("placed");

  // A repeated clock advance must not release the same order again.
  const repeatResponse = await request.post(`${API_URL}/clock`, {
    data: { minutes: 0 },
  });

  const repeatData = await repeatResponse.json();
  expect(repeatData.releasedIds).not.toContain(order.id);
});

// TEST 5: Each restaurant sees only its own items in a multi-restaurant order.
test("Restaurants only see their own items from a shared order", async ({
  request,
}) => {
  const createResponse = await request.post(`${API_URL}/orders`, {
    data: {
      name: "Tester Test",
      deliveryAddress: "123 Testing Street",
      items: [
        {
          restaurantId: "1",
          menuItemId: "103",
          quantity: 1,
        },
        {
          restaurantId: "4",
          menuItemId: "402",
          quantity: 1,
        },
      ],
    },
  });

  expect(createResponse.status(), await createResponse.text()).toBe(201);

  const order = await createResponse.json();

  const restaurantOneResponse = await request.get(`${API_URL}/restaurants/1/orders`);
  const restaurantTwoResponse = await request.get(`${API_URL}/restaurants/2/orders`);

  const restaurantOneOrders = await restaurantOneResponse.json();
  const restaurantTwoOrders = await restaurantTwoResponse.json();

  const orderForRestaurantOne = restaurantOneOrders.find(
    (restaurantOrder) => restaurantOrder.id === order.id
  );

  const orderForRestaurantTwo = restaurantTwoOrders.find(
    (restaurantOrder) => restaurantOrder.id === order.id
  );

  expect(orderForRestaurantOne).toBeTruthy();
  expect(orderForRestaurantTwo).toBeTruthy();

  expect(
    orderForRestaurantOne.items.map((item) => item.menuItemId)
  ).toEqual(["103"]);

  expect(
    orderForRestaurantTwo.items.map((item) => item.menuItemId)
  ).toEqual(["402"]);
});

