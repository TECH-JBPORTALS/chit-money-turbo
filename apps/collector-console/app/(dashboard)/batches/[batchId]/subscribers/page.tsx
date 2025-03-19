export default function Page() {
  return (
    <div className="flex flex-col gap-8 text-2xl h-svh">
      {/* Chit Fund Title */}
      <div>
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Subscribers
        </h2>
        <p className="text-sm text-muted-foreground">
          All subscribers in this batch
        </p>
      </div>
    </div>
  );
}
