/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Flex } from "@chakra-ui/react"
import MyDeleteIcon from "components/ui/icons/MyDeleteIcon"
import MySearchIcon from "components/ui/icons/MySearchIcon"
import MyInput from "components/ui/inputs/MyInput"
import { useEffect } from "react"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { Sale } from "schemas/SaleSchema"

interface Props{
    fieldName: keyof Sale
}
function ProductAdder({ fieldName } : Props){
    const {setValue, getValues } = useFormContext()
    const { fields } = useFieldArray({ name: fieldName as string });
    const productsState = useWatch({
        name: fieldName
    })

    useEffect(() => {
        const currentProducts = getValues(fieldName)
        if(currentProducts?.length > 0){
            let amount = currentProducts.reduce(
                (prev: any, curr: any) => prev + curr.qty * curr.unit_price,
                0
            )
            // setTotalAmount(amount)
            setValue(`payment_methods.0.amount`, amount)
        }
    }, [productsState]);

    return(
        <Flex flexDir="column" mb={4}>
        {fields.map((_, index) => 
            <Flex key={index} gap={3} alignItems="flex-end" marginBottom={5}>
                <MySearchIcon index={index}  />
                <MyInput fieldName={`product.${index}.code`} label='Codigo' showLabel={index === 0} />
                <MyInput fieldName={`product.${index}.name`} label="Denominacion" showLabel={index === 0} />
                <MyInput fieldName={`product.${index}.qty`} label='Cantidad' showLabel={index === 0 } valueAsNumber />
                <MyDeleteIcon<Sale> fieldName="product" index={index} />
            </Flex>)}
        </Flex>
    )
}

export default ProductAdder