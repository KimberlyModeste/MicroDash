# Simplified Micro Dash API plan
## 1. Technology stack
- Node.js — run the backend.
- Express.js — define the API endpoints.
- JavaScript — implement the logic.
- In-memory sample data or a simple JSON file — store your five restaurants and their menus initially.
- Postman — test your endpoints.


## 2. Project structure (Chatgpt generated)
micro-dash/
├── data/
│   └── restaurants.js
├── routes/
│   ├── restaurants.js
│   └── orders.js
├── controllers/
│   ├── restaurantController.js
│   └── orderController.js
├── app.js
├── package.json
└── README.md

## Project Structure (Updated by Kimberly)
Midterm/
├── MicroDashBackend/
│ 	├── resources/ (all images)
│ 	├── app.js
│   └── scheduledOrderService.js
├───micro-dash/
│ 	└── src/
│ 		├── components/
│ 		│ 		├── CartComp.jsx
│ 		│ 		├── FavMealComp.jsx
│ 		│ 		├──	Menubar.jsx
│ 		│ 		├──	MyCard.jsx
│ 		│ 		└──	SidebarCart.jsx
│ 		├── pages/
│ 		│ 	├──	Cart.jsx
│ 		│ 	├──	Home.jsx
│ 		│ 	├──	Menu.jsx
│ 		│ 	├──	Order.jsx
│ 		│ 	└──	Menubar.jsx
│ 		├── App.jsx
│ 		└──	App.css
├── design.md
├── requirements.md
└── task.ms


## 3. Required endpoints
GET /restaurants   				  			Return restaurant names, cuisines, opening hours, prep times, and images
GET /restaurants/:id/menu					Return menu items with IDs, names, prices, and images
POST /orders								Accept an order and return its details, calculated totals, and initial status
GET /orders/:id								Retrieve a specific order
PATCH /orders/:id/status					Update an order's status

## Added endpoints
GET /Restaurants/:id/orders					Returns order that were "PLACED" at a restaurant
PATCH /order/:id/cancel						Allows cancellation after an order was "SCHEDULED" (only scheduled orders)
POST /clock									Allows for the front end to change injected clock


## 4. Sample data
Your data/restaurants.js could contain:

const restaurants = [
  {
    id: "1",
    name: "Little Tokyo",
    cuisine: "Japanese",
    openingHours: "11:00 AM - 10:00 PM",
    averagePrepTimeMinutes: 20,
    imageUrl: "https://example.com/little-tokyo.jpg",
    menu: [
      {
        id: "101",
        name: "Chicken Teriyaki",
        price: 12.99,
        imageUrl: "https://example.com/teriyaki.jpg"
      },
      {
        id: "102",
        name: "Vegetable Ramen",
        price: 14.99,
        imageUrl: null
      }
    ]
  }
];

data/restaurants/:id/menu: 
{
  "data": [
    {
      "id": "item_101",
      "name": "Chicken Teriyaki",
      "price": 1299,
      "currency": "USD",
      "imageUrl": "https://cdn.example.com/menu/item_101.jpg",
      "isAvailable": true
    },
    {
      "id": "item_102",
      "name": "Vegetable Ramen",
      "price": 1499,
      "currency": "USD",
      "imageUrl": null,
      "isAvailable": true
    }
  ]
}

/orders

{
  "restaurantId": "rest_001",
  "items": [
    {
      "menuItemId": "item_101",
      "quantity": 2
    },
    {
      "menuItemId": "item_102",
      "quantity": 1
    }
  ],
  "deliveryAddress": {
    "line1": "123 Example Street",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001"
  }
}

