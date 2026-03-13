export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="mx-auto w-full md:max-w-[40%] max-w-[95%] rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-3xl font-light text-stone-900">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-stone-600">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}
