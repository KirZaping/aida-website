export const metadata = {
  title: "Mentions légales – AIDA",
  description: "Mentions légales de AIDA, agence de transformation digitale",
}

export default function MentionsLegalesPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Mentions légales</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Éditeur du site</h2>
        <p>
          Nom de la société : <strong>AIDA</strong> (SAS au capital de 10 000 €)<br/>
          Siège social : 123 Avenue de la Communication, 75001 Paris<br/>
          RCS Paris : 123 456 789<br/>
          Numéro de TVA intracommunautaire : FR12 3456 78900<br/>
          Directeur de la publication : M. Jean Dupont (Président)
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Hébergement</h2>
        <p>
          Le présent site est hébergé par Vercel Inc.<br/>
          Adresse : 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br/>
          Site web : <a href="https://vercel.com" className="text-blue-600 hover:underline">vercel.com</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Publication</h2>
        <p>
          Conception et réalisation technique : équipe AIDA<br/>
          Contact : <a href="mailto:contact@aida.fr" className="text-blue-600 hover:underline">contact@aida.fr</a><br/>
          Téléphone : +33 1 23 45 67 89
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Propriété intellectuelle</h2>
        <p>
          Tous les contenus (textes, illustrations, logos, images, vidéos…) publiés sur ce site sont la propriété exclusive de AIDA, sauf mention contraire.  
          Toute reproduction ou représentation totale ou partielle, par quelque procédé que ce soit, est interdite sans autorisation écrite.
        </p>
      </section>
    </main>
  )
}
