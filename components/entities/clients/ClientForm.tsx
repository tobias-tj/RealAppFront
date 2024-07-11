import { Button, ButtonGroup, Card, Container, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Select } from '@chakra-ui/react'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import MyForm from 'components/ui/forms/MyForm'
import MyInput from 'components/ui/inputs/MyInput'
import MySelect from 'components/ui/selects/MySelect'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Client, ClientFormProps, ClientSchema, DOC_TYPES } from 'schemas/ClientSchema'
import { env } from '~/env'






const ClientForm = ({ clientId} : ClientFormProps) => {

    const router = useRouter();

    const onSubmit = async (data: Client, reset: any) => {
        const PARAMS = !!clientId ? `/${clientId}` : ''
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
    }

    const onError = () => console.log("Errors")

    const setDefaultValue =  async () => {
        if(!clientId) return {};
        const { data } = await axios.get(
            `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/clients/${clientId}`,
            {withCredentials: true}
        )
        return data.data;
    }

  return (
    <>
        <MyForm onSubmit={onSubmit} onError={onError} zodSchema={ClientSchema} defaultValues={setDefaultValue}>
            <MyInput fieldName='firstname' label='Nombre' placeholder='Ingresar nombre' />
            <MyInput fieldName='lastname' label='Apellido' placeholder='Ingresar apellido' />
            <MyInput fieldName='email' label='Email' placeholder='Ingresar email' />
            <Flex gap={3} mb={5}>
                <MySelect fieldName='document_type' label='Tipo de Documento' options={DOC_TYPES} />
                <MyInput fieldName='document_value' label='Numero de documento' placeholder='Ingresar documento' mb={0} />
            </Flex>
            <ButtonGroup>            
                <Button colorScheme="green" type="submit">
                    {!!clientId ? "Guardar Cambios" : "Crear"}
                </Button>
                <Button colorScheme="blue" onClick={() => router.back()}>
                    Volver
                </Button>
            </ButtonGroup>   
        </MyForm>
    </>
                
  )
}

export default ClientForm