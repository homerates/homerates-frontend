export default function handler(req, res) {
  const k = process.env.OPENAI_API_KEY || "";
  res.status(200).json({
    hasKey: Boolean(k),
    keyPrefix: k ? k.slice(0, 7) : null,
    keyLength: k.length,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || null,
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || null,
    cwd: process.cwd(),
  });
}

