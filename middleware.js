// Define your authorized users here (Username : Password)
const AUTHORIZED_USERS = {
  "admin": "SuperSecretPassword2026",
  "venkatesh": "VenkateshSecure789",
  "guest_user": "WelcomePass123"
};

export function middleware(req) {
  const authorizationHeader = req.headers.get('authorization');

  if (authorizationHeader) {
    try {
      // Decode the standard browser Basic Auth header
      const basicAuth = authorizationHeader.split(' ')[1];
      const credentials = atob(basicAuth).split(':');
      const username = credentials[0];
      const password = credentials[1];

      // Check if the credentials match our allowed list
      if (AUTHORIZED_USERS[username] && AUTHORIZED_USERS[username] === password) {
        // Access granted: Continue to the requested static file
        return; 
      }
    } catch (error) {
      // Fall through to request authentication if decoding fails
    }
  }

  // Trigger the browser's native login popup if wrong or missing credentials
  return new Response('Authentication Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Portal Area"',
    },
  });
}

// Configure middleware to protect the entry paths
export const config = {
  matcher: ['/', '/index.html'],
};
