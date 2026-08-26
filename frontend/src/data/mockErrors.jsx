export const MOCK_ERRORS = [
  {
    id: 'ERR-8902',
    title: 'TypeError: Cannot read properties of undefined (reading "map")',
    service: 'payment-gateway',
    environment: 'production',
    timestamp: '2 mins ago',
    count: 342,
    usersAffected: 89,
    status: 'unresolved',
    severity: 'critical',
    stackTrace: `TypeError: Cannot read properties of undefined (reading 'map')
    at PaymentList (https://traceguard.io/assets/checkout.js:142:23)
    at renderWithHooks (https://traceguard.io/assets/vendor.js:891:14)
    at mountIndeterminateComponent (https://traceguard.io/assets/vendor.js:1024:18)`,
    aiAnalysis: {
      rootCause: "The API response payload for `items` returned `null` instead of an empty array when the user cart was emptied during checkout.",
      suggestedFix: `// Replace original code at line 142:
// return items.map(item => <ItemKey key={item.id} {...item} />);

// Proposed Fix:
return (items || []).map(item => <ItemKey key={item.id} {...item} />);`
    },
    breadcrumbs: [
      { time: '14:22:01', event: 'User clicked "Checkout"', type: 'ui' },
      { time: '14:22:02', event: 'POST /api/v1/cart/clear -> 200 OK', type: 'network' },
      { time: '14:22:03', event: 'GET /api/v1/checkout/items -> 200 OK (Data: { items: null })', type: 'network' },
      { time: '14:22:03', event: 'Uncaught Exception thrown in component <PaymentList>', type: 'error' }
    ]
  },
  {
    id: 'ERR-8903',
    title: 'MongoServerError: E11000 duplicate key error collection',
    service: 'auth-service',
    environment: 'production',
    timestamp: '14 mins ago',
    count: 12,
    usersAffected: 4,
    status: 'unresolved',
    severity: 'warning',
    stackTrace: `MongoServerError: E11000 duplicate key error collection: prod.users index: email_1 dup key: { email: "user@example.com" }
    at /app/node_modules/mongodb/lib/operations/insert.js:52:19
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)`,
    aiAnalysis: {
      rootCause: "Race condition during concurrent user registration attempts with identical email payload.",
      suggestedFix: `// Add unique handle validation prior to query insert:
const existingUser = await User.findOne({ email });
if (existingUser) throw new CustomAuthError("Email already registered");`
    },
    breadcrumbs: [
      { time: '14:10:00', event: 'POST /api/auth/register', type: 'network' },
      { time: '14:10:01', event: 'Database operation timed out', type: 'error' }
    ]
  }
];