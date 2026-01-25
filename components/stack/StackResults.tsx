type Props = {
  answers: Record<string, string>;
};

export default function StackResults({ answers }: Props) {
  return (
    <div className="w-full max-w-2xl space-y-6">
      <h1 className="text-3xl font-semibold">
        Your recommended stack
      </h1>

      <p className="text-gray-600">
        This is a solid starting point based on your answers.
        You can change anything.
      </p>

      <pre className="rounded-lg bg-gray-100 p-4 text-sm">
        {JSON.stringify(answers, null, 2)}
      </pre>
    </div>
  );
}
