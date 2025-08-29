import tools from '~/server/data/tools'

export default defineEventHandler(async () => {
  return tools as any
})
