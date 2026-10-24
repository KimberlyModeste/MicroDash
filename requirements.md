According to cgpt
# Micro Dash — Track A: Scheduled Orders

**Target completion:** October 31, 2026

## Epic: Scheduled Order Management

As a customer, I want to schedule an order for future delivery so that I can plan meals in advance without sending the order to the restaurant immediately.

### US-01 — Place a scheduled order

**User story:** As a customer, I want to select a future delivery time so that my order arrives when I need it.

**Acceptance criteria**

1. Given a valid order without a scheduled delivery time, when the customer submits the order, the system creates an immediate order using the existing order workflow.
2. Given a valid order with a scheduled delivery time, when the customer submits it, the system creates an order with status `SCHEDULED`.
3. The scheduled order includes a unique order ID, restaurant ID, ordered items, delivery address, scheduled delivery time, and order total. (Scope changed to have the restaurant Id as a part of the items instead of the order)
4. The system does not release a newly scheduled order to the restaurant immediately.
5. A scheduled order request with missing or invalid required order fields is rejected with an appropriate HTTP 400 response and a clear error message.
6. Successful order creation returns HTTP 201 and the created order details.

### US-02 — Validate the scheduled delivery time

**User story:** As a customer, I want the system to validate my requested delivery time so that I cannot schedule an order outside the permitted window.

**Acceptance criteria**

1. Given the injected current time is T, a delivery time exactly 45 minutes after T is accepted.
2. A delivery time less than 45 minutes after T is rejected.
3. A delivery time exactly 7 days after T is accepted.
4. A delivery time more than 7 days after T is rejected.
5. A delivery time equal to or earlier than T is rejected.
6. A missing scheduled delivery time is treated as an immediate order, not as a validation failure. (Removed from scope by Kimberly)
7. An unparseable or invalid date/time is rejected with HTTP 400 and a clear error message.
8. Validation uses the injected clock, not the machine's real system time.

### US-03 — Validate restaurant opening hours

**User story:** As a customer, I want to schedule delivery only when the restaurant is open so that my order can be fulfilled.

**Acceptance criteria**

1. Given the requested delivery time falls within the restaurant's opening hours, the order passes the opening-hours validation.
2. Given the requested delivery time falls outside the restaurant's opening hours, the system rejects the order with HTTP 400 and an error explaining that the restaurant is closed at the requested time.
3. The validation checks the restaurant's opening hours on the requested delivery date, not just whether it is open when the order is submitted.
4. A delivery time exactly at closing time is rejected.
5. Opening-hours calculations use a defined timezone. For this class project, all restaurants use `America/New_York`.
6. If the restaurant does not have valid opening-hours data, the system rejects the scheduled order with a clear validation error rather than assuming the restaurant is open.

### US-04 — Hold and release scheduled orders

**User story:** As a restaurant, I want scheduled orders to be released 30 minutes before their delivery time so that I receive them at the appropriate time for preparation.

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

### US-05 — Cancel a scheduled order

**User story:** As a customer, I want to cancel a scheduled order before it is released so that I can change my plans.

**Acceptance criteria**

1. Given an order is in status `SCHEDULED`, when the customer cancels it before its release boundary, the order transitions to `CANCELLED`.
2. A successful cancellation returns an appropriate success response and the updated order.
3. A cancelled order is excluded from future release processing.
4. Repeated cancellation requests do not cause additional state transitions or releases.
5. Given an order is already in status `PLACED`, cancellation through the scheduled-order cancellation operation is rejected with a clear error.
6. Attempting to cancel an order that does not exist returns HTTP 404.
7. Cancellation eligibility is evaluated using the injected clock and the order's current status.

### US-06 — Make time-dependent behavior testable

**User story:** As a developer, I want all time-dependent logic to use an injected clock so that I can test scheduling behavior deterministically.

**Acceptance criteria**

1. Scheduled-time validation, opening-hours validation, release eligibility, and cancellation eligibility receive time from an injected clock.
2. Unit tests can provide a fixed clock value without changing the computer's system clock.
3. Tests can advance the clock across the 45-minute minimum, 7-day maximum, and 30-minute release boundary.
4. Identical inputs and the same injected clock value produce identical validation and state-transition results.
5. Automated tests do not require real-time sleeps to test scheduled-order boundaries.
6. The release process can be invoked directly in tests without starting a long-running background timer.

## Epic: API and Order State

### US-07 — Expose scheduled-order functionality through the API

**User story:** As a frontend developer, I want a consistent API for creating, viewing, and cancelling scheduled orders so that the React frontend can support scheduled delivery.

**Acceptance criteria**

1. `POST /orders` accepts an optional `scheduledDeliveryTime` field.
2. The API returns the created order, including its status and scheduled delivery time when applicable.
3. `GET /orders/:id` returns the current order status and scheduled delivery time.
4. A cancellation endpoint, such as `POST /orders/:id/cancel`, allows cancellation of an eligible scheduled order.
5. Invalid requests return clear error messages and appropriate HTTP status codes.
6. Existing immediate-order behavior remains functional.
7. The API does not expose a scheduled order as `PLACED` before the release boundary.

## Definition of Done

The feature is complete when:

- All acceptance criteria have corresponding passing automated tests.
- Boundary tests cover exactly 45 minutes, less than 45 minutes, exactly 7 days, more than 7 days, and exactly 30 minutes before delivery.
- Tests cover restaurant opening hours, cancellation, and duplicate release attempts.
- Existing immediate-order tests continue to pass.
- API behavior and request/response examples are documented.
- The React frontend can submit a scheduled delivery time and display the resulting order status.
- The project can be started locally using documented commands.

