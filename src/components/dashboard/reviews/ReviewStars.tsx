type ReviewStarsProps = {
  rating: number;
  size?: "sm" | "md";
};

export function ReviewStars({ rating, size = "md" }: ReviewStarsProps) {
  const textSize = size === "sm" ? "text-sm" : "text-lg";

  return (
    <span className={`inline-flex items-center gap-0.5 ${textSize}`} aria-label={`${rating} étoiles sur 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? "text-amber-400" : "text-slate-200"} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}
