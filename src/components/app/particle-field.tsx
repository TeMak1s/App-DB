const particles = Array.from({ length: 10 }).map((_, index) => {
  const left = `${(index * 23 + 11) % 100}%`;
  const top = `${(index * 37 + 19) % 100}%`;
  const size = 2 + (index % 3);

  return { left, top, size };
});

export function ParticleField() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {particles.map((particle, index) => {
        return (
          <span
            key={`particle-${index}`}
            className="absolute rounded-full bg-cyan-200/35"
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: 0.35 + (index % 4) * 0.08,
            }}
          />
        );
      })}
    </div>
  );
}
