export const metadata = {
  title: "Politique de confidentialité – AIDA",
  description: "Politique de confidentialité de AIDA, agence de transformation digitale",
}

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Collecte des données</h2>
        <p>
          Nous collectons les données suivantes lorsque vous utilisez notre site ou nous contactez :  
          nom, prénom, adresse e-mail, raison sociale, contenu de vos messages.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. Finalités du traitement</h2>
        <ul className="list-disc list-inside">
          <li>Réponse à vos demandes de contact et devis</li>
          <li>Envoi de nos newsletters (avec votre consentement)</li>
          <li>Statistiques anonymes de fréquentation</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Durée de conservation</h2>
        <p>
          Vos données sont conservées uniquement le temps nécessaire au traitement de votre demande, puis archivées 3 années supplémentaires à des fins légales.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Partage des données</h2>
        <p>
          Nous ne partageons pas vos données avec des tiers, sauf obligation légale ou prestataires techniques (hébergeur, CRM).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité.  
          Pour exercer vos droits, contactez-nous à : <a href="mailto:contact@aida.fr" className="text-blue-600 hover:underline">contact@aida.fr</a>
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">6. Responsable de traitement</h2>
        <p>
          Société : AIDA<br/>
          Email : <a href="mailto:contact@aida.fr" className="text-blue-600 hover:underline">contact@aida.fr</a><br/>
          Adresse : 123 Avenue de la Communication, 75001 Paris
        </p>
      </section>
    </main>
  )
}
