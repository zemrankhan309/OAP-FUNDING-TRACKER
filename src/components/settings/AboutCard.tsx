export default function AboutCard() {
  return (
    <div className="rounded-xl bg-white p-8 shadow">

      <h2 className="mb-6 text-3xl font-bold">
        About
      </h2>

      <div className="space-y-4">

        <p>
          <strong>Application</strong>
          <br />
          Family Funding Manager
        </p>

        <p>
          <strong>Version</strong>
          <br />
          1.0.0
        </p>

        <p>
          <strong>Built With</strong>
          <br />
          React • TypeScript • Firebase • Tailwind CSS
        </p>

        <p className="pt-4 text-sm text-gray-500">
          © 2026 Family Funding Manager
        </p>

      </div>

    </div>
  );
}