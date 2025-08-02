interface StatCardProps {
  title: string;
  value: string;
}

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-lg rounded-lg p-6 transition-all duration-300 ease-in-out hover:border-[var(--primary-color)]/80 hover:bg-[var(--card-background-color)]/80">
      <h3 className="text-sm font-medium text-[var(--text-secondary)]">
        {title}
      </h3>
      <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">
        {value}
      </p>
    </div>
  );
}
