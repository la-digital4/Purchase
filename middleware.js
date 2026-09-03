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
      // 1. Get the encoded Base64 credentials string
      const basicAuth = authorizationHeader.split(' ')[1];
      
      // 2. Decode the Base64 string correctly using standard Web APIs
      const decoded = atob(basicAuth);
      
      // 3. Separate the username and password by splitting at the colon ':'
      const [username, password] = decoded.split(':');

      // 4. Validate against our authorized list
      if (AUTHORIZED_USERS[username] && AUTHORIZED_USERS[username] === password) {
        // Access granted: Continue to the dashboard page safely
        return; 
      }
    } catch (error) {
      // If decoding fails, fall through to trigger the login prompt
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
