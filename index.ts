import axios from "axios";
import cors from "cors"
import express from "express"

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

type LD = {
    id: number
    filmName: string
    rotationType: "CAV" | "CLV",
    region: string,
    lengthMinutes: number,
    videoFormat: "NTSC" | "PAL"
}

let lds: LD[] = [
    { id: 1, filmName: "True detective", rotationType: "CAV", region: "US", lengthMinutes: 112, videoFormat: "NTSC" },
    { id: 2, filmName: "Titanic", rotationType: "CLV", region: "UK", lengthMinutes: 1122, videoFormat: "PAL" },
    { id: 3, filmName: "Dragon ball", rotationType: "CAV", region: "US", lengthMinutes: 432, videoFormat: "NTSC" },
    { id: 4, filmName: "Fast and Furios", rotationType: "CLV", region: "ESP", lengthMinutes: 888, videoFormat: "PAL" }
]

app.get("/ld", (_req, res) => {
    return res.status(200).json(lds)
})

app.get("/ld/:id", (req, res) => {
    const ID = Number(req.params.id)
    const encontrado = lds.find((elem) => elem.id === ID)

    return encontrado
        ? res.status(200).json({ encontrado, message: "Ld encontrado" })
        : res.status(404).json({ message: "Disco no encontrado" })
})


app.post("/ld", (req, res) => {

    try {
        const { filmName, rotationType, region, lengthMinutes, videoFormat } = req.body

        const newId = Date.now()

        //validaciones de tipos 
        if (typeof (filmName) !== "string" || filmName.trim() === "") {
            return res.status(400).send("Error en la validacion del film")
        }
        if (typeof (lengthMinutes) !== "number" || lengthMinutes < 0) {
            return res.status(400).send("Error en la validacion de length")
        }
        if (typeof (region) !== "string" ||
            typeof (rotationType) !== "string" ||
            typeof (videoFormat) !== "string"
        ) {

            return res.status(400).send("rotation,videoformat y region deben ser strings")

        }

        const ROTATION = rotationType.toUpperCase()
        const VIDEO = videoFormat.toUpperCase()

        if (ROTATION !== "CAV" && ROTATION !== "CLV") {
            return res.status(400).send("no es posible esa rotation")
        }
        if (VIDEO !== "NTSC" && VIDEO !== "PAL") {
            return res.status(400).send("Esa plataforma no esta disponible")
        }


        const newld: LD = {

            ...req.body,
            id: newId,
            rotationType: ROTATION,
            videoFormat: VIDEO,
        }

        lds.push(newld)

        res.status(201).json({ lds, message: "LD creado correctamente" })

    } catch (err) {
        if (axios.isAxiosError(err)) {
            console.log("Error en la peticion", err.message)

        }
        else {
            console.log("error general", err)
        }
    }
}
)

app.delete("/ld/:id", (req, res) => {
    const ID = Number(req.params.id)
    const existe = lds.find((elem) => elem.id === ID)
    if (!existe) {
        return res.status(404).json({ message: "No encontrado ese id pa eliminar" })
    }

    lds = lds.filter((elem) => elem.id !== ID)

    return res.status(200).json({ lds, message: "ld eliminado correctamente" })

})

const testAPI = async () => {
    try {
        const resALL = (await axios.get("http://localhost:3000/ld")).data
        console.log("GET resALL ", resALL)

        const resID = (await axios.get("http://localhost:3000/ld/1")).data
        console.log("GET id ", resID)

        const resPOST = (await axios.post("http://localhost:3000/ld", {
            filmName: "MOMO",
            rotationType: "cav",
            region: "CH",
            lengthMinutes: 2344,
            videoFormat: "ntsc"
        })).data

        console.log("POST ", resPOST)

        const resDelete = (await axios.delete("http://localhost:3000/ld/1")).data
        console.log("DELETE ", resDelete)


    } catch (err) {
        if (axios.isAxiosError(err)) {
            console.log("Error en la peticion", err.message)

        }
        else {
            console.log("error general", err)
        }
    }
}



setTimeout(() => { testAPI() }, 1000)











app.listen(port, () => console.log(`Conectado al puerto ${port}`))