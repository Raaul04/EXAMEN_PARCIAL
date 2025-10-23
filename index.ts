import axios from "axios";
import cors from "cors"
import express from "express"

const app=express()
const port=3000

app.use(cors())
app.use(express.json())














app.listen(port,()=>console.log(`Conectado al puerto ${port}`))