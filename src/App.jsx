import { Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react"
import { useState } from "react"
import { useForm } from "react-hook-form";

function App() {
  const { register, handleSubmit, reset } = useForm();
  const [lados, setLados] = useState(1)
  const [activateLados, setActivateLados] = useState(false)
  const [ladosArreglo, setLadosArreglo] = useState([])
  const [vectores, setVectores] = useState([])
  const abecedario = 'abcdefghijklmnñopqrstuvwxyz'
  function reiniciar() {
    reset()
    setLados(0)
    setActivateLados(false)
    setLadosArreglo([])
    setVectores([])

  }
  function resolverVectores(arreglo) {
    const datosFiltrados = ladosArreglo.map((lado, index) => {
      return {
        x: parseFloat(arreglo[`ladoX_${index}`]),
        y: parseFloat(arreglo[`ladoY_${index}`]),
      }
    })
    const datosFinal = datosFiltrados.map(dato => {
      const cosenoX = dato.x * Math.cos(dato.y * (Math.PI / 180))
      const senoY = dato.x * Math.sin(dato.y * (Math.PI / 180))
      return {
        resultadosX: {
          resultado: cosenoX,
          operaciones: `${dato.x}CM x cos(${dato.y}°) = ${cosenoX}`,
          valorInicial: dato.x
        },
        resultadosY: {
          resultado: senoY,
          operaciones: `${dato.x}CM x sen(${dato.y}°) = ${senoY}`,
          valorInicial: dato.y
        },
      }
    })
    return datosFinal
  }
  const onSubmit = data => {
    setVectores(resolverVectores(data))
    reset()
  }
  return (
    <main className="min-h-[1000px] grid justify-center py-24">
      <div>
        <div className="flex gap-x-10">
          <div className="min-w-[500px] grid gap-y-12">
            <div className="flex items-end gap-x-4">
              <Input
                type="number"
                label="Cuantos vectores tiene tu figura?"
                placeholder="0"
                labelPlacement="inside"
                className=" text-black "
                min={1}
                size="lg"
                value={lados}
                onValueChange={setLados}
              />
              <Button className="bg-blue-200" onClick={() => {
                let arregloLados = [];
                for (let i = 0; i < lados; i++) {
                  arregloLados.push({
                    startLetter: abecedario.charAt(i)
                  });
                }
                setLadosArreglo(arregloLados)
                setActivateLados(prevState => !prevState)
              }}> Calcular</Button>
            </div>
            {
              activateLados ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                  {
                    ladosArreglo.map((lado, index) => {
                      return (
                        <div key={index} >
                          <label >Lado {lado.startLetter}</label>
                          <div className="flex gap-x-2">
                            <Input
                              {...register(`ladoX_${index}`, { required: true })}
                              type="number"
                              label='Centimetros'
                              placeholder="0 cm"
                              className="text-black "
                              min={1}

                              size="lg" />
                            <Input
                              type="number"
                              placeholder="0°"
                              label='Angulo'
                              className="text-black "
                              min={0}
                              size="lg"
                              endContent={
                                <span>°</span>
                              }
                              {...register(`ladoY_${index}`, { required: true })}
                            />
                          </div>
                        </div>
                      )
                    })
                  }
                  <Input className="mt-4 text-black" type="submit">Enviar</Input>
                </form>
              )
                : ''
            }


          </div>
          {
            vectores.length > 0 ? (
              <div>
                <Table className="dark" aria-label="Example static collection table">
                  <TableHeader>
                    <TableColumn>LADO</TableColumn>
                    <TableColumn>COMPONENTE X</TableColumn>
                    <TableColumn>COMPONENTE Y</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {
                      vectores.map((vector, index) => (
                        <TableRow key={index}>
                          <TableCell>{abecedario.charAt(index).toUpperCase()}</TableCell>
                          <TableCell>{vector.resultadosX.operaciones}</TableCell>
                          <TableCell>{vector.resultadosY.operaciones}</TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
                <section className="mt-4 mb-2 flex justify-between items-center">
                  <h2 className="font-medium">Total Componente X:
                    <span className="ml-2 font-normal">
                      {
                        vectores.reduce((accumulator, currentValue) => {
                          return accumulator + currentValue.resultadosX.resultado
                        }, 0)
                      }
                    </span>
                  </h2>

                  <h2 className="font-medium">Total Componente Y:
                    <span className="ml-2 font-normal">
                      {
                        vectores.reduce((accumulator, currentValue) => {
                          return accumulator + currentValue.resultadosY.resultado
                        }, 0)
                      }
                    </span>
                  </h2>

                </section>
                <p>
                  <strong className="mr-2">θ =</strong>
                  {
                    Math.atan(
                      Math.abs(
                        (
                          vectores.reduce((accumulator, currentValue) => {
                            return accumulator + currentValue.resultadosY.resultado
                          }, 0)
                          /
                          vectores.reduce((accumulator, currentValue) => {
                            return accumulator + currentValue.resultadosX.resultado
                          }, 0)
                        )

                      )
                    )
                    * (180 / Math.PI)
                  }
                  °
                </p>
                <p>
                  <strong className="mr-2">R =</strong>
                  {
                    Math.sqrt(
                      Math.pow(vectores.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue.resultadosX.resultado
                      }, 0), 2)
                      +
                      Math.pow(vectores.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue.resultadosY.resultado
                      }, 0), 2)
                    )
                  }
                </p>
              </div>
            )
              : ''
          }
        </div>
        <Button className="my-6" color="danger" onClick={reiniciar}>
          Reiniciar
        </Button>
      </div>
    </main>
  )
}

export default App
{/* <div className="w-[400px] grid gap-x-4 grid-cols-2">
          <div>
            <label className="ml-2">X</label>
            <Input
              type="number"
              className="text-black "
              min={1}
              size="lg"
            />
          </div>
          <div>
            <label className="ml-2">Y</label>
            <Input
              type="number"
              className="text-black "
              min={1}
              size="lg"
            />
          </div>
        </div> */}