import * as express from "express"
import * as cors from "cors"
import { createServer } from "http"
import { Server, Socket } from 'socket.io'

const app = express()
const server = createServer(app)
app.use(cors())

const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

io.on("connection", (socket: Socket) => {
  console.log("connection")
})

app.get("/", (req, res) => {
res.send("connection")
})


const port = process.env.PORT || 8000
server.listen(port, () => {
  console.log("listening on port " + port)
})