import { Button, ButtonGroup, Card, Container, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Heading, IconButton, Input, Select, Text } from '@chakra-ui/react'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { env } from '~/env'
// import DatePicker from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker.css'
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { DeleteIcon, SearchIcon } from '@chakra-ui/icons'



const PAYMENT_METHOD_TYPES = [
    "Sin utilizacion Sist. Financiero",
    "Conpensacion de deudas",
    "Tarjetas de debito",
    "Tarjetas de credito",
    "Dinero Electronico",
    "Otros con utilizacion del sitema financiero",
    "Endoso de titulos",
] as const

const TIME_UNITS = z.enum(["Dias", "Meses", "Años"]);

const saleProductShema = z.object({
    code: z.string(),
    name: z.string().optional(),
    qty: z.number(),
    unit_price: z.number().optional(),
    discount: z.number().optional(),
    total: z.number(),
})

const salePaymentMethodShema = z.object({
    method: z.enum(PAYMENT_METHOD_TYPES),
    amount: z.number(),
    time_unit: TIME_UNITS,
    time_value: z.number(),
}) 


const saleShema = z.object({
    operation_date: z.date(),
    product: z.array(saleProductShema),
    total_amount: z.number().nonnegative(),
    client: z.string(),
    client_document: z.string(),
    payment_method: z.array(salePaymentMethodShema),
})

const defaultPM: PaymentMethod = {
    method: "Sin utilizacion Sist. Financiero",
    amount: 0,
    time_unit: "Meses",
    time_value: 0,
}

export type Sale = z.infer<typeof saleShema>

type PaymentMethod = z.infer<typeof salePaymentMethodShema>
type ProductForState = z.infer<typeof saleProductShema>


interface Product extends ProductForState{
    supplier_cost: number
    micro: number
    iva: number
    salvament_margin: number
    profit_margin: number
}
 
interface Props{
    saleId? : string
}


const defaultProduct: ProductForState = {
    code: "",
    name: "",
    qty: 0,
    total: 0
}   

const SaleForm = ({ saleId} : Props) => {
    const [totalAmount, setTotalAmount] = useState(0);
    const [foundClient, setFoundClient] = useState<{
        _id : string,
        firstname: string
    } | null>();


    const { 
        register,
        control, 
        reset,
        getValues,
        setValue,
        handleSubmit, 
        formState: {errors},
    } = useForm<Sale>({
        resolver:  zodResolver(saleShema),
        defaultValues: async () => {
            if(!saleId) return { 
                payment_method: [defaultPM],
                product: [defaultProduct],
            };
            const { data } = await axios.get(
                `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/clients/${saleId}`,
                {withCredentials: true}
            )
            return data.data;
        }
    })

    const productsState = useWatch({
        control,
        name: "product"
    })

    const { fields, append, remove } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormProvider)
        name: "payment_method", // unique name for your Field Array
      });

      const { fields: products, append: addProduct, remove: removeProduct } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormProvider)
        name: "product", // unique name for your Field Array
      });


    const router = useRouter();

const onSubmit = async (data: Sale) => {
    if(!foundClient) return;
    const PARAMS = !!saleId ? `/${saleId}` : ''
    try{
        const res = await axios(
            `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/sales${PARAMS}`, 
            {
                method : !!saleId ? 'PUT' : 'POST',
                data : {...data, client: foundClient._id},
                withCredentials: true
            }   
        );
        reset();
        router.push("/");
    }catch(error){
        console.error("Error submit data", error);
    }
}

useEffect(() => {
    const currentProducts = getValues("product")
    if(currentProducts?.length > 0){
        let amount = currentProducts.reduce(
            (prev, curr) => prev + curr.qty * (curr.total),
            0
        )
        setTotalAmount(amount)
        setValue(`payment_method.0.amount`, amount)
    }
}, [productsState]);

console.log({totalAmount})

  return (
    <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl marginBottom={5} isInvalid={!!errors.client_document}>
                <FormLabel>Documento del cliente</FormLabel>
                <Flex gap={3}>
                    <IconButton 
                                aria-label='Search Database'
                                icon={<SearchIcon />}
                                onClick={ async () => {
                                    const document = getValues('client_document')
                                    console.log({document})
                                    if(!document) return
                                    const { data } = await axios.get(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/clients/document/${document}`, {withCredentials: true})
                                        setFoundClient(data.data)
                                }}
                            />
                    <Input type="text" placeholder="Ingrese numero de documento"{...register("client_document")}/>
                </Flex>
                {!!foundClient && (
                    <Card mt={3} p={2}>
                        <Text>{foundClient.firstname}</Text>
                    </Card>
                )}
                <FormErrorMessage>{errors.client_document?.message}</FormErrorMessage>
            </FormControl>
            <FormControl marginBottom={5} isInvalid={!!errors.operation_date}>
                <FormLabel>Fecha de la operacion</FormLabel>
                <Input type='date' {...register("operation_date")} />
                <FormErrorMessage>{errors.operation_date?.message}</FormErrorMessage>
            </FormControl>
            <Flex alignItems="center" justifyContent="space-between" mt={8}>
                <Heading size="lg">Productos</Heading>
                <Button 
                size="xs"
                fontSize="1rem"
                lineHeight="1rem"
                py={4}
                colorScheme='blue'
                onClick={() => addProduct(defaultProduct)}>
                    Agregar
                </Button>
            </Flex>
            <Divider mb="4" mt="2" />
            <Flex flexDir="column" mb={4}>
                {products.map((field, index) => 
                <Flex key={index} gap={3} alignItems="flex-end" marginBottom={5}>
                    <IconButton 
                            disabled={!field.code}
                            aria-label='Search Database'
                            icon={<SearchIcon />}
                            onClick={ async () => {
                                const code = getValues(`product.${index}.code`)
                                console.log({code})
                                if(!code) return
                                const { data } = await axios.get(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/products/${code}`, {withCredentials: true})
                                const product: Product = data.data
                                const {supplier_cost, micro, iva, profit_margin, salvament_margin } = product
                                const baseCost = micro + supplier_cost
                                const minimunCost = baseCost / (1 - salvament_margin)
                                const finalPrice = +(minimunCost / (1 - profit_margin)).toFixed(3)


                                if(!!product){
                                    setValue(`product.${index}`, {
                                        code: code,
                                        name: product.name,
                                        qty: 1,
                                        total: finalPrice,
                                    })
                                }else{
                                    console.log("No existe un producto con ese codigo")
                                }
                            }}
                        />
                    <FormControl flex={2}>
                        { index === 0 && <FormLabel>Codigo</FormLabel> }
                        <Input type='text' placeholder='Codigo' {...register(`product.${index}.code`)} />
                    </FormControl>
                    <FormControl flex={5}>
                        { index === 0 && <FormLabel>Denominacion</FormLabel>}
                        <Input type='text' placeholder='Denominacion' {...register(`product.${index}.name`)} disabled/>
                    </FormControl>
                    <FormControl flex={2}>  
                        <Flex alignItems="center" justifyContent="flex-end">
                            { index === 0 && <FormLabel>Cantidad</FormLabel>}
                            {index > 0 && (
                                <DeleteIcon mb={2} color="red.500"_hover={{color: "red.700", cursor: "pointer"}} onClick={() => removeProduct(index)} />
                            )}
                        </Flex>
                            <Input type='number' {
                                ...register(`product.${index}.qty`, {valueAsNumber: true})} 
                                />
                    </FormControl>
                </Flex>)}
            </Flex>
            <Flex flexDir="column" mb={4}>
                {fields.map((field, index) => 
                <Flex key={index} gap={3} alignItems="flex-end" marginBottom={5}>
                    <FormControl flex={7}>
                        <FormLabel>Metodo</FormLabel>
                        <Select placeholder='Seleccionar' {...register(`payment_method.${index}.method`)}>
                            {PAYMENT_METHOD_TYPES.map((method) => (
                                <option key={method} value={method}>{method}</option>
                            ))}
                        </Select>   
                    </FormControl>
                    <FormControl flex={3} isInvalid={!!errors.payment_method}>
                        <FormLabel>Valor</FormLabel>
                        <Input type='text' placeholder='Valor' {...register(`payment_method.${index}.amount`)} />
                    </FormControl>
                    <FormControl flex={2} isInvalid={!!errors.payment_method}>
                        <FormLabel>Plazo</FormLabel>
                        <Input type='text' placeholder='Plazo' {...register(`payment_method.${index}.time_value`)} />
                    </FormControl>
                    <FormControl flex={4}>  
                        <Flex alignItems="center" justifyContent="space-between">
                            <FormLabel>Periodo</FormLabel>
                            {index > 0 && (
                                <DeleteIcon mb={2} color="red.500"_hover={{color: "red.700", cursor: "pointer"}} onClick={() => remove(index)} />
                            )}
                        </Flex>
                            <Select placeholder='Seleccionar' {...register(`payment_method.${index}.time_unit`)}>
                                {Object.keys(TIME_UNITS.Enum).map((unit) => (
                                    <option key={unit} value={unit}>{unit}</option>
                                ))}
                            </Select>
                    </FormControl>
                </Flex>)}
                <Button onClick={() => append(defaultPM)}>Nuevo metodo</Button>
            </Flex>
            <ButtonGroup>            
                <Button colorScheme="green" type="submit">
                    {!!saleId ? "Guardar Cambios" : "Crear"}
                </Button>
                <Button colorScheme="blue" onClick={() => router.back()}>
                    Volver
                </Button>
            </ButtonGroup>   
        </form>
        <DevTool control={control} />
    </>
                
  )
}

export default SaleForm