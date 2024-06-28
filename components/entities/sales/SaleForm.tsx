import { Button, ButtonGroup, Card, Container, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Select } from '@chakra-ui/react'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { env } from '~/env'
// import DatePicker from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker.css'
import { SingleDatepicker } from "chakra-dayzed-datepicker";


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
    name: z.string(),
    qty: z.number(),
    unit_price: z.number(),
    discount: z.number(),
    total: z.number()
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

export type Sale = z.infer<typeof saleShema>

interface Props{
    saleId? : string
}

const SaleForm = ({ saleId} : Props) => {
    const [startDate, setStartDate] = useState(new Date());


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
            if(!saleId) return { payment_method: [{
                method: "Tarjetas de debito",
                amount: 3000,
                time_unit: "Dias",
                time_value: 0,
            }]};
            const { data } = await axios.get(
                `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/clients/${saleId}`,
                {withCredentials: true}
            )
            return data.data;
        }
    })

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormProvider)
        name: "payment_method", // unique name for your Field Array
      });

      console.log({ fields })

    const router = useRouter();

const onSubmit = async (data: Sale) => {
    const PARAMS = !!saleId ? `/${saleId}` : ''
    try{
        const res = await axios(
            `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/sales${PARAMS}`, 
            {
                method : !!saleId ? 'PUT' : 'POST',
                data,
                withCredentials: true
            }   
        );
        reset();
        router.push("/");
    }catch(error){
        console.error("Error submit data", error);
    }
}
  return (
    <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl marginBottom={5} isInvalid={!!errors.client_document}>
                <FormLabel>Documento del cliente</FormLabel>
                <Input type="text" placeholder="Ingresa tu nombre"{...register("client_document")}/>
                <FormErrorMessage>{errors.client_document?.message}</FormErrorMessage>
            </FormControl>
            <FormControl marginBottom={5} isInvalid={!!errors.operation_date}>
                <FormLabel>Fecha de la operacion</FormLabel>
                <SingleDatepicker date={startDate} ref={register("operation_date").ref} onDateChange={(date : Date) => setValue("operation_date", date)}  />
                <FormErrorMessage>{errors.operation_date?.message}</FormErrorMessage>
            </FormControl>
            {fields.map((field, index) => <Flex key={index} gap={3}>
                <FormControl flex={7}>
                    <FormLabel>Metodo de pago</FormLabel>
                    <Select placeholder='Seleccionar' {...register("payment_method.0.method")}>
                        {PAYMENT_METHOD_TYPES.map((method) => (
                            <option key={method} value={method}>{method}</option>
                        ))}
                    </Select>
                </FormControl>
                <FormControl flex={6} mb={5} isInvalid={!!errors.payment_method}>
                    <FormLabel>Valor</FormLabel>
                    <Input type='text' placeholder='Valor' {...register("payment_method.0.amount")} />
                </FormControl>
                <FormControl flex={6} mb={5} isInvalid={!!errors.payment_method}>
                    <FormLabel>Plazo</FormLabel>
                    <Input type='text' placeholder='Plazo' {...register("payment_method.0.time_value")} />
                </FormControl>
                <FormControl flex={7}>
                    <FormLabel>Tiempo</FormLabel>
                    <Select placeholder='Seleccionar' {...register("payment_method.0.time_unit")}>
                        {Object.keys(TIME_UNITS.Enum).map((unit) => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </Select>
                </FormControl>
            </Flex>)}
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