/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Button, ButtonGroup, Card, Container, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Heading, IconButton, Input, Select, Text } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { env } from '~/env'
import { SearchIcon } from '@chakra-ui/icons'
import { defaultPM, ProductFormProps, Sale, saleShema } from 'schemas/SaleSchema'
import MyForm from 'components/ui/forms/MyForm'
import MyInput from 'components/ui/inputs/MyInput'
import ProductAdder from './ProductAdder'
import PaymentMethodAdder from './PaymentMethodAdder'
import { useFieldArray } from 'react-hook-form'
import MyAdderButtons from 'components/ui/buttons/MyAdderButtons'




const SaleForm = ({ saleId} : ProductFormProps) => {
    const [foundClient, setFoundClient] = useState<{
        _id : string,
        firstname: string
    } | null>();


    const router = useRouter();

    const onError = (errors) => console.log(errors);

const onSubmit = async (data: Sale) => {
    if(!foundClient) return;
    const PARAMS = !!saleId ? `/${saleId}` : ''
    try{
        const res = await axios(
            `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/sales${PARAMS}`, 
            {
                method : !!saleId ? 'PUT' : 'POST',
                data : {...data, client: foundClient._id, total_amount: totalAmount},
                withCredentials: true
            }   
        );
        reset();
        router.push("/");
    }catch(error){
        console.error("Error submit data", error);
    }
}


const setDefaultValues = async () => {
    if(!saleId) {
        return { 
            operation_date: new Date(),
            payment_methods: [defaultPM],
            product: [],
        };
    }
    const { data } = await axios.get(
        `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/clients/${saleId}`,
        {withCredentials: true}
    )
    return data.data;
}


  return (
    <>
        <MyForm onSubmit={onSubmit} onError={onError} zodSchema={saleShema} defaultValues={setDefaultValues}>
            <Flex gap={3}>
            <MyInput<Sale> fieldName='client_document' label='Documento del cliente' placeholder='Ingresar documento' />
            <IconButton 
                aria-label='Search Database'
                icon={<SearchIcon />}
                onClick={ async () => {
                    const document = getValues('client_document')
                    // console.log({document})
                    if(!document) return
                    const { data } = await axios.get(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/clients/document/${document}`, {withCredentials: true})
                        setFoundClient(data.data)
                }}/>
                </Flex>
                {!!foundClient && (
                    <Card mt={3} p={2}>
                        <Text>{foundClient.firstname}</Text>
                    </Card>
                )}
            
            <MyInput<Sale> fieldName='operation_date' label='Fecha de la operacion' type="date"/>

            <Flex alignItems="center" justifyContent="space-between" mt={8}>
                <Heading size="lg">Forma De Pago</Heading>
                <MyAdderButtons fieldName='payment_methods' />
            </Flex>
            <Divider mb="4" mt="2" />
            <ProductAdder fieldName="product" />
            <PaymentMethodAdder fieldName="payment_methods" />
            <ButtonGroup>            
                <Button colorScheme="green" type="submit">
                    {!!saleId ? "Guardar Cambios" : "Crear"}
                </Button>
                <Button colorScheme="blue" onClick={() => router.back()}>
                    Volver
                </Button>
            </ButtonGroup>   
        </MyForm>
    </>
                
  )
}

export default SaleForm