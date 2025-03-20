import EmptyState from "@/components/empty-state";

export default function Page() {
  return (
    <div className="flex flex-col gap-8 text-2xl h-full min-h-full">
      {/* Chit Fund Title */}
      <div>
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          All Subscribers
        </h2>
        <p className="text-sm text-muted-foreground">
          All subscribers in this chit fund house
        </p>
      </div>

      {/** Content */}
      <EmptyState
        title="No Subscribers"
        description="As soon as subscribers start participating in on of your batches they will appear over here"
      />
    </div>
  );
}
