import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/dist/shared/lib/utils";
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'


const queryClient = new QueryClient()



import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
    
  );
};

export default MyApp;
