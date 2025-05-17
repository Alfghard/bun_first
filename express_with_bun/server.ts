import express from 'express'
//Ne marche pas trop, problème de compatibilité avec Windows?

const app = express()
const port = 8080
app.get('/', (req,res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})