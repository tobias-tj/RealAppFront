/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Flex, FormControl, FormLabel } from "@chakra-ui/react"
import MyDeleteIcon from "components/ui/icons/MyDeleteIcon"
import MyInput from "components/ui/inputs/MyInput"
import MySelect from "components/ui/selects/MySelect"
import { useFieldArray } from "react-hook-form"
import { payment_methods_TYPES, Sale, TIME_UNITS } from "schemas/SaleSchema"

interface Props{
    fieldName: keyof Sale
}
function PaymentMethodAdder({ fieldName } : Props){

    const { fields } = useFieldArray({ name: fieldName });

    return(
        <Flex flexDir="column" mb={4}>
        {fields.map((_, index) => 
            <Flex key={index} gap={3} alignItems="flex-end" marginBottom={5}>
                <FormControl flex={7}>
                    <FormLabel>Metodo</FormLabel>
                    <MySelect fieldName={`payment_methods.${index}.method`} label='Metodo' options={payment_methods_TYPES} />
                </FormControl>
                <MyInput fieldName={`payment_methods.${index}.amount`} label='Valor' showLabel={index === 0 } valueAsNumber />
                <MyInput fieldName={`payment_methods.${index}.time_value`} label='Plazo' showLabel={index === 0 } valueAsNumber />
                
                <FormControl flex={4}>  
                    <Flex alignItems="center" justifyContent="space-between">
                        <FormLabel>Periodo</FormLabel>
                
                        <MyDeleteIcon<Sale> fieldName="payment_methods" index={index} />

                    </Flex>
                    <MySelect fieldName={`payment_methods.${index}.time_unit`} label='Periodo' options={Object.keys(TIME_UNITS.Enum)} />

                </FormControl>
            </Flex>)}
        </Flex>
    )
}

export default PaymentMethodAdder