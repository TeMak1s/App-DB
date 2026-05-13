export function ParticleField() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {Array.from({ length: 26 }).map((_, i) => {
        const left = `${(i * 17) % 100}%`;
        const top = `${(i * 31) % 100}%`;
        const size = 2 + (i % 4);
        const delay = (i % 7) * 0.5;
        const duration = 4 + (i % 5);
        return (
          <span
            key={`particle-${i}`}
            className="absolute rounded-full bg-cyan-300/80"
            style={{
              left,
              top,
              width: `${size}px`,
              height: `${size}px`,
              filter: "drop-shadow(0 0 8px rgba(20,216,255,0.9))",
              animation: `pulseGlow ${duration}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
