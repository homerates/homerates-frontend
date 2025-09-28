export default function handler(req, res) {
  res.status(200).json({
    method: req.method,
    messages: req.body?.messages ?? null,
    typeofBody: typeof req.body,
  });
}

