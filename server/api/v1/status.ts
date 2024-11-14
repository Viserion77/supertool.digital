export default defineEventHandler((event) => {
  console.info("event", event);

  const now = new Date().toISOString();
  return {
    updated_at: now,
  };
});
