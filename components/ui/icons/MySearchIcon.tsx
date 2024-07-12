/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {IconButton} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { useFormContext } from 'react-hook-form'
import { Product } from 'schemas/SaleSchema'

interface Props{
    index: number
}

const MySearchIcon = ({index}: Props) => {
   const {getValues, setValue} =  useFormContext()
   
    return (
        <IconButton 
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
                        unit_price: finalPrice,
                    })
                }else{
                    console.log("No existe un producto con ese codigo")
                }
            }}
        />
    )
}

export default MySearchIcon