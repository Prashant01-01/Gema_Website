export default function BannerAd({ position = "top" }: { position?: "top" | "bottom" }) {
  return (
    <div className="w-full bg-gradient-to-r from-amber-50 to-red-50 border border-dashed border-[var(--gold)] rounded-lg flex items-center justify-center py-6">
      <div className="text-center text-[var(--gray-600)]">
        <p className="text-sm font-semibold">
          {position === "top" ? "Banner Advertisement" : "Advertisement"}
        </p>
        <p className="text-xs mt-1">Advertise with GEMA. Contact us for rates.</p>
      </div>
    </div>
  );
}
