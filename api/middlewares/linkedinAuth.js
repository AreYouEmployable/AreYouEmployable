export default async function linkedinAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing LinkedIn token" });
    }
  
    const token = authHeader.split(" ")[1];
  
    try {
      const profileRes = await fetch("https://api.linkedin.com/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!profileRes.ok) {
        return res.status(403).json({ message: "Invalid LinkedIn token" });
      }
  
      const profile = await profileRes.json();
  
      const emailRes = await fetch(
        "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (!emailRes.ok) {
        return res.status(403).json({ message: "Unable to fetch LinkedIn email" });
      }
  
      const emailData = await emailRes.json();
  
      req.user = {
        id: profile.id,
        name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
        email: emailData.elements?.[0]?.["handle~"]?.emailAddress || null,
      };
  
      next();
    } catch (err) {
      console.error("LinkedIn auth error:", err.message);
      res.status(500).json({ message: "LinkedIn authentication failed", error: err.message });
    }
};