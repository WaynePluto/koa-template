import { configKnex, initKnex } from '@/libs/knex'
import Router from '@/libs/router'
import { bodyParseJSON } from '@/middlewares/body-parse-json'
import { initTemplateRouter } from '@/routers/template'
import Koa from 'koa'
import supertest from 'supertest'
describe(`test template`, () => {
  const { PORT, JWT_SECRET = '', HOST, DATABASE, USER, PASSWORD } = process.env
  const app = new Koa()
  app.use(bodyParseJSON())
  const inst = configKnex({ host: HOST, database: DATABASE, user: USER, password: PASSWORD })
  app.use(initKnex(inst))
  const router = new Router()
  initTemplateRouter(router)
  app.use(router.init())
  const server = app.listen(PORT)
  const request = supertest.agent(server)

  afterAll(() => {
    inst.destroy()
    server.close()
  })

  let uuid = ''

  it('test add', async () => {
    const res = await request.post('/template').send({ name: 'test1' })
    expect(res.body.code).toBe(200)
    uuid = res.body.data
    expect(uuid).toHaveLength(32)
  })

  it('test get by uuid', async () => {
    const res = await request.get('/template').query({ uuid })
    expect(res.body.code).toBe(200)
    expect(res.body.data.name).toBe('test1')
  })

  it('test update by uuid', async () => {
    const res = await request.put('/template').send({ uuid, name: 'test2' })
    expect(res.body.code).toBe(200)
    expect(res.body.data).toBe(1)
  })

  it('test find list', async () => {
    const res = await request.get('/template/list').send({ page: 1, pageSize: 10 })
    expect(res.body.code).toBe(200)
    expect(res.body.data.total).toBeGreaterThan(0)
    expect(res.body.data.list).toBeDefined()
  })

  it('test tag delete by uuid', async () => {
    const res = await request.delete('/template/tag').send({ uuids: [uuid] })
    expect(res.body.code).toBe(200)
    expect(res.body.data).toBe(1)
  })

  it('test delete by uuid', async () => {
    const res = await request.delete('/template/danger').send({ uuids: [uuid] })
    expect(res.body.code).toBe(200)
    expect(res.body.data).toBe(1)
  })
})
