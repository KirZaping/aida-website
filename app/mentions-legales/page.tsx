// app/mentions-legales/page.tsx

export const metadata = {
  title: "Mentions légales – AIDA",
  description: "Consultez les mentions légales du site de AIDA, agence de transformation digitale spécialisée en stratégie numérique, SEO et communication.",
}

export default function MentionsLegalesPage() {
  return (
    <main className="container mx-auto px-4 py-12 text-xl text-gray-800">
      <h1 className="text-3xl font-bold mb-8">Mentions légales</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">1. Éditeur du site</h2>
        <p>
          Le présent site est édité par l'entreprise individuelle <strong>Thomas Gouthière EI</strong>, exerçant sous le nom commercial <strong>AIDA</strong>, une agence de transformation digitale spécialisée dans le marketing numérique, la communication, le SEO et la gestion de réseaux sociaux.
        </p>
        <p className="mt-4">
          <strong>Forme juridique :</strong> Entrepreneur Individuel<br />
          <strong>SIREN :</strong> 933 571 101<br />
          <strong>Adresse :</strong> 8 rue de la Bouillère, 72190 Coulaines, France<br />
          <strong>TVA intracommunautaire :</strong> FR 38933571101<br />
          <strong>Directeur de la publication :</strong> Thomas Gouthière<br />
          <strong>Adresse mail :</strong> <a href="mailto:aidanetcom@gmail.com" className="text-blue-600 underline">aidanetcom@gmail.com</a>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">2. Hébergement</h2>
        <p>
          Le site est hébergé par <strong>Vercel Inc.</strong>, société spécialisée dans l’hébergement d’applications web statiques et serverless.
        </p>
        <p className="mt-4">
          <strong>Adresse :</strong> Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA<br />
          <strong>Site web :</strong> <a href="https://vercel.com" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://vercel.com</a>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">3. Publication et contact</h2>
        <p>
          Le site a été conçu et développé par l’agence <strong>AIDA</strong>.
        </p>
        <p className="mt-4">
          Pour toute question relative au site, vous pouvez nous contacter à : <a href="mailto:aidanetcom@gmail.com" className="text-blue-600 underline">aidanetcom@gmail.com</a>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">4. Propriété intellectuelle</h2>
        <p>
          L’ensemble des contenus présents sur ce site (textes, images, illustrations, éléments graphiques, vidéos, code source, structure du site) sont la propriété exclusive de AIDA, sauf mention contraire.
        </p>
        <p className="mt-4">
          Toute reproduction, représentation, modification, publication, adaptation, totale ou partielle, de ces éléments, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de AIDA.
        </p>
        <p className="mt-4">
          Toute utilisation non autorisée du site ou de l’un quelconque de ces éléments sera considérée comme constitutive d’une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de la propriété intellectuelle.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">5. Droit applicable</h2>
        <p>
          Le présent site est soumis au droit français. En cas de litige, et après tentative de résolution amiable, les tribunaux français seront seuls compétents.
        </p>
      </section>
    </main>
  )
}
