import express from 'express'

export const expressServer = (): void => {
  const app = express()

  app.get('/', (req, res) => {
    console.log(req.query)
    if (!req.query.code) {
      res.send('認可に失敗しました。')
      return
    }

    res.send('認可に成功しました!<br/>このページを閉じてください。')
  })

  app.listen(4200)
}
