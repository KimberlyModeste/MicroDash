const express = require("express");

const app = express();
const cors = require("cors");
app.use(cors())
app.use(express.json());

const path = require("path")
app.use('/resources', express.static(path.join(__dirname, 'resources')));

const PORT = 3000;
const { createScheduledOrderService } =  require("./scheduledOrderService");

let simulatedTime = null;
const clock = {
  now: () => simulatedTime
    ? new Date(simulatedTime)
    : new Date()
}


// restaurants 
const restaurants  = [
{
  id: "1",
  name: "Monster's Hearth",
  cuisine: "Cozy Meals",
  openingHours: "11:00 AM - 10:00 PM",
  averagePrepTimeMinutes: 25,
  image: "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/wyvern-stew.jpg",
  menu: [
  {
      id: "101",
      name: "Wyvern Beef Stew",
      description: "A hearty fantasy-inspired stew featuring tender beef, potatoes, carrots, and savory herbs simmered in a rich broth. Perfect for adventurers returning from a long quest.",
      price: 1699,
      image: "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/wyvern-stew.jpg"
  },
  {
      id: "102",
      name: "Roast Dragon Steak",
      description: "A legendary feast inspired by dragon hunting, featuring a thick, flame-grilled steak seasoned with aromatic herbs and served with roasted vegetables.",
      price: 2499,
      image: "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/roasted-dragon.png"
  },
  {
      id: "103",
      name: "Horn-Bull Gyudon",
      description: "A comforting bowl of Japanese rice topped with thinly sliced beef and sweet onions simmered in a savory soy-based sauce. Inspired by the hearty meals of a fantasy adventurer.",
      price: 1499,
      image: "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/Gyudon.png"
  }]
},
{
  id: "2",
  name: "The Grand Line Galley",
  cuisine: "Pirate-Inspired Japanese",
  openingHours: "10:00 AM - 11:00 PM",
  averagePrepTimeMinutes: 20,
  image: "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/luffy-bone.png",
  menu: [
    {
      id: "201",
      name: "Luffy's Meat on the Bone",
      description: "A pirate captain's dream meal: a generous serving of juicy roasted meat on the bone, seasoned with spices and cooked until tender. Big enough to satisfy a hungry adventurer.",
      price: 1999,
      image: "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/luffy-bone.png"
    },
    {
      id: "202",
      name: "Gin's Takeout Stir-Fry",
      description: "A quick and satisfying stir-fried rice dish with egg, colorful vegetables, and savory seasonings. A simple, filling meal for pirates on the move.",
      price: 1299,
      image: "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/gins-stirfry.png"
    },
    {
      id: "203",
      name: "Desert Trekker's Bento",
      description: "A portable Japanese lunchbox containing seasoned rice, vegetables, and a savory main dish. Designed for a crew exploring distant islands and crossing scorching deserts.",
      price: 1399,
      image: "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/Deserts-bento.png" 

    }
  ]
},
{
  id: "3",
  name: "Pika Picnic Cafe",
  cuisine: "Pokemon Cafe",
  openingHours: "9:00 AM - 8:00 PM",
  averagePrepTimeMinutes: 15,
  image: "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/pikachu-curry.png",
  menu: [
    {
      id: "301",
      name: "Pikachu Curry Rice",
      description: "A cheerful Japanese curry served with fluffy rice shaped into a Pikachu-inspired face. The mildly spiced curry and colorful vegetable toppings make this a fun café favorite.",
      price: 1399,
      image: "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/pikachu-curry.png"
    },
    {
      id: "302",
      name: "Spinda Raspberry Marble Cake",
      description: "A soft, sweet cake swirled with raspberry flavor and decorated with a playful spotted pattern inspired by Spinda. A delightful dessert for Pokémon trainers and cake lovers.",
      price: 799,
      image: "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/spinda-cake.png"
    },
    {
      id: "303",
      name: "Dragonite's Butternut Gnocchi",
      description: "Tender potato gnocchi paired with sweet roasted butternut squash and a creamy, savory sauce. A comforting autumn-inspired dish worthy of a friendly Dragonite.",
      price: 1599,
      image: "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/Butternut-gnocchi.jpg"
    }
  ]
},
{
  id: "4",
  name: "The Wandering Spirit Kitchen",
  cuisine: "Japanese Comfort Food",
  openingHours: "11:00 AM - 9:00 PM",
  averagePrepTimeMinutes: 20,
  image: "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/ponyo-ramen.jpg",
  menu: [
    {
      id: "401",
      name: "Ponyo's Shio Ramen",
      description: "A comforting bowl of Japanese salt-based ramen with warm broth, noodles, ham, egg, and sliced green onions. A simple, nostalgic meal inspired by Ponyo's love of ramen.",
      price: 1499,
      image: "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/ponyo-ramen.jpg"
    },
    {
      id: "402",
      name: "Satsuki's Bento",
      description: "A lovingly prepared Japanese lunchbox featuring steamed rice, grilled fish, colorful vegetables, and traditional side dishes. A wholesome homemade-style meal inspired by My Neighbor Totoro.",
      price: 1299,
      image: "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/satsuki-bento.png"
    },
    {
      id: "403",
      name: "Kiki's Chocolate Cake",
      description: "A rich chocolate cake with a smooth chocolate ganache topping. This comforting dessert is perfect for enjoying with a cup of tea after a busy day of deliveries.",
      price: 899,
      image: "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/kiki-chocolate-cake.jpg"
    }
  ]
},
{
  id: "5",
  name: "Hero's Feast",
  cuisine: "Tavern food",
  openingHours: "11:00 AM - 11:00 PM",
  avgPrepTime: 30,
  image: "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/laumberryPie.jpg",
  menu: [
    {
      id: "501",
      name: "Laumberry Pie",
      price: 899,
      description:
        "A rustic, golden-crusted berry pie filled with sweet and tart woodland berries. A favorite among travelers who need a little taste of home after a long adventure.",
      image:
        "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/laumberryPie.jpg"
    },
    {
      id: "502",
      name: "Goldenstars",
      price: 699,
      description:
        "Delicate, golden star-shaped pastries with a rich, sweet filling. These celestial treats are perfect for celebrating a successful quest or a lucky roll.",
      image:
        "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/goldstars.jpg"
    },
    {
      id: "503",
      name: "Kender Stumblenoodles",
      price: 1299,
      description:
        "A bubbling bowl of creamy, extra-cheesy pasta seasoned with paprika, garlic, and a hint of cayenne, finished with a crunchy golden breadcrumb topping. A chaotic but delicious Kender classic.",
      image:
        "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/stumblenoodles.jpg"
    },
    {
      id: "504",
      name: "Irlymeyer's Dragonfire Punch",
      price: 999,
      description:
        "A fiery-looking tavern punch blending cranberry, orange, pineapple, and lemon with a sparkling finish. Served chilled with an orange garnish. This traditional version contains alcohol.",
      image:
        "https://raw.githubusercontent.com/KimberlyModeste/MicroDash/refs/heads/master/MicroDashBackend/resources/DragonFirePunch.jpg"
    }
  ]
}

]

// GET /restaurants 
app.get("/restaurants", (req, res) => {
  const result = restaurants.map(
    ({menu, ...restaurant}) => restaurant
  );
  res.json(result);
});

// GET /Restautants/:id/menu
app.get("/restaurants/:id/menu", (req, res) => {
  const restaurant = restaurants.find(
    (r) => r.id === req.params.id
);

  if(!restaurant)
  {
    return res.status(404).json({
      error: "Restaurant wasn't found. Sorry."
    })
  }

  res.json({
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    restaurantCuisine: restaurant.cuisine,
    restaurantOpeningHours: restaurant.openingHours,
    restaurantAverage: restaurant.avgPrepTime,
    menu: restaurant.menu
  });
})

// GET /Restaurants/:id/orders
app.get("/Restaurants/:id/orders", (req, res) => {
  
  const placedOrders = orders.filter(
    (order) =>
      // order.status === "placed"
      order.status !== "scheduled" &&
      order.status !== "cancelled"
  ).map(order => ({
      ...order,
      items: order.items.filter(
        item => item.restaurantId === req.params.id
      )
    }))
    .filter(order => order.items.length > 0);
  res.json(placedOrders);
})


// Orders
const orders = [];
let nextOrderId = 1;


// POST /orders
app.post("/orders", (req, res) =>{
  const {items, deliveryAddress, name, scheduledDeliveryTime} = req.body;

  if(
    // !restaurantId ||
    !Array.isArray(items) ||
    items.length === 0 ||
    !deliveryAddress ||
    typeof deliveryAddress !== "string" ||
    !deliveryAddress.trim() ||
    !name ||
    typeof name !== "string" ||
    !name.trim()
  )
  {
    return res.status(400).json({
      error: "Restaurant, name, items and delivery address are required."
    })
  }

  const isScheduled =
  scheduledDeliveryTime !== undefined &&
  scheduledDeliveryTime !== null &&
  scheduledDeliveryTime !== "";

  const scheduledDate = isScheduled
  ? new Date(scheduledDeliveryTime)
  : null;

  const releaseAt = isScheduled
  ? new Date(
      scheduledDate.getTime() - 30 * 60 * 1000
    ).toISOString()
  : null;

  if (isScheduled && 
    ( !Number.isFinite(scheduledDate.getTime()) ||
    scheduledDate.getTime() < clock.now().getTime() + 45 * 60 * 1000 ||
    scheduledDate.getTime() > clock.now().getTime() + 7 * 24 * 60 * 60 * 1000))
    {
      return   res.status(400).json({error: "Scheduled delivery must be between 45 minutes and 7 days from now."});
    }

  const orderItems = [];

  for (const item of items) {
    if(
      !item.restaurantId ||
      !item.menuItemId ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99
    )
    {
      return res.status(400).json({
        error: "Each item needs a menuItemId and quantity from 1 - 99."
      });
    }

    const restaurant = restaurants.find(
      (r) => r.id === String(item.restaurantId)
    );

    if (!restaurant) {
      return res.status(400).json({
        error: `Restaurant ${item.restaurantId} was not found.`,
      });
    }

    const menuItem = restaurant.menu.find(
      (m) => m.id === String(item.menuItemId)
    )

    if(!menuItem)
    {
      return res.status(400).json({
        error: `Menu item ${item.menuItemId} does not beong to this restaurant.`
      })
    }

    orderItems.push({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: item.quantity,
      lineTotal: menuItem.price * item.quantity
    })
  }

  const subtotal = orderItems.reduce((sum, item) => sum+item.lineTotal, 0)
  const order = {
    id: String(nextOrderId++),
    name: name.trim(),
    items: orderItems,
    deliveryAddress: deliveryAddress.trim(),
    subtotal: subtotal,
    deliveryFee: 399,
    status: isScheduled ? "scheduled" : "pending",
    createdAt: clock.now().toISOString(),
    // createdAt: new Date().toISOString(),
    scheduledDeliveryTime: isScheduled
    ? scheduledDate.toISOString()
    : null,
    releaseAt:isScheduled ? releaseAt : null
  }
  
  orders.push(order);
  res.status(201).json(order);
})

// GET /orders/:id
app.get("/orders/:id", (req, res) =>{
  const order = orders.find((o) => o.id === req.params.id);

  if(!order)
  {
    return res.status(404).json({
      error: "Order not found!"
    })
  }

  res.json(order);
})

// PATCH /order/:id/cancel
app.patch("/orders/:id/cancel", (req, res) => {
  const order = orders.find((item) => item.id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: "Order not found." });
  }

  // Only scheduled orders can be cancelled.
  if (order.status !== "scheduled") {
    return res.status(400).json({
      error: "This order can no longer be cancelled."
    });
  }

  order.status = "cancelled";

  res.json({
    message: "Order cancelled successfully.",
    order
  });
});

// PATCH /orders/:id/status
app.patch("/orders/:id/status", (req, res)=> {
  const order = orders.find((o) => o.id === req.params.id);

  if(!order)
  {
    return res.status(404).json({
      error: "Order not found."
    })
  }

  const allowedStatuses = [
    "pending",
    "confirmed",
    "preparing",
    "ready_for_pickup",
    "picked_up",
    "delivered",
    "cancelled",
    "scheduled",
    "placed"
  ]

  const { status } = req.body;

  if(!allowedStatuses.includes(status)){
    return res.status(400).json({
      error: "Invalid Status",
      allowedStatuses
    });
  }

  order.status = status;

  res.json(order);
})

// POST /clock
app.post("/clock", (req, res) =>{
  const minutes = Number(req.body.minutes);

  if (!Number.isFinite(minutes) || minutes < 0) {
    return res.status(400).json({ error: "Invalid minutes" });
  }

  const currentTime = clock.now();

  simulatedTime = minutes === 0 
  ? new Date ()
  : currentTime.getTime() + minutes * 60000

  const releasedIds = scheduledOrderService.releaseEligibleOrders();

  res.json({
    simulatedTime: simulatedTime.toISOString(),
    releasedIds
  });

})


const scheduledOrderService = createScheduledOrderService({
  orders,
  clock
});

const scheduler = setInterval(() => {
  try {
    const releasedIds =
      scheduledOrderService.releaseEligibleOrders();

    if (releasedIds.length > 0) {
      console.log("Released scheduled orders:", releasedIds);
    }
  } catch (error) {
    console.error("Scheduled order release failed:", error);
  }
}, 1000);


app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`)
})

