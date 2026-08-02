import type { BlogData, BlogPost } from "@/lib/blocks/types";
import { SectionHead, MediaBox, cardShell, asArray } from "../shared";

// `posts` is injected by the registry from the live Blog collection
// (BlockContext), not authored as part of the block's own stored data.
type BlogBlockData = BlogData & { posts: BlogPost[] };

export default function BlogBlock({ data }: { data: BlogBlockData }) {
  const posts = asArray<BlogPost>(data.posts);
  return (
    <section
      id="blog"
      aria-labelledby="blog-title"
      className="scroll-mt-24 border-y border-green-100 bg-white/40"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <SectionHead
          id="blog-title"
          kicker={data.kicker}
          title={data.title}
          viewAll={data.viewAllLabel}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <div key={i} className={cardShell}>
              <MediaBox src={p.imageUrl} alt={p.title} badge={p.badge} toneIndex={i} />
              <div className="flex flex-1 flex-col justify-between p-6 pt-4">
                <div>
                  <h3 className="mb-1 text-lg font-semibold">{p.title}</h3>
                  <p className="mb-4 line-clamp-2 text-sm text-gray-500">
                    {p.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    <span className="font-medium">{p.author}</span>
                    <span aria-hidden="true">·</span>
                    <span>{p.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{p.read}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
