export function TableFlashLogo() {
  return (
    <a href="#accueil" className="flex items-center gap-3" aria-label="TableFlash accueil">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-900/15">
        <svg
          aria-hidden="true"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.7 2.6 4.9 13.1c-.5.6-.1 1.5.7 1.5h5l-1.3 6.5c-.2 1 .9 1.6 1.6.8l8.5-10.7c.5-.6.1-1.5-.7-1.5h-4.8l1.4-6.3c.2-.9-.9-1.5-1.6-.8Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="text-xl font-black tracking-tight text-slate-950">TableFlash</span>
    </a>
  );
}
