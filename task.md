- I'm creating a doordash sort of thing called micro dash. I need to make the API's as a starting point. The endpoints should be:
GET /restaurants: List restaurants with name, cuisine, opening hours, and average prep time,
GET /restaurants/{id}/menu: List the menu items (id, name, price) for one restaurant,
POST /orders: Place an order: restaurant, items with quantities, delivery address; returns the new order,
GET /orders/{id}: Return one order with its items, totals, and status,
PATCH /orders/{id}/status: Update the order status (used by restaurant and driver tools),


I'll give you about 5 restaurants and I'll have a variety of menu items for each restaurant. This must be scalable for the future. I want to add images as well. Give me an outline how to accomplish this using node.
- No lets keep it as an api because it is a class assignment
- Ok make an api based on these books recipes. Each book is its own resturant but make a create name for the resturant. Add between 2- 5 recipies and find the image of the recipie online. 
Campfire cooking in another world cookbook (include one dragon dish), One Piece: Pirate Recipes, My Pokémon Cookbook: Delicious Recipes Inspired by Pikachu and Friends, The Unofficial Ghibli Cookbook
- Add descriptions to menu items.
- Ok how do i start it.
- Ok now I want to create a simple frontend with react
- Give me one more resturant for the dnd cookbook. use Laumberry pie, goldenstars, kender stumblenoodles and irlymeyer's dragonfire punch.
- What are the requirements to get this to work
- Ok I want to add this feature:
Track A: Scheduled Orders
A customer can order now for delivery later.
• An order accepts an optional scheduled delivery time. It must be at least 45 minutes and at
most 7 days ahead; otherwise return a clear validation error.
• Reject a scheduled time when the restaurant is closed.
• A scheduled order is held and released to the restaurant 30 minutes before its delivery time,
moving from SCHEDULED to PLACED exactly once.
• A customer can cancel a scheduled order before it is released.
• All time-dependent logic uses an injected clock so tests do not depend on the real time.

Give me user stories and testable acceptance criteria, plus what is explicitly out of scope for the whole project from scratch. This should be done by October 31, 2026.
- Alright I changed the cart into a page and added a (nonworking) radio button group for regular and scheduled orders: [Pasted current Cart.jsx] What are my next steps
- Alright I want to accomplish this:
As a restaurant, I want scheduled orders to be released 30 minutes before their delivery time so that I receive them at the appropriate time for preparation.

**Acceptance criteria**

1. A newly accepted scheduled order remains in status `SCHEDULED` until its release time.
2. The release time is calculated as the scheduled delivery time minus 30 minutes.
3. Before the release time, the order is not included in the restaurant's list of placed orders.
4. When the injected clock reaches the release time, the order becomes eligible for release and transitions to `PLACED`.
5. At the release boundary, the order transitions from `SCHEDULED` to `PLACED` exactly once.
6. Running the release process multiple times for the same order does not create duplicate releases or repeat the state transition.
7. A scheduled order that has been cancelled is never released.
8. A scheduled order whose release time has passed while the service is running is released on the next scheduler execution, if it has not already been released or cancelled.
9. The release process uses the injected clock, allowing tests to advance time without waiting in real time.
- Ok now I need a front end that allows a user to input their order number and cancel if they wanted and for the restaurants to see the new order .
- I'm getting a bad request. how do i fix it:
backend: [Pasted Current App.js]
Frontend: [Pasted Current Cart.jsx]
- I want the restaurant id to be with the item because i want to add items from different restaurants
- Back to the front end restaurants, the scheduled orders aren't going to placed. Where do i use the schduler?
- How to change the value of the injected clock.
- I cant do it from the backend because the orders will reset if I change the backend
- Update the restaurant/id/orders and only show the items from that restaurant 
- How should I accomplish this: [Pasted required workflow from assignment requirements]
- Can I make a test for the front end that does task? and if so how do i do that. Lets's try something like: trying to cancel already released orders, Write test that schedules for the next 3 days for the same time with a collective items $30 or under and each sceduled order has different items, check what happens when you get to release at after an order has beeen canceled and another test (make one up).
- Is the playwrite tests written on the front end or backend
- Ok how do I set up the first one
- Ok give me exactly what I need to do to to make the tests work
- Ok this is the app.js: [Pasted App.js]
- I'm getting no tests found
- output:
Error: No tests found

Folderstucture:
frontend
|__tests
|     |__scheduled-orders.spec.js
|__ playwrite.config.js

package.json:
{
  "name": "microdashbackend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "Kimberly Modeste",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.6",
    "express": "^5.3.0"
  }
}
- [Pasted error that occurs when running test]
- [Pasted updated version of test #1]
- Ok write a test for the other tests I said
- No do it the same way you did the first one. Use the beforeEach function though
- How do I fix this one: [Pasted test #2]
- This is what it looks like now: [Pasted updated version of test # 2]
- [The updated version of test # 2]
- Show me the entire test