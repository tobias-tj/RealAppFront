import { Button, ButtonGroup, Card, Container, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Select } from '@chakra-ui/react'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { env } from '~/env'


const DOC_TYPES = [
    "RUC",
    "Cédula",
    "Pasaporte",
    "Identificación exterior"
] as const


const shema = z.object({
    firstname: z.string().min(3),
    lastname: z.string().min(3),
    email : z.string().email("El email no es valido."),
    document_type: z.enum(DOC_TYPES),
    document_value: z.string().min(4),
})

export type Client = z.infer<typeof shema>

interface Props{
    clientId? : string
}

const ClientForm = ({ clientId} : Props) => {
    const { 
        register,
        control, 
        reset,
        getValues,
        handleSubmit, 
        formState: {errors},
    } = useForm<Client>({
        resolver:  zodResolver(shema),
        defaultValues: async () => {
            if(!clientId) return {};
            const { data } = await axios.get(
                `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/clients/${clientId}`,
                {withCredentials: true}
            )
            return data.data;
        }
    })

const router = useRouter();

const onSubmit = async (data: Client) => {
    const PARAMS = !!clientId ? `/${clientId}` : ''
    try{
        const res = await axios(
            `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/clients${PARAMS}`, 
            {
                method : !!clientId ? 'PUT' : 'POST',
                data,
                withCredentials: true
            }   
        );
        reset();
        router.push("/clients");
    }catch(error){
        console.error("Error submit data", error);
    }
}
  return (
    <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl marginBottom={5} isInvalid={!!errors.firstname}>
                <FormLabel>Nombre</FormLabel>
                <Input type="text" placeholder="Ingresa tu nombre"{...register("firstname")}/>
                <FormErrorMessage>{errors.firstname?.message}</FormErrorMessage>
            </FormControl>
            <FormControl marginBottom={5} isInvalid={!!errors.lastname}>
                <FormLabel>Apellido</FormLabel>
                <Input type="text" placeholder="Ingresa tu apellido"{...register("lastname")}/>
                <FormErrorMessage>{errors.lastname?.message}</FormErrorMessage>
            </FormControl>
            <FormControl marginBottom={5} isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input 
                type='text'
                placeholder="Ingresa tu email" 
                {...register("email")}  
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
            <Flex gap={3}>
                <FormControl flex={7}>
                    <FormLabel>Tipo de documento</FormLabel>
                    <Select placeholder='Seleccionar' {...register("document_type")}>
                        {DOC_TYPES.map((dt) => (
                            <option key={dt} value={dt}>{dt}</option>
                        ))}
                    </Select>
                </FormControl>
                <FormControl flex={6} marginBottom={5} isInvalid={!!errors.document_value}>
                    <FormLabel>Documento</FormLabel>
                    <Input type="text" placeholder="Ingresa tu numero de documento" {...register("document_value")}/>
                    <FormErrorMessage>{errors.document_value?.message}</FormErrorMessage>
                </FormControl>
            </Flex>
            <ButtonGroup>            
                <Button colorScheme="green" type="submit">
                    {!!clientId ? "Guardar Cambios" : "Crear"}
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

export default ClientForm