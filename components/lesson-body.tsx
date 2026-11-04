import type { LessonBlock } from "@/lib/types";

export function LessonBody({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <div className="prose-lesson max-w-none">
      {blocks.map((block, index) => {
        if (block.type === "code") {
          return (
            <pre key={index} className="overflow-x-auto">
              <code>{block.text}</code>
            </pre>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={index}>
              {(block.items ?? []).map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "tip") {
          return (
            <p key={index} className="rounded-lg border border-blush/30 bg-blush-soft px-3 py-2 text-sm not-italic">
              {block.text}
            </p>
          );
        }
        return <p key={index}>{block.text}</p>;
      })}
    </div>
  );
}
