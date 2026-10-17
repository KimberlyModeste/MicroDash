const express = require("express");

const app = express();
app.use(express.json());

const PORT = 3000;

// restaurants 
const restaurants  = [
{
  id: "1",
  name: "Monster's Hearth",
  cuisine: "Cozy Meals",
  openingHours: "11:00 AM - 10:00 PM",
  averagePrepTimeMinutes: 25,
  imageUrl: "https://i.pinimg.com/originals/8d/2b/80/8d2b80f328df356ba950ec4494e8bc07.png",
  menu: [
  {
      id: "101",
      name: "Wyvern Beef Stew",
      description: "A hearty fantasy-inspired stew featuring tender beef, potatoes, carrots, and savory herbs simmered in a rich broth. Perfect for adventurers returning from a long quest.",
      price: 1699,
      imageUrl: "./resources/wyvern-stew.jpg"
  },
  {
      id: "102",
      name: "Roast Dragon Steak",
      description: "A legendary feast inspired by dragon hunting, featuring a thick, flame-grilled steak seasoned with aromatic herbs and served with roasted vegetables.",
      price: 2499,
      imageUrl: "./resources/roasted-dragon.png"
  },
  {
      id: "103",
      name: "Horn-Bull Gyudon",
      description: "A comforting bowl of Japanese rice topped with thinly sliced beef and sweet onions simmered in a savory soy-based sauce. Inspired by the hearty meals of a fantasy adventurer.",
      price: 1499,
      imageUrl: "./resources/Gyudon.png"
  }]
},
{
  id: "2",
  name: "The Grand Line Galley",
  cuisine: "Pirate-Inspired Japanese",
  openingHours: "10:00 AM - 11:00 PM",
  averagePrepTimeMinutes: 20,
  imageUrl: "https://prtimes.jp/i/7303/565/resize/d7303-565-286836-1.jpg",
  menu: [
    {
      id: "201",
      name: "Luffy's Meat on the Bone",
      description: "A pirate captain's dream meal: a generous serving of juicy roasted meat on the bone, seasoned with spices and cooked until tender. Big enough to satisfy a hungry adventurer.",
      price: 1999,
      imageUrl: "./resources/luffy-bone.png"
    },
    {
      id: "202",
      name: "Gin's Takeout Stir-Fry",
      description: "A quick and satisfying stir-fried rice dish with egg, colorful vegetables, and savory seasonings. A simple, filling meal for pirates on the move.",
      price: 1299,
      imageUrl: "./resources/gins-stirfry.png"
    },
    {
      id: "203",
      name: "Desert Trekker's Bento",
      description: "A portable Japanese lunchbox containing seasoned rice, vegetables, and a savory main dish. Designed for a crew exploring distant islands and crossing scorching deserts.",
      price: 1399,
      imageUrl: "./resources/Deserts-bento.png" 

    }
  ]
},
{
  id: "3",
  name: "Pika Picnic Cafe",
  cuisine: "Pokemon Cafe",
  openingHours: "9:00 AM - 8:00 PM",
  averagePrepTimeMinutes: 15,
  imageUrl: "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/f2e5d8c0-429d-4e9d-965b-24d9c027e243/Derivates/2106dcd7-c4b0-46dd-baaa-245e70b6a314.jpg",
  menu: [
    {
      id: "301",
      name: "Pikachu Curry Rice",
      description: "A cheerful Japanese curry served with fluffy rice shaped into a Pikachu-inspired face. The mildly spiced curry and colorful vegetable toppings make this a fun café favorite.",
      price: 1399,
      imageUrl: "./resources/pikachu-curry.png"
    },
    {
      id: "302",
      name: "Spinda Raspberry Marble Cake",
      description: "A soft, sweet cake swirled with raspberry flavor and decorated with a playful spotted pattern inspired by Spinda. A delightful dessert for Pokémon trainers and cake lovers.",
      price: 799,
      imageUrl: "./resources/spinda-cake.png"
    },
    {
      id: "303",
      name: "Dragonite's Butternut Gnocchi",
      description: "Tender potato gnocchi paired with sweet roasted butternut squash and a creamy, savory sauce. A comforting autumn-inspired dish worthy of a friendly Dragonite.",
      price: 1599,
      imageUrl: "./resources/Butternut-gnocchi.jpg"
    }
  ]
},
{
  id: "4",
  name: "The Wandering Spirit Kitchen",
  cuisine: "Japanese Comfort Food",
  openingHours: "11:00 AM - 9:00 PM",
  averagePrepTimeMinutes: 20,
  imageUrl: "https://media.vogue.fr/photos/628b92e8e8c7d38234b4b875/3%3A2/w_4796%2Ch_3197%2Cc_limit/GG_GHIBLI_PonyoSurLaFalaise_ShioRamenDesRetrouvailles_HD.jpg",
  menu: [
    {
      id: "401",
      name: "Ponyo's Shio Ramen",
      description: "A comforting bowl of Japanese salt-based ramen with warm broth, noodles, ham, egg, and sliced green onions. A simple, nostalgic meal inspired by Ponyo's love of ramen.",
      price: 1499,
      imageUrl: "./resources/ponyo-ramen.jpg"
    },
    {
      id: "402",
      name: "Satsuki's Bento",
      description: "A lovingly prepared Japanese lunchbox featuring steamed rice, grilled fish, colorful vegetables, and traditional side dishes. A wholesome homemade-style meal inspired by My Neighbor Totoro.",
      price: 1299,
      imageUrl: "./resources/satsuki-bento.png"
    },
    {
      id: "403",
      name: "Kiki's Chocolate Cake",
      description: "A rich chocolate cake with a smooth chocolate ganache topping. This comforting dessert is perfect for enjoying with a cup of tea after a busy day of deliveries.",
      price: 899,
      imageUrl: "./resources/kiki-chocolate-cake.jpg"
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
    menu: restaurant.menu
  });
})


// Orders
const orders = [];
let nextOrderId = 1;


// POST /orders
app.post("/orders", (req, res) =>{
  const {restaurantId, items, deliveryAddress, name} = req.body;

  if(
    !restaurantId ||
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

  const restaurant = restaurants.find(
    (r) => r.id === restaurantId
  );

  if(!restaurant) {
    return res.status(404).json({
      error:"Restaurant not found."
    });
  }

  const orderItems = [];

  for (const item of items) {
    if(
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

    const menuItem = restaurant.menu.find(
      (m) => m.id === item.menuItemId
    )

    if(!menuItem)
    {
      return res.status(400).json({
        error: `Menu item ${item.menuItemId} does not beong to this restaurant.`
      })
    }

    orderItems.push({
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
    restaurantId: restaurant.id,
    restautantName: restaurant.name,
    items: orderItems,
    deliveryAddress: deliveryAddress.trim(),
    subtotal: subtotal,
    // deliveryFee: 399,
    // tax: Math.round(subtotal * 0.08875),
    status: "pending",
    createdAt: new Date().toISOString()
  }
  
  // order.total = order.subtotal + order.deliveryFee + order.tax;

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
    "cancelled"
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

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`)
})

