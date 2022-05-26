import * as React from "react";
import {
  ChakraProvider,
  Box,
  VStack,
  HStack,
  extendTheme
} from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { colors } from "./theme/colors";
import { global } from "./theme/styles/global";
import { textStyles } from "./theme/styles/textStyles";
import { Input } from "./theme/components/Input";
import { SelectableList } from "./theme/components/SelectableList";
import { LeftSidebar } from "./components/LeftSidebar";
import { MainContent } from "./components/MainContent";

const theme = extendTheme({
  textStyles,
  styles: { global },
  colors,
  components: {
    Input,
    SelectableList
  }
});
console.log({ theme });

export const App = () => (
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <Box textAlign="center" fontSize="xl">
        <VStack>
          <HStack w="100%">
            <Box flexGrow="1">Head</Box>
            <ColorModeSwitcher  />
          </HStack>
          <HStack w="100%" alignItems="flex-start">
            <Box w="250px" borderRight="1px solid gray">
              <LeftSidebar />
            </Box>
            <Box flexGrow="1">
              <MainContent />
            </Box>
          </HStack>
        </VStack>
      </Box>
    </BrowserRouter>
  </ChakraProvider>
)
