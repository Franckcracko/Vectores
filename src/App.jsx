import { Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";

function App() {
  const { register, handleSubmit, reset } = useForm();
  const [lados, setLados] = useState(1)
  const [activateLados, setActivateLados] = useState(false)
  const [ladosArreglo, setLadosArreglo] = useState([])
  const [vectores, setVectores] = useState([])
  const [unidad, setUnidad] = useState('')
  const [componentX, setComponentX] = useState(0)
  const [componentY, setComponentY] = useState(0)
  const [angulo, setAngulo] = useState(0)
  const abecedario = 'abcdefghijklmnñopqrstuvwxyz'

  useEffect(() => {
    const y = vectores.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.resultadosY.resultado
    }, 0)
    const x = vectores.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.resultadosX.resultado
    }, 0)
    setComponentX(x)
    setComponentY(y)
    const result = anguloResolve({ x: x, y: y })
    setAngulo(result)
  }, [vectores])


  function reiniciar() {
    reset()
    setLados(1)
    setUnidad('')
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
          operaciones: `${dato.x}${unidad} x cos(${dato.y}°) = ${cosenoX}`,
          valorInicial: dato.x
        },
        resultadosY: {
          resultado: senoY,
          operaciones: `${dato.x}${unidad} x sen(${dato.y}°) = ${senoY}`,
          valorInicial: dato.y
        },
      }
    })
    return datosFinal
  }
  const anguloResolve = ({ y, x }) => {
    const angulo = Math.atan(
      Math.abs(
        (
          y
          /
          x
        )
      )
    ) * (180 / Math.PI)
    // - -
    if (x < 0 && y < 0) {
      return 180 + angulo
    }
    // - +
    if (x < 0 && y > 0) {
      return 180 - angulo
    }
    // + -
    if (x > 0 && y < 0) {
      return 360 - angulo
    }
    // + +
    return angulo
  }
  const onSubmit = data => {
    const dataVectores = resolverVectores(data)
    setVectores(dataVectores)
    reset()
  }


  return (
    <main className="min-h-[1000px] grid justify-center py-12">
      <div>
        <h1 className="text-center text-6xl mb-12 titulo">Titulo</h1>
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
                isRequired
              />
              <Input
                type="text"
                label="Unidad o Magnitud"
                placeholder="cm"
                labelPlacement="inside"
                className=" text-black "
                size="lg"
                value={unidad}
                onValueChange={setUnidad}
                isRequired
              />
              <Button
                disabled={lados === '0' || unidad === ''}
                className="bg-blue-200"
                onClick={() => {
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
                              type="text"
                              label='Unidad o Magnitud'
                              placeholder={`0 ${unidad}`}
                              className="text-black "
                              min={1}
                              size="lg"
                            />
                            <Input
                              type="text"
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
                        componentX
                      }
                    </span>
                  </h2>

                  <h2 className="font-medium">Total Componente Y:
                    <span className="ml-2 font-normal">
                      {
                        componentY
                      }
                    </span>
                  </h2>

                </section>
                <div className="flex justify-between content-start">
                  <div>
                    <p>
                      <strong className="mr-2">θ =</strong>
                      {
                        angulo
                      }
                      °
                    </p>
                    <p>
                      <strong className="mr-2">R =</strong>
                      {
                        Math.sqrt(
                          Math.pow(componentX, 2)
                          +
                          Math.pow(componentY, 2)
                        )
                      }
                      <span className='ml-2'>
                        {
                          unidad
                        }
                      </span>
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong className="mr-2">θ =</strong>
                      {
                        Math.floor(angulo)
                      }
                      °
                    </p>
                    <p>
                      <strong className="mr-2">R =</strong>
                      {
                        Math.floor(
                          Math.sqrt(
                            Math.pow(componentX, 2)
                            +
                            Math.pow(componentY, 2)
                          )
                        )
                      }
                      <span className='ml-2'>
                        {
                          unidad
                        }
                      </span>
                    </p>
                  </div>
                </div>

                <p>
                  Esta en el cuadrante :
                  <span className='ml-4'>
                    {
                      componentX > 0 && componentY > 0 ? 'I' : componentX < 0 && componentY > 0 ? 'II' : componentX < 0 && componentY < 0 ? 'III' : 'IV'
                    }
                  </span>
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