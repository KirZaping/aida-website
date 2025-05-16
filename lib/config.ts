// Configuration globale de l'application
export const siteConfig = {
  name: "Agence Com",
  description: "Agence de communication digitale",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/images/og-image.jpg",
  links: {
    twitter: "https://twitter.com/agencecom",
    github: "https://github.com/agencecom",
  },
}

// Configuration de l'espace client
export const clientConfig = {
  demoMode: process.env.NODE_ENV === "development",
  demoCredentials: {
    email: "demo@example.com",
    password: "password123",
  },
}

// Configuration de l'admin
export const adminConfig = {
  demoMode: process.env.NODE_ENV === "development",
}
