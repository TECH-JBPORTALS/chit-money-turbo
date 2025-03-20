export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center w-full h-full">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {title}
      </h4>
      <p className="text-sm w-96 text-center text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
