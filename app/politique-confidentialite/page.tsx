export const metadata = {
  title: 'Politique de confidentialité | AIDA',
  description: 'Découvrez comment AIDA collecte, utilise et protège vos données personnelles conformément au RGPD.',
};

const PrivacyPolicy = () => {
  return (
    <main className="container mx-auto px-4 py-12 text-xl text-gray-800">
      <h1 className="text-3xl font-bold mb-8">Politique de confidentialité</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">1. Responsable du traitement</h2>
        <p>
          La présente politique de confidentialité s'applique au site internet de l'agence AIDA, exploitée par Gouthière Thomas, entrepreneur individuel immatriculé au RCS du Mans sous le numéro 933 571 101. Le siège social est situé à Coulaines, France. Pour toute question relative à la protection des données personnelles, vous pouvez nous contacter à l'adresse suivante : <a href="mailto:aidanetcom@gmail.com" className="text-blue-600 underline">aidanetcom@gmail.com</a>.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">2. Données collectées</h2>
        <p>
          Nous collectons les données personnelles suivantes via notre site :
        </p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>Nom et prénom</li>
          <li>Adresse e-mail</li>
          <li>Numéro de téléphone</li>
          <li>Contenu du message envoyé via le formulaire de contact</li>
        </ul>
        <p className="mt-4">
          Ces données sont collectées uniquement lorsque vous remplissez le formulaire de contact disponible sur notre site.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">3. Finalités du traitement</h2>
        <p>
          Les données collectées sont utilisées pour :
        </p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>Répondre à vos demandes de contact ou d'information</li>
          <li>Établir des devis ou des propositions commerciales</li>
          <li>Assurer le suivi de la relation client</li>
        </ul>
        <p className="mt-4">
          Aucune donnée n'est utilisée à des fins de prospection commerciale sans votre consentement préalable.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">4. Base légale du traitement</h2>
        <p>
          Le traitement de vos données personnelles repose sur l'article 6.1.a du RGPD : votre consentement explicite donné lors de l'envoi du formulaire de contact.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">5. Durée de conservation</h2>
        <p>
          Vos données personnelles sont conservées pendant une durée maximale de 12 mois à compter de leur collecte, sauf obligation légale ou réglementaire imposant une durée de conservation plus longue.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">6. Destinataires des données</h2>
        <p>
          Vos données sont exclusivement destinées à l'agence AIDA et ne sont en aucun cas transmises à des tiers, sauf obligation légale.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">7. Sécurité des données</h2>
        <p>
          Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour garantir la sécurité et la confidentialité de vos données personnelles.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">8. Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez des droits suivants :
        </p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>Droit d'accès à vos données personnelles</li>
          <li>Droit de rectification de vos données</li>
          <li>Droit à l'effacement de vos données</li>
          <li>Droit à la limitation du traitement</li>
          <li>Droit d'opposition au traitement</li>
          <li>Droit à la portabilité de vos données</li>
        </ul>
        <p className="mt-4">
          Pour exercer ces droits, veuillez nous contacter à l'adresse suivante : <a href="mailto:aidanetcom@gmail.com" className="text-blue-600 underline">aidanetcom@gmail.com</a>.
        </p>
        <p className="mt-2">
          Vous avez également le droit d'introduire une réclamation auprès de la CNIL si vous estimez que vos droits ne sont pas respectés.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">9. Cookies</h2>
        <p>
          Notre site n'utilise pas de cookies ou autres traceurs à des fins de suivi ou de publicité. Seuls des cookies techniques nécessaires au bon fonctionnement du site peuvent être utilisés.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">10. Modifications de la politique de confidentialité</h2>
        <p>
          Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. Les modifications prendront effet immédiatement après la publication de la politique mise à jour sur notre site.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
        <p>
          Pour toute question relative à cette politique de confidentialité, vous pouvez nous contacter à l'adresse suivante : <a href="mailto:aidanetcom@gmail.com" className="text-blue-600 underline">aidanetcom@gmail.com</a>.
        </p>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
