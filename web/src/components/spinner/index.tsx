const spinnerLines = Array.from({ length: 10 }, (_, index) => index);

export function Spinner() {
  return (
    <div className="relative h-12 w-12">
      {spinnerLines.map((line) => (
        <div
          key={line}
          className="absolute top-4.5 left-5.5 h-3 w-1 origin-center rounded bg-blue-base"
          style={{
            transform: `rotate(${line * 36}deg) translateY(-150%)`,
            opacity: line / 10,
            animationDelay: `${line * 0.098}s`,
          }}
        />
      ))}
    </div>
  );
}
