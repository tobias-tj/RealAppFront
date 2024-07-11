import { Flex, Spinner } from "@chakra-ui/react";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { DefaultValues, FieldValues } from 'react-hook-form';
import type {AnyZodObject, z } from "zod";

interface Props {
    defaultValues?: {}
    zodSchema: AnyZodObject
    onSubmit: (data: any, reset: any) => void
    onError: (data: FieldValues) => void
    children: ReactNode
}

const MyForm = ({defaultValues, zodSchema, onSubmit, onError, children} : Props) => { 
    type EntityType = z.infer<typeof zodSchema>    
    const methods = useForm<EntityType>({
        resolver:  zodResolver(zodSchema),
        defaultValues,
    })

    if(methods.formState.isLoading){
        return (
            <Flex height={20} alignItems="center" justifyContent="center">
                <Spinner alignSelf="center" colorScheme="purple" color="purple" />
            </Flex>
        )
    }

    return (
       <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(
                (data) => onSubmit(data, methods.reset), 
                onError)}>
                {children}
            </form>
            <DevTool control={methods.control} />
       </FormProvider>
    )
}

export default MyForm