// Vercel Serverless Function: api/auth/login.js
export default async function handler(req, res) {
  // 1. Only allow POST requests for security
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  // Validate incoming payload strings
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Missing credentials' });
  }

  // 2. Fetch your database environment secrets securely stored in Vercel
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ success: false, message: 'Database environment variables not configured.' });
  }

  try {
    // 3. Call the secure SQL function (verify_user_password) via Supabase RPC endpoint
    const rpcUrl = `${SUPABASE_URL}/rest/v1/rpc/verify_user_password`;
    
    const dbResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        input_username: username.trim(),
        input_password: password
      })
    });

    if (!dbResponse.ok) {
      const errorText = await dbResponse.text();
      console.error("Database connection error:", errorText);
      return res.status(500).json({ success: false, message: 'Failed to communicate with database.' });
    }

    // The database returns true or false directly
    const isPasswordValid = await dbResponse.json();

    if (isPasswordValid) {
      // 4. Success: Return a confirmation token back to your index.html router
      return res.status(200).json({
        success: true,
        message: 'Authentication successful',
        user: { username: username.trim() }
      });
    } else {
      // Failed login validation
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

  } catch (error) {
    console.error("Server execution exception:", error);
    return res.status(500).json({ success: false, message: 'Internal server gateway error.' });
  }
}
