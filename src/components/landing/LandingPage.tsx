import { TableFlashLogo } from "./TableFlashLogo";

const navLinks = [
  { label: "Fonctionnalités", href: "#fonctionnalites" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "Témoignages", href: "#temoignages" },
  { label: "Ressources", href: "#ressources" },
  { label: "À propos", href: "#a-propos" },
];
const featureHighlights = ["Menu QR", "Commande sans paiement en ligne", "Avis clients", "QR par table"];
const pilotFeatures = ["installation offerte", "menu configuré", "QR code fourni", "sans engagement"];

const pricingPlans = [
  {
    name: "Starter",
    price: "29 €",
    description: "Pour digitaliser votre menu et collecter vos premiers avis.",
    features: ["Menu QR", "Catégories et produits", "Disponibilités", "Avis clients de base"],
  },
  {
    name: "Pro",
    price: "59 €",
    description: "Le meilleur choix pour recevoir les commandes à table.",
    features: ["QR par table", "Commandes clients", "Tableau des commandes", "Promotions et statistiques"],
    recommended: true,
  },
  {
    name: "Premium",
    price: "99 €",
    description: "Pour les établissements qui veulent aller plus loin.",
    features: ["Fonctions avancées futures", "Support prioritaire", "Statistiques avancées", "Accompagnement renforcé"],
  },
];

const restaurants = ["Le Bistrot des Halles", "Snack Time", "Le Comptoir", "Burger House"];

const faqs = [
  {
    question: "Les clients paient-ils en ligne ?",
    answer: "Non. TableFlash prend la commande, puis le paiement reste à la caisse ou auprès du serveur.",
  },
  {
    question: "Combien de temps faut-il pour mettre en place TableFlash ?",
    answer: "La page pilote est pensée pour être configurée rapidement avec votre menu, vos tables et vos QR codes.",
  },
  {
    question: "Puis-je modifier mon menu quand je veux ?",
    answer: "Oui. Le tableau de bord permettra de mettre à jour les produits, prix, promos et ruptures en autonomie.",
  },
];

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="#offre-pilote"
      className="inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-base font-bold text-white shadow-xl shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-800"
    >
      {children}
    </a>
  );
}

function SecondaryButton({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="#tarifs"
      className="inline-flex min-h-12 items-center justify-center rounded-full border border-emerald-200 bg-white px-6 py-3 text-base font-bold text-emerald-800 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
    >
      {children}
    </a>
  );
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-700">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p>
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8" aria-label="Navigation principale">
        <TableFlashLogo />
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-semibold text-slate-600 hover:text-emerald-700">
              {link.label}
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <a href="#connexion" className="rounded-full px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100">
            Se connecter
          </a>
          <PrimaryButton>Demander une démo</PrimaryButton>
        </div>
      </nav>
    </header>
  );
}

function ProductPreview() {
  const orders = [
    { table: "Table 12", item: "Burger Classique ×2", total: "31,80 €" },
    { table: "Table 8", item: "Salade César", total: "14,50 €" },
  ];

  return (
    <section id="fonctionnalites" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 sm:p-6">
          <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-sm text-emerald-300">Dashboard restaurant</p>
                <h3 className="text-2xl font-black">Le Bistrot des Halles</h3>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-bold text-emerald-200">Service midi en cours</span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                ["Commandes", "18"],
                ["Avis", "4,8/5"],
                ["Tables QR", "24"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
                  <p className="text-sm text-slate-300">{label}</p>
                  <p className="mt-2 text-3xl font-black">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-4 text-slate-950">
                <div className="flex items-center justify-between">
                  <h4 className="font-black">Commandes en direct</h4>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">À valider</span>
                </div>
                <div className="mt-4 space-y-3">
                  {orders.map((order) => (
                    <div key={order.table} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-black text-emerald-800">{order.table}</p>
                        <p className="font-black">{order.total}</p>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{order.item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 text-slate-950 ring-1 ring-emerald-100">
                <h4 className="font-black">Avis clients</h4>
                <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-2xl">★★★★★</p>
                  <p className="mt-2 text-sm text-slate-600">“Service rapide, menu clair depuis le QR code.”</p>
                </div>
                <div className="mt-4 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                  <span className="text-sm font-bold text-slate-600">Nouveaux avis</span>
                  <span className="text-2xl font-black text-emerald-700">+12</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm rounded-[2.5rem] border border-slate-200 bg-slate-950 p-3 shadow-2xl shadow-emerald-900/15">
          <div className="rounded-[2rem] bg-white p-5">
            <div className="mx-auto mb-4 h-1.5 w-20 rounded-full bg-slate-200" />
            <p className="text-sm font-bold text-emerald-700">Le Bistrot des Halles</p>
            <div className="mt-2 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-950">Menu digital</h3>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">Table 12</span>
            </div>
            <div className="mt-5 flex gap-2 overflow-hidden">
              {['Plats', 'Boissons', 'Desserts'].map((tab, index) => (
                <span key={tab} className={`rounded-full px-4 py-2 text-sm font-bold ${index === 0 ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'}`}>{tab}</span>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              {[
                ["Burger Classique", "15,90 €", "Pain brioché, steak, cheddar"],
                ["Frites Maison", "4,50 €", "Sel de Guérande"],
                ["Tiramisu", "6,90 €", "Recette maison"],
              ].map(([name, price, description]) => (
                <div key={name} className="flex gap-3 rounded-2xl border border-slate-100 p-3 shadow-sm">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-amber-100" />
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-slate-950">{name}</p>
                    <p className="mt-1 text-xs text-slate-500">{description}</p>
                    <p className="mt-2 font-black text-emerald-700">{price}</p>
                  </div>
                  <button className="h-9 w-9 rounded-full bg-emerald-700 text-lg font-black text-white" aria-label={`Ajouter ${name}`}>+</button>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-black text-white">Voir le panier · 36,30 €</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section id="accueil" className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#d1fae5,transparent_34%),linear-gradient(180deg,#ffffff_0%,#f9fafb_100%)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-28">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-800 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Offre pilote disponible maintenant
          </div>
          <h1 className="mt-8 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Le menu QR qui prend les commandes et aide les restaurants à récolter plus d’avis clients.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
            Créez votre menu digital en quelques minutes, laissez vos clients commander depuis leur téléphone, payez à la caisse ou au serveur, et collectez plus d’avis après le repas.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton>Demander une démo</PrimaryButton>
            <SecondaryButton>Voir l’offre pilote</SecondaryButton>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {featureHighlights.map((feature) => (
              <span key={feature} className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm">
                <span className="mr-2 text-emerald-700">✓</span>{feature}
              </span>
            ))}
          </div>
        </div>
        <div className="relative min-h-[520px]">
          <div className="absolute right-0 top-8 h-72 w-72 rounded-full bg-emerald-200/70 blur-3xl" />
          <div className="relative ml-auto max-w-lg rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10">
            <div className="rounded-[1.5rem] bg-emerald-950 p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-200">Commande #1257</p>
                  <h3 className="mt-1 text-2xl font-black">Table 12</h3>
                </div>
                <span className="rounded-full bg-emerald-400 px-3 py-1 text-sm font-black text-emerald-950">Nouvelle</span>
              </div>
              <div className="mt-5 space-y-3 rounded-2xl bg-white p-4 text-slate-950">
                <div className="flex justify-between"><span>Burger Classique ×2</span><strong>31,80 €</strong></div>
                <div className="flex justify-between"><span>Limonade ×2</span><strong>9,00 €</strong></div>
                <div className="border-t border-slate-100 pt-3 text-sm font-bold text-slate-600">Paiement à la caisse ou au serveur</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-sm font-bold text-slate-500">Avis collectés</p>
                <p className="mt-2 text-3xl font-black text-emerald-700">248</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-500">Temps gagné</p>
                <p className="mt-2 text-3xl font-black text-slate-950">32%</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 hidden w-64 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 sm:block">
            <p className="text-sm font-black text-slate-950">QR Table 12</p>
            <div className="mt-3 grid grid-cols-5 gap-1 rounded-2xl bg-slate-50 p-3">
              {Array.from({ length: 45 }).map((_, index) => (
                <span key={index} className={`aspect-square rounded-sm ${index % 3 === 0 || index % 7 === 0 ? 'bg-slate-950' : 'bg-white'}`} />
              ))}
            </div>
            <p className="mt-3 text-xs font-bold text-slate-500">Scannez, commandez, payez sur place.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    ["1", "Le client scanne", "Un QR code général ou dédié à sa table ouvre le menu digital."],
    ["2", "Il commande", "Le client ajoute ses plats au panier et envoie la commande sans compte."],
    ["3", "Il paie à la caisse ou au serveur", "Votre équipe garde le paiement habituel, simple et rassurant."],
  ];

  return (
    <section className="bg-slate-50 px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Comment ça marche" title="Une expérience fluide, sans paiement en ligne" description="TableFlash respecte votre organisation actuelle tout en accélérant la prise de commande et la collecte d’avis." />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map(([number, title, description]) => (
            <div key={number} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-xl font-black text-white">{number}</div>
              <h3 className="mt-6 text-xl font-black text-slate-950">{title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="tarifs" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <SectionHeader eyebrow="Tarifs" title="Des offres simples pour chaque restaurant" description="Commencez avec le menu QR, puis activez les commandes et les QR par table quand votre équipe est prête." />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <div key={plan.name} className={`relative rounded-[1.75rem] border p-7 shadow-sm ${plan.recommended ? 'border-emerald-700 bg-emerald-950 text-white shadow-2xl shadow-emerald-900/20' : 'border-slate-200 bg-white text-slate-950'}`}>
            {plan.recommended && <span className="absolute right-6 top-6 rounded-full bg-emerald-300 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-950">Recommandé</span>}
            <h3 className="text-2xl font-black">{plan.name}</h3>
            <p className={`mt-3 min-h-14 leading-7 ${plan.recommended ? 'text-emerald-50' : 'text-slate-600'}`}>{plan.description}</p>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-5xl font-black">{plan.price}</span>
              <span className={`pb-2 font-bold ${plan.recommended ? 'text-emerald-100' : 'text-slate-500'}`}>/mois</span>
            </div>
            <ul className="mt-7 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-3 font-semibold"><span className={plan.recommended ? 'text-emerald-300' : 'text-emerald-700'}>✓</span>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function BetaOffer() {
  return (
    <section id="offre-pilote" className="px-5 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-emerald-700 p-8 text-white shadow-2xl shadow-emerald-900/20 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-100">Offre bêta</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">14 jours offerts pour les 10 premiers restaurants pilotes</h2>
          </div>
          <a href="#accueil" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-base font-black text-emerald-800 shadow-xl shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-50">Réserver ma démo</a>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {pilotFeatures.map((feature) => (
            <span key={feature} className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold ring-1 ring-white/20">{feature}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section id="temoignages" className="bg-slate-50 px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Témoignages" title="Pensé avec des restaurants de terrain" description="Des exemples réalistes pour valider une expérience simple, claire et adaptée au service quotidien." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {restaurants.map((restaurant, index) => (
            <article key={restaurant} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl font-black text-emerald-700">{restaurant.charAt(0)}</div>
              <h3 className="mt-5 font-black text-slate-950">{restaurant}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{index % 2 === 0 ? 'Un menu QR clair et des commandes mieux organisées pendant le service.' : 'Une solution simple pour réduire l’attente et encourager les avis clients.'}</p>
              <p className="mt-4 text-amber-500">★★★★★</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQPreview() {
  return (
    <section id="ressources" className="mx-auto max-w-4xl px-5 py-20 lg:px-8">
      <SectionHeader eyebrow="FAQ" title="Les réponses avant votre démo" description="TableFlash reste volontairement simple pour la phase pilote : commandes, QR codes et avis, sans complexité inutile." />
      <div className="mt-10 space-y-4">
        {faqs.map((faq) => (
          <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" open={faq.question === faqs[0].question}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black text-slate-950">
              {faq.question}
              <span className="text-emerald-700 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 leading-7 text-slate-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="a-propos" className="border-t border-slate-200 bg-white px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <TableFlashLogo />
        <p className="text-sm font-semibold text-slate-500">© 2026 TableFlash. Menu QR, commandes sans paiement en ligne et avis clients.</p>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar />
      <main>
        <Hero />
        <ProductPreview />
        <HowItWorks />
        <Pricing />
        <BetaOffer />
        <SocialProof />
        <FAQPreview />
      </main>
      <Footer />
    </div>
  );
}
